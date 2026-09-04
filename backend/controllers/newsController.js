import { News } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields, slugify } from '../utils/validators.js';

export async function getAllNews(req, res) {
  try {
    const newsList = await News.findAll({
      where: { is_deleted: 0 },
      order: [['created_at', 'DESC']]
    });
    const { code, response } = successResponse(newsList.map(n => n.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching news: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getNews(req, res) {
  try {
    const { id } = req.params;
    const news = await News.findOne({ where: { id, is_deleted: 0 } });
    if (!news) {
      const { code, response } = errorResponse('Article not found', 404);
      return res.status(code).json(response);
    }
    // Increment view count
    news.view_count += 1;
    await news.save();

    const { code, response } = successResponse(news.toDict());
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching article: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function createNews(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['title', 'content']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const title = data.title.trim();
    let slug = slugify(title);

    const existing = await News.findOne({ where: { slug, is_deleted: 0 } });
    if (existing) {
      slug = `${slug}-${Math.floor(Date.now() / 1000)}`;
    }

    const status = data.status || 'Draft';
    const published_at = status === 'Published' ? new Date() : null;

    const news = await News.create({
      author_id: req.user ? req.user.id : null,
      title,
      slug,
      content: data.content,
      excerpt: data.excerpt || (data.content ? data.content.substring(0, 150) : ''),
      image: data.image || data.img || '',
      category: data.category || 'General',
      tags: data.tags || '',
      status,
      is_featured: data.is_featured ? 1 : 0,
      published_at
    });

    const { code, response } = successResponse(news.toDict(), 'Article created successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error creating article: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateNews(req, res) {
  try {
    const { id } = req.params;
    const news = await News.findOne({ where: { id, is_deleted: 0 } });
    if (!news) {
      const { code, response } = errorResponse('Article not found', 404);
      return res.status(code).json(response);
    }

    const data = req.body || {};

    if (data.title) news.title = data.title.trim();
    if (data.content) news.content = data.content;
    if (data.excerpt !== undefined) news.excerpt = data.excerpt;
    if (data.image !== undefined || data.img !== undefined) news.image = data.image || data.img;
    if (data.category !== undefined) news.category = data.category;
    if (data.tags !== undefined) news.tags = data.tags;
    if (data.is_featured !== undefined) news.is_featured = data.is_featured ? 1 : 0;

    if (data.status && data.status !== news.status) {
      news.status = data.status;
      if (data.status === 'Published' && !news.published_at) {
        news.published_at = new Date();
      }
    }

    await news.save();
    const { code, response } = successResponse(news.toDict(), 'Article updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating article: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteNews(req, res) {
  try {
    const { id } = req.params;
    const news = await News.findOne({ where: { id, is_deleted: 0 } });
    if (!news) {
      const { code, response } = errorResponse('Article not found', 404);
      return res.status(code).json(response);
    }

    news.is_deleted = 1;
    await news.save();

    const { code, response } = successResponse(null, 'Article deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting article: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
