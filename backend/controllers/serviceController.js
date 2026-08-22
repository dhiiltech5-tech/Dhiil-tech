import { Service } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields, slugify } from '../utils/validators.js';

export async function getAllServices(req, res) {
  try {
    const services = await Service.findAll({
      order: [['created_at', 'DESC']]
    });
    const { code, response } = successResponse(services.map(s => s.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching services: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getService(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      const { code, response } = errorResponse('Service not found', 404);
      return res.status(code).json(response);
    }
    const { code, response } = successResponse(service.toDict());
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching service: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function createService(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['title', 'description']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const title = data.title.trim();
    let slug = slugify(title);

    const existing = await Service.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Date.now() / 1000)}`;
    }

    const service = await Service.create({
      title,
      slug,
      description: data.description,
      icon: data.icon || 'fas fa-laptop-code',
      status: data.status || 'Active'
    });

    const { code, response } = successResponse(service.toDict(), 'Service created successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error creating service: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      const { code, response } = errorResponse('Service not found', 404);
      return res.status(code).json(response);
    }

    const data = req.body || {};

    if (data.title || data.name) {
      service.title = (data.title || data.name).trim();
    }
    if (data.desc || data.description) {
      service.description = (data.desc || data.description).trim();
    }
    if (data.icon !== undefined) service.icon = data.icon;
    if (data.status !== undefined) service.status = data.status;

    await service.save();
    const { code, response } = successResponse(service.toDict(), 'Service updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating service: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      const { code, response } = errorResponse('Service not found', 404);
      return res.status(code).json(response);
    }

    await service.destroy();
    const { code, response } = successResponse(null, 'Service deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting service: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
