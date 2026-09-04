import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
    Users, Briefcase, Eye, Mail, ArrowUpRight, 
    BarChart2, Calendar, ChevronDown,
    ShieldCheck, Server, Database, Activity, Clock,
    Settings, Star, Newspaper, MessageSquare, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { data, user } = useAdmin();
    const navigate = useNavigate();

    const ds = data.dashboardStats?.stats;

    const stats = [
        { 
            label: 'Total Users', 
            value: ds?.users?.value ?? data.users?.length ?? 0, 
            icon: <Users size={22} />, 
            color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
            trend: ds?.users?.trend ?? '+12%',
            path: '/admin/users'
        },
        { 
            label: 'Active Projects', 
            value: ds?.projects?.value ?? data.projects?.filter(p => p.status === 'Live' || p.status === 'Development').length ?? 0, 
            icon: <Briefcase size={22} />, 
            color: 'bg-[#04C244]/10 text-[#04C244] border-[#04C244]/20', 
            trend: ds?.projects?.trend ?? '+5%',
            path: '/admin/projects'
        },
        { 
            label: 'Total Visitors', 
            value: (ds?.visitors?.value ?? data.visitorCount ?? 0).toLocaleString(), 
            icon: <Eye size={22} />, 
            color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', 
            trend: ds?.visitors?.trend ?? '+28%',
            path: '/admin/analytics'
        },
        { 
            label: 'Unread Messages', 
            value: ds?.messages?.value ?? data.messages?.filter(m => !m.is_read).length ?? 0, 
            icon: <Mail size={22} />, 
            color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', 
            trend: ds?.messages?.trend ?? '0%',
            path: '/admin/messages'
        },
    ];

    const [activeTab, setActiveTab] = useState('Week');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const chartDataMap = data.dashboardStats?.chartData || {
        'Day': [
            { day: '08:00', value: 20 },
            { day: '10:00', value: 35 },
            { day: '12:00', value: 60 },
            { day: '14:00', value: 85 },
            { day: '16:00', value: 45 },
            { day: '18:00', value: 55 },
            { day: '20:00', value: 30 },
        ],
        'Week': [
            { day: 'Mon', value: 40 },
            { day: 'Tue', value: 65 },
            { day: 'Wed', value: 45 },
            { day: 'Thu', value: 90 },
            { day: 'Fri', value: 55 },
            { day: 'Sat', value: 80 },
            { day: 'Sun', value: 70 },
        ],
        'Month': [
            { day: 'Jan', value: 30 },
            { day: 'Feb', value: 45 },
            { day: 'Mar', value: 55 },
            { day: 'Apr', value: 85 },
            { day: 'May', value: 95 },
            { day: 'Jun', value: 70 },
            { day: 'Jul', value: 80 },
        ]
    };

    const currentChartData = chartDataMap[activeTab];

    const now = new Date();
    const activeHighlightIndex = (() => {
        if (activeTab === 'Day') {
            const h = now.getHours();
            if (h < 9)  return 0;
            if (h < 11) return 1;
            if (h < 13) return 2;
            if (h < 15) return 3;
            if (h < 17) return 4;
            if (h < 19) return 5;
            return 6;
        }
        if (activeTab === 'Week') {
            return (now.getDay() + 6) % 7;
        }
        return now.getMonth();
    })();

    const quickActions = [
        { label: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} />, color: 'text-[#04C244] bg-[#04C244]/10 border-[#04C244]/20' },
        { label: 'Services', path: '/admin/services', icon: <Settings size={18} />, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
        { label: 'Messages', path: '/admin/messages', icon: <MessageSquare size={18} />, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
        { label: 'Testimonials', path: '/admin/testimonials', icon: <Star size={18} />, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
        { label: 'News', path: '/admin/news', icon: <Newspaper size={18} />, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart2 size={18} />, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Top Hero Banner - Always High-Contrast Dark Gradient */}
            <div className="relative bg-[#0A0C10] text-white border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl" data-theme-context="dark">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#04C244]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="px-3.5 py-1 bg-[#04C244]/20 border border-[#04C244]/40 rounded-full text-xs font-extrabold text-[#04C244] flex items-center gap-1.5 shadow-sm">
                                <Calendar size={13} className="text-[#04C244]" />
                                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="px-3.5 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                                <Clock size={13} className="text-slate-300" />
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            Welcome back, <span className="text-[#04C244] font-black">{user?.name || 'Admin'}</span> 👋
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1 max-w-xl">
                            Here is an overview of <strong className="text-white">Dhiil Tech</strong> operations, client activity, and traffic analytics.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Hub */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">Quick Navigation</h2>
                    <span className="text-xs text-slate-400 font-medium">Fast Access Modules</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map((qa, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(qa.path)}
                            className="flex items-center gap-3 p-3.5 bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/5 rounded-2xl hover:border-[#04C244]/40 hover:scale-[1.02] transition-all group text-left shadow-xs"
                        >
                            <div className={`p-2.5 rounded-xl border ${qa.color} group-hover:scale-110 transition-transform`}>
                                {qa.icon}
                            </div>
                            <div>
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#04C244] transition-colors">{qa.label}</h4>
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
                                    Open <ChevronDown size={10} className="-rotate-90 text-slate-400" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 4 Primary Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(stat.path)}
                        className="bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/5 rounded-3xl p-5 sm:p-6 hover:border-[#04C244]/40 hover:shadow-xl hover:shadow-[#04C244]/5 transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-xs"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color} border`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <ArrowUpRight size={12} />
                                {stat.trend}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-extrabold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <div className="flex items-baseline justify-between">
                                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-[#04C244] transition-colors">{stat.value}</p>
                                <span className="text-slate-400 group-hover:text-[#04C244] transition-colors">
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid: Chart + System Status + Recent Projects + Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Visits Chart (2 Cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Activity size={20} className="text-[#04C244]" /> Visits Overview
                            </h3>
                            <p className="text-slate-500 text-xs font-medium mt-0.5">{activeTab}ly traffic & performance growth analytics</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5 self-start sm:self-auto">
                            {['Day', 'Week', 'Month'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${activeTab === tab ? 'bg-[#04C244] text-black shadow-md shadow-[#04C244]/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-64 sm:h-72 w-full mt-4">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                            {[100, 75, 50, 25, 0].map((val) => (
                                <div key={val} className="flex items-center gap-4 w-full">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 w-6 text-right">{val}%</span>
                                    <div className="flex-1 border-t border-slate-200 dark:border-white/5"></div>
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-0 left-10 flex items-end justify-between gap-2 sm:gap-4 px-2 h-[calc(100%-16px)]">
                            {currentChartData.map((item, i) => (
                                <div key={`${activeTab}-${i}`} className="flex-1 flex flex-col justify-end h-full group relative">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.value}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.03 }}
                                        className={`w-full max-w-[36px] mx-auto rounded-t-xl relative group-hover:brightness-110 transition-all cursor-pointer ${
                                            i === activeHighlightIndex
                                            ? 'bg-gradient-to-t from-[#04C244] to-emerald-400 shadow-[0_0_20px_rgba(4,194,68,0.3)]' 
                                            : 'bg-slate-200 dark:bg-white/10'
                                        }`}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl border border-white/10 z-20">
                                            {item.value} Visits
                                        </div>
                                    </motion.div>
                                    
                                    <div className="absolute -bottom-7 left-0 right-0 text-center">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${i === activeHighlightIndex ? 'text-[#04C244]' : 'text-slate-400'}`}>
                                            {item.day}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Health Status Card */}
                <div className="bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Server size={18} className="text-[#04C244]" /> System Health
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                99.98% Healthy
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-[#04C244]/10 text-[#04C244]"><Database size={16} /></div>
                                    <div>
                                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">Database Engine</p>
                                        <p className="text-[10px] text-slate-500">Neon Cloud PostgreSQL</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-extrabold text-[#04C244] bg-[#04C244]/10 px-2.5 py-0.5 rounded-md">Connected</span>
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><Server size={16} /></div>
                                    <div>
                                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">Backend REST API</p>
                                        <p className="text-[10px] text-slate-500">Node.js Express + Sequelize</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-extrabold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-md">v1.0.0 Active</span>
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500"><ShieldCheck size={16} /></div>
                                    <div>
                                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">Authentication</p>
                                        <p className="text-[10px] text-slate-500">JWT + SSL Encryption</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-extrabold text-purple-500 bg-purple-500/10 px-2.5 py-0.5 rounded-md">Secure</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-slate-400 text-xs">
                        <span className="font-semibold text-slate-500">System Name</span>
                        <span className="font-bold text-slate-900 dark:text-white">Dhiil Tech</span>
                    </div>
                </div>

            </div>

            {/* Bottom Grid: Recent Projects & Customer Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Recent Projects */}
                <div className="bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Briefcase size={18} className="text-[#04C244]" /> Recent Projects
                            </h3>
                            <p className="text-xs text-slate-500">Latest software solutions and products</p>
                        </div>
                        <button onClick={() => navigate('/admin/projects')} className="text-xs font-bold text-[#04C244] hover:underline flex items-center gap-1">
                            View All <ArrowRight size={13} />
                        </button>
                    </div>

                    {data.projects && data.projects.length > 0 ? (
                        <div className="space-y-4">
                            {data.projects.slice(0, 4).map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#04C244]/40 transition-all group">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-[#04C244]/10 text-[#04C244] flex items-center justify-center font-bold shrink-0">
                                            <Briefcase size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#04C244] transition-colors truncate">{p.title || p.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium truncate">{p.client || 'Client Solution'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${p.status === 'Live' ? 'bg-[#04C244]/15 text-[#04C244]' : 'bg-blue-500/15 text-blue-500'}`}>
                                        {p.status || 'Active'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500 text-xs font-medium">
                            No projects added yet.
                        </div>
                    )}
                </div>

                {/* Customer Inquiries Inbox */}
                <div className="bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Mail size={18} className="text-rose-500" /> Recent Messages
                            </h3>
                            <p className="text-xs text-slate-500">Customer inquiries and contact forms</p>
                        </div>
                        <button onClick={() => navigate('/admin/messages')} className="text-xs font-bold text-[#04C244] hover:underline flex items-center gap-1">
                            Inbox <ArrowRight size={13} />
                        </button>
                    </div>

                    {data.messages && data.messages.length > 0 ? (
                        <div className="space-y-4">
                            {data.messages.slice(0, 4).map((m, i) => (
                                <div key={i} onClick={() => navigate('/admin/messages')} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-rose-500/40 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors truncate">{m.name}</h4>
                                                {!m.is_read && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium truncate">{m.subject || m.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold">
                                        {m.created_at ? new Date(m.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500 text-xs font-medium">
                            No contact messages received yet.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
