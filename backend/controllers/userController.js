import { User, Role, Permission } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields } from '../utils/validators.js';
import { hashPassword, checkPassword } from '../utils/security.js';

const ROLE_MAPPING = {
  'superadmin': 1,
  'super admin': 1,
  'admin': 2,
  'administrator': 2,
  'editor': 3,
  'employee': 4,
  'support': 4,
  'viewer': 5
};

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      where: { is_deleted: 0 },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });
    const { code, response } = successResponse(users.map(u => u.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching users: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function createUser(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['name', 'email', 'password']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const password = data.password;

    const roleName = String(data.role || 'Admin').trim().toLowerCase();
    const role_id = ROLE_MAPPING[roleName] || 2;

    const hashedPassword = await hashPassword(password);

    const existingUser = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });

    if (existingUser) {
      if (existingUser.is_deleted) {
        existingUser.is_deleted = 0;
        existingUser.name = name;
        existingUser.password_hash = hashedPassword;
        existingUser.role_id = role_id;
        existingUser.status = data.status || 'Active';
        await existingUser.save();

        const { code, response } = successResponse(existingUser.toDict(), 'User reactivated successfully', 200);
        return res.status(code).json(response);
      } else {
        const { code, response } = errorResponse('A user with this email already exists.', 409);
        return res.status(code).json(response);
      }
    }

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role_id,
      status: data.status || 'Active'
    });

    const refreshedUser = await User.findOne({
      where: { id: newUser.id },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });

    const { code, response } = successResponse(refreshedUser.toDict(), 'User created successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error creating user: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id, is_deleted: 0 },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });

    if (!user) {
      const { code, response } = errorResponse('User not found', 404);
      return res.status(code).json(response);
    }

    const data = req.body || {};

    if (data.name) user.name = data.name.trim();

    if (data.email) {
      const email = data.email.trim().toLowerCase();
      if (email !== user.email) {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
          const { code, response } = errorResponse('A user with this email already exists.', 409);
          return res.status(code).json(response);
        }
        user.email = email;
      }
    }

    if (data.password) {
      const oldPassword = data.old_password || '';
      if (!oldPassword) {
        const { code, response } = errorResponse('Current password is required to set a new password.', 400);
        return res.status(code).json(response);
      }
      if (!(await checkPassword(oldPassword, user.password_hash))) {
        const { code, response } = errorResponse('Current password is incorrect.', 401);
        return res.status(code).json(response);
      }
      user.password_hash = await hashPassword(data.password);
    }

    if (data.role) {
      const roleName = String(data.role).trim().toLowerCase();
      user.role_id = ROLE_MAPPING[roleName] || 2;
    }

    if (data.status) user.status = data.status;

    await user.save();

    const refreshedUser = await User.findOne({
      where: { id: user.id },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });

    const { code, response } = successResponse(refreshedUser.toDict(), 'User updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating user: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id, is_deleted: 0 } });
    if (!user) {
      const { code, response } = errorResponse('User not found', 404);
      return res.status(code).json(response);
    }

    user.is_deleted = 1;
    await user.save();

    const { code, response } = successResponse(null, 'User deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting user: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
