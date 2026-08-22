import jwt from 'jsonwebtoken';
import { User, Role, Permission, TokenBlocklist } from '../models/index.js';
import { errorResponse } from '../utils/responses.js';

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const { code, response } = errorResponse('Missing or invalid Authorization header', 401);
      return res.status(code).json(response);
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET_KEY || 'jwt-dev-secret-key';
    const decoded = jwt.verify(token, jwtSecret);

    // Check token blocklist
    if (decoded.jti) {
      const revoked = await TokenBlocklist.findOne({ where: { jti: decoded.jti } });
      if (revoked) {
        const { code, response } = errorResponse('Token has been revoked', 401);
        return res.status(code).json(response);
      }
    }

    const user = await User.findOne({
      where: { id: decoded.sub || decoded.id, is_deleted: 0 },
      include: [{ model: Role, as: 'role_obj', include: [{ model: Permission, as: 'permissions' }] }]
    });

    if (!user) {
      const { code, response } = errorResponse('User not found or deleted', 401);
      return res.status(code).json(response);
    }

    req.user = user;
    req.jwtPayload = decoded;
    next();
  } catch (err) {
    const { code, response } = errorResponse(`Authentication failed: ${err.message}`, 401);
    return res.status(code).json(response);
  }
}

export function adminRequired(req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user || !req.user.isAdmin()) {
      const { code, response } = errorResponse('Insufficient permissions. Admin access required.', 403);
      return res.status(code).json(response);
    }
    next();
  });
}

export function permissionRequired(permissionSlug) {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (!req.user) {
        const { code, response } = errorResponse('User not found', 401);
        return res.status(code).json(response);
      }

      if (!req.user.hasPermission(permissionSlug)) {
        const { code, response } = errorResponse(`Missing permission: ${permissionSlug}`, 403);
        return res.status(code).json(response);
      }

      next();
    });
  };
}
