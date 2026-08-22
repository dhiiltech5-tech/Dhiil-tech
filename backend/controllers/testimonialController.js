import { Testimonial } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields } from '../utils/validators.js';

export async function getAllTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['created_at', 'DESC']]
    });
    const { code, response } = successResponse(testimonials.map(t => t.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching testimonials: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getTestimonial(req, res) {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      const { code, response } = errorResponse('Testimonial not found', 404);
      return res.status(code).json(response);
    }
    const { code, response } = successResponse(testimonial.toDict());
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching testimonial: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function createTestimonial(req, res) {
  try {
    const data = req.body || {};
    const client_name = data.client_name || data.name;
    const feedback = data.feedback || data.review;

    const missing = requireFields({ client_name, feedback }, ['client_name', 'feedback']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const testimonial = await Testimonial.create({
      client_name: client_name.trim(),
      company: data.company || '',
      position: data.position || data.role || '',
      feedback: feedback.trim(),
      rating: data.rating !== undefined ? Number(data.rating) : 5,
      image: data.image || data.img || '',
      status: data.status || 'Published'
    });

    const { code, response } = successResponse(testimonial.toDict(), 'Testimonial created successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error creating testimonial: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateTestimonial(req, res) {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      const { code, response } = errorResponse('Testimonial not found', 404);
      return res.status(code).json(response);
    }

    const data = req.body || {};

    if (data.client_name || data.name) testimonial.client_name = (data.client_name || data.name).trim();
    if (data.company !== undefined) testimonial.company = data.company;
    if (data.position || data.role) testimonial.position = (data.position || data.role).trim();
    if (data.feedback || data.review) testimonial.feedback = (data.feedback || data.review).trim();
    if (data.rating !== undefined) testimonial.rating = Number(data.rating);
    if (data.image !== undefined || data.img !== undefined) testimonial.image = data.image || data.img;
    if (data.status !== undefined) testimonial.status = data.status;

    await testimonial.save();
    const { code, response } = successResponse(testimonial.toDict(), 'Testimonial updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating testimonial: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      const { code, response } = errorResponse('Testimonial not found', 404);
      return res.status(code).json(response);
    }

    await testimonial.destroy();
    const { code, response } = successResponse(null, 'Testimonial deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting testimonial: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
