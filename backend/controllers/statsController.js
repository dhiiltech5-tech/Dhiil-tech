import { Visit, Setting, User, Project, Contact } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { Op } from 'sequelize';

export async function trackVisit(req, res) {
  try {
    let ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || '';
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    const userAgent = req.headers['user-agent'] || '';

    // Throttling: Avoid counting the same IP within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await Visit.findOne({
      where: {
        ip_address: ip,
        created_at: { [Op.gte]: fiveMinutesAgo }
      }
    });

    if (!existing) {
      await Visit.create({ ip_address: ip, user_agent: userAgent });
    }

    const totalVisitors = await Visit.count();
    const { code, response } = successResponse({ visitorCount: totalVisitors }, 'Visit tracked successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error tracking visit: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getVisitorCount(req, res) {
  try {
    const totalVisitors = await Visit.count();
    const { code, response } = successResponse({ visitorCount: totalVisitors }, 'Visitor count retrieved successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error getting visitor count: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getPublicStats(req, res) {
  try {
    const settings = await Setting.findOne();
    if (!settings) {
      const { code, response } = successResponse({
        projects: 1,
        clients: 20,
        services: 7,
        satisfaction: 99
      }, 'Public stats retrieved successfully');
      return res.status(code).json(response);
    }

    const { code, response } = successResponse({
      projects: settings.projects_done,
      clients: settings.trusted_partners,
      services: settings.services_provided,
      satisfaction: settings.satisfaction_rate
    }, 'Public stats retrieved successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error getting public stats: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getDashboardStats(req, res) {
  try {
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 1. Users
    const totalUsers = await User.count({ where: { is_deleted: 0 } });
    const usersThisMonth = await User.count({ where: { is_deleted: 0, created_at: { [Op.gte]: lastMonth } } });
    const usersBefore = totalUsers - usersThisMonth;
    const userTrend = `+${Math.round(usersBefore ? (usersThisMonth / usersBefore) * 100 : (usersThisMonth ? 100 : 0))}%`;

    // 2. Active Projects
    const activeProjects = await Project.count({ where: { is_deleted: 0, status: 'Live' } });
    const projectsThisMonth = await Project.count({ where: { is_deleted: 0, status: 'Live', created_at: { [Op.gte]: lastMonth } } });
    const projectsBefore = activeProjects - projectsThisMonth;
    const projectTrend = `+${Math.round(projectsBefore ? (projectsThisMonth / projectsBefore) * 100 : (projectsThisMonth ? 100 : 0))}%`;

    // 3. Visitors
    const totalVisitors = await Visit.count();
    const visitorsThisMonth = await Visit.count({ where: { created_at: { [Op.gte]: lastMonth } } });
    const visitorsBefore = totalVisitors - visitorsThisMonth;
    const visitorTrend = `+${Math.round(visitorsBefore ? (visitorsThisMonth / visitorsBefore) * 100 : (visitorsThisMonth ? 100 : 0))}%`;

    // 4. Messages
    const unreadMessages = await Contact.count({ where: { is_read: false } });
    const messagesThisMonth = await Contact.count({ where: { is_read: false, created_at: { [Op.gte]: lastMonth } } });
    const messagesBefore = unreadMessages - messagesThisMonth;
    let messageTrend = '0%';
    if (!(messagesBefore === 0 && unreadMessages === 0)) {
      const diff = messagesThisMonth - messagesBefore;
      const sign = diff >= 0 ? '+' : '-';
      messageTrend = `${sign}${Math.round((Math.abs(diff) / (messagesBefore || 1)) * 100)}%`;
    }

    const baseVal = Math.floor(totalVisitors / 100) || 10;
    const chartData = {
      Day: [
        { day: '08:00', value: baseVal * 0.2 },
        { day: '10:00', value: baseVal * 0.35 },
        { day: '12:00', value: baseVal * 0.6 },
        { day: '14:00', value: baseVal * 0.85 },
        { day: '16:00', value: baseVal * 0.45 },
        { day: '18:00', value: baseVal * 0.55 },
        { day: '20:00', value: baseVal * 0.3 }
      ],
      Week: [
        { day: 'Mon', value: baseVal * 0.4 },
        { day: 'Tue', value: baseVal * 0.65 },
        { day: 'Wed', value: baseVal * 0.45 },
        { day: 'Thu', value: baseVal * 0.9 },
        { day: 'Fri', value: baseVal * 0.55 },
        { day: 'Sat', value: baseVal * 0.8 },
        { day: 'Sun', value: baseVal * 0.7 }
      ],
      Month: [
        { day: 'Jan', value: baseVal * 0.30 },
        { day: 'Feb', value: baseVal * 0.45 },
        { day: 'Mar', value: baseVal * 0.55 },
        { day: 'Apr', value: baseVal * 0.85 },
        { day: 'May', value: baseVal * 0.95 },
        { day: 'Jun', value: baseVal * 0.70 },
        { day: 'Jul', value: baseVal * 0.80 },
        { day: 'Aug', value: baseVal * 0.60 },
        { day: 'Sep', value: baseVal * 0.75 },
        { day: 'Oct', value: baseVal * 0.65 },
        { day: 'Nov', value: baseVal * 0.90 },
        { day: 'Dec', value: baseVal * 0.50 }
      ]
    };

    const { code, response } = successResponse({
      stats: {
        users: { value: totalUsers, trend: userTrend },
        projects: { value: activeProjects, trend: projectTrend },
        visitors: { value: totalVisitors, trend: visitorTrend },
        messages: { value: unreadMessages, trend: messageTrend }
      },
      chartData
    }, 'Dashboard stats retrieved successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error getting dashboard stats: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getAnalytics(req, res) {
  try {
    const now = new Date();
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const prevPeriodStart = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Fetch total & visits in 2 fast queries max
    const totalVisitors = await Visit.count();
    const newVisitors = await Visit.count({ where: { created_at: { [Op.gte]: lastMonth } } });
    const prevPeriodNew = await Visit.count({
      where: {
        created_at: {
          [Op.gte]: prevPeriodStart,
          [Op.lt]: lastMonth
        }
      }
    });

    const newVisitorTrend = Math.round(((newVisitors - prevPeriodNew) / (prevPeriodNew || 1)) * 100);
    const newVisitorTrendStr = newVisitorTrend >= 0 ? `+${newVisitorTrend}%` : `${newVisitorTrend}%`;

    // Fetch visits for the current year in ONE single query
    const yearVisits = await Visit.findAll({
      attributes: ['ip_address', 'user_agent', 'created_at'],
      where: {
        created_at: { [Op.gte]: yearStart }
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyViews = Array(12).fill(0);
    const monthlyUniqueSets = Array.from({ length: 12 }, () => new Set());

    let mobileCount = 0;
    let tabletCount = 0;
    let desktopCount = 0;

    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone'];
    const tabletKeywords = ['tablet', 'ipad', 'kindle', 'playbook', 'silk'];

    for (const v of yearVisits) {
      if (v.created_at) {
        const m = new Date(v.created_at).getMonth();
        if (m >= 0 && m < 12) {
          monthlyViews[m]++;
          if (v.ip_address) {
            monthlyUniqueSets[m].add(v.ip_address);
          }
        }
      }

      const ua = (v.user_agent || '').toLowerCase();
      if (tabletKeywords.some(k => ua.includes(k))) {
        tabletCount++;
      } else if (mobileKeywords.some(k => ua.includes(k))) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    }

    const monthlyChart = monthNames.map((month, i) => ({
      month,
      pageViews: monthlyViews[i],
      uniqueVisitors: monthlyUniqueSets[i].size
    }));

    const total = totalVisitors || 1;
    const devices = [
      { name: 'Mobile', value: Math.round((mobileCount / total) * 100) },
      { name: 'Desktop', value: Math.round((desktopCount / total) * 100) },
      { name: 'Tablet', value: Math.round((tabletCount / total) * 100) }
    ];

    const { code, response } = successResponse({
      totalVisitors,
      newVisitors: {
        value: newVisitors,
        trend: newVisitorTrendStr,
        isPositive: newVisitorTrend >= 0
      },
      monthlyChart,
      devices
    }, 'Analytics data retrieved successfully');
    return res.status(code).json(response);
  } catch (err) {
    console.error('Error in getAnalytics:', err);
    const { code, response } = errorResponse(`Error getting analytics: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function exportVisitsCsv(req, res) {
  try {
    const { from: dateFrom, to: dateTo } = req.query;
    const where = {};

    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00`);
      if (dateTo) where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59`);
    }

    const visits = await Visit.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    let csvContent = 'ID,IP Address,User Agent,Date & Time\n';
    for (const v of visits) {
      const dateStr = v.created_at ? new Date(v.created_at).toISOString().replace('T', ' ').substring(0, 19) : '';
      const uaEscaped = `"${(v.user_agent || '').replace(/"/g, '""')}"`;
      csvContent += `${v.id},${v.ip_address || ''},${uaEscaped},${dateStr}\n`;
    }

    const filename = `visits_${dateFrom || 'all'}_to_${dateTo || 'all'}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    const { code, response } = errorResponse(`Error exporting CSV: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
