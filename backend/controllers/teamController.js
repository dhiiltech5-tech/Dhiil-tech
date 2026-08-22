import { Team } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields } from '../utils/validators.js';

export async function getAllTeam(req, res) {
  try {
    const teamMembers = await Team.findAll({
      order: [['created_at', 'ASC']]
    });
    const { code, response } = successResponse(teamMembers.map(t => t.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching team: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getTeamMember(req, res) {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);
    if (!member) {
      const { code, response } = errorResponse('Team member not found', 404);
      return res.status(code).json(response);
    }
    const { code, response } = successResponse(member.toDict());
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching team member: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function createTeamMember(req, res) {
  try {
    const data = req.body || {};
    const position = data.position || data.role;
    const missing = requireFields({ ...data, position }, ['name', 'position']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const member = await Team.create({
      name: data.name.trim(),
      position: position.trim(),
      image: data.image || '',
      bio: data.bio || '',
      linkedin: data.linkedin || '',
      github: data.github || '',
      twitter: data.twitter || ''
    });

    const { code, response } = successResponse(member.toDict(), 'Team member added successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error creating team member: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateTeamMember(req, res) {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);
    if (!member) {
      const { code, response } = errorResponse('Team member not found', 404);
      return res.status(code).json(response);
    }

    const data = req.body || {};

    if (data.name) member.name = data.name.trim();
    if (data.position || data.role) member.position = (data.position || data.role).trim();
    if (data.image !== undefined) member.image = data.image;
    if (data.bio !== undefined) member.bio = data.bio;
    if (data.linkedin !== undefined) member.linkedin = data.linkedin;
    if (data.github !== undefined) member.github = data.github;
    if (data.twitter !== undefined) member.twitter = data.twitter;

    await member.save();
    const { code, response } = successResponse(member.toDict(), 'Team member updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating team member: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteTeamMember(req, res) {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);
    if (!member) {
      const { code, response } = errorResponse('Team member not found', 404);
      return res.status(code).json(response);
    }

    await member.destroy();
    const { code, response } = successResponse(null, 'Team member deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting team member: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
