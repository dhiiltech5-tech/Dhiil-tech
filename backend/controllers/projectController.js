import { Project } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields, slugify } from '../utils/validators.js';

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.findAll({
      where: { is_deleted: 0 },
      order: [['created_at', 'DESC']]
    });
    const { code, response } = successResponse(projects.map(p => p.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching projects: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getProject(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ where: { id, is_deleted: 0 } });
    if (!project) {
      const { code, response } = errorResponse('Project not found', 404);
      return res.status(code).json(response);
    }
    const { code, response } = successResponse(project.toDict());
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching project: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function createProject(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['name']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const name = data.name.trim();
    let slug = slugify(name);

    const existing = await Project.findOne({ where: { slug, is_deleted: 0 } });
    if (existing) {
      slug = `${slug}-${Math.floor(Date.now() / 1000)}`;
    }

    const extra = {
      deadline: data.deadline || '',
      progress: data.progress || 0,
      icon: data.icon || 'fas fa-code',
      description: data.description || ''
    };

    const project = await Project.create({
      title: name,
      slug,
      description: JSON.stringify(extra),
      image: data.image || '',
      demo_link: data.url || '',
      client: data.client || '',
      category: data.category || 'Web Development',
      status: data.status || 'Development'
    });

    const { code, response } = successResponse(project.toDict(), 'Project created successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error creating project: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ where: { id, is_deleted: 0 } });
    if (!project) {
      const { code, response } = errorResponse('Project not found', 404);
      return res.status(code).json(response);
    }

    const data = req.body || {};

    let extra = {};
    if (project.description) {
      try {
        extra = JSON.parse(project.description);
      } catch (e) {
        extra = { description: project.description };
      }
    }

    if (data.name) project.title = data.name.trim();
    if (data.client !== undefined) project.client = data.client;
    if (data.status !== undefined) project.status = data.status;
    if (data.category !== undefined) project.category = data.category;
    if (data.image !== undefined) project.image = data.image;
    if (data.url !== undefined) project.demo_link = data.url;

    if (data.deadline !== undefined) extra.deadline = data.deadline;
    if (data.progress !== undefined) extra.progress = data.progress;
    if (data.icon !== undefined) extra.icon = data.icon;
    if (data.description !== undefined) extra.description = data.description;

    project.description = JSON.stringify(extra);
    await project.save();

    const { code, response } = successResponse(project.toDict(), 'Project updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating project: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ where: { id, is_deleted: 0 } });
    if (!project) {
      const { code, response } = errorResponse('Project not found', 404);
      return res.status(code).json(response);
    }

    project.is_deleted = 1;
    await project.save();

    const { code, response } = successResponse(null, 'Project deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting project: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
