import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User, Role, Permission, TokenBlocklist } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields, isValidEmail, isValidPassword } from '../utils/validators.js';
import { checkPassword, hashPassword } from '../utils/security.js';

const failedLogins = new Map();

export async function login(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['email', 'password']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!isValidEmail(email)) {
      const { code, response } = errorResponse('Invalid email format', 400);
      return res.status(code).json(response);
    }

    if (!isValidPassword(password)) {
      const { code, response } = errorResponse('Invalid email or password', 401);
      return res.status(code).json(response);
    }

    // Check rate limit
    if (failedLogins.has(ip)) {
      const record = failedLogins.get(ip);
      if (record.lockedUntil && now < record.lockedUntil) {
        const { code, response } = errorResponse('Too many failed attempts. Try again later.', 429);
        return res.status(code).json(response);
      } else if (record.lockedUntil && now >= record.lockedUntil) {
        failedLogins.set(ip, { attempts: 0, lockedUntil: null });
      }
    }

    const user = await User.findOne({
      where: { email, is_deleted: 0, status: 'Active' },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });

    if (!user || !(await checkPassword(password, user.password_hash))) {
      const record = failedLogins.get(ip) || { attempts: 0, lockedUntil: null };
      record.attempts += 1;
      if (record.attempts >= 5) {
        record.lockedUntil = now + 15 * 60 * 1000; // 15 mins lock
        console.warn(`BRUTE FORCE PROTECTION TRIGGERED: IP ${ip} locked out for 15 minutes.`);
      }
      failedLogins.set(ip, record);

      const { code, response } = errorResponse('Invalid email or password', 401);
      return res.status(code).json(response);
    }

    // Clear failed attempts on success
    failedLogins.delete(ip);

    const roleSlug = user.role_obj ? user.role_obj.slug : '';
    if (!['superadmin', 'admin', 'editor', 'support', 'viewer'].includes(roleSlug)) {
      const { code, response } = errorResponse('Admin access required', 403);
      return res.status(code).json(response);
    }

    // Update last login
    user.last_login_at = new Date();
    user.last_login_ip = ip;
    await user.save();

    const jwtSecret = process.env.JWT_SECRET_KEY || 'jwt-dev-secret-key';
    const jti = randomUUID();
    const accessToken = jwt.sign(
      { sub: user.id.toString(), id: user.id, jti },
      jwtSecret,
      { expiresIn: '2h' }
    );
    const refreshToken = jwt.sign(
      { sub: user.id.toString(), id: user.id, type: 'refresh' },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const { code, response } = successResponse({
      token: accessToken,
      refresh_token: refreshToken,
      user: user.toDict()
    }, 'Login successful');

    return res.status(code).json(response);
  } catch (err) {
    console.error('Error in login:', err);
    const { code, response } = errorResponse(`Login failed: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function refresh(req, res) {
  try {
    const user = req.user;
    const jwtSecret = process.env.JWT_SECRET_KEY || 'jwt-dev-secret-key';
    const jti = randomUUID();
    const accessToken = jwt.sign(
      { sub: user.id.toString(), id: user.id, jti },
      jwtSecret,
      { expiresIn: '2h' }
    );

    const { code, response } = successResponse({ token: accessToken }, 'Token refreshed');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Refresh failed: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function logout(req, res) {
  try {
    const jti = req.jwtPayload ? req.jwtPayload.jti : null;
    if (jti) {
      await TokenBlocklist.create({ jti });
    }
    const { code, response } = successResponse(null, 'Successfully logged out');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Logout failed: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getCurrentUser(req, res) {
  try {
    const { code, response } = successResponse({ user: req.user.toDict() });
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching user: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateProfile(req, res) {
  try {
    const user = req.user;
    const data = req.body || {};

    if (data.name) user.name = data.name.trim();
    if (data.phone) user.phone = data.phone.trim();
    if (data.avatar) user.avatar = data.avatar;

    if (data.email) {
      const email = data.email.trim().toLowerCase();
      if (email !== user.email) {
        if (!isValidEmail(email)) {
          const { code, response } = errorResponse('Invalid email format', 400);
          return res.status(code).json(response);
        }
        const existing = await User.findOne({ where: { email } });
        if (existing) {
          const { code, response } = errorResponse('Email already in use', 409);
          return res.status(code).json(response);
        }
        user.email = email;
      }
    }

    if (data.password) {
      const newPassword = data.password.trim();
      const oldPassword = (data.old_password || '').trim();

      if (!isValidPassword(newPassword)) {
        const { code, response } = errorResponse('Password does not meet security requirements', 400);
        return res.status(code).json(response);
      }

      if (!oldPassword || !(await checkPassword(oldPassword, user.password_hash))) {
        const { code, response } = errorResponse('Current password is required to set a new password', 401);
        return res.status(code).json(response);
      }

      user.password_hash = await hashPassword(newPassword);
    }

    await user.save();
    const { code, response } = successResponse(user.toDict(), 'Profile updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Update failed: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
