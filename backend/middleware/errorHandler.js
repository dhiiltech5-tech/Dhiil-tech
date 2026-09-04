import { errorResponse } from '../utils/responses.js';

export function notFoundHandler(req, res, next) {
  const { code, response } = errorResponse(`Route ${req.originalUrl} not found`, 404);
  res.status(code).json(response);
}

export function globalErrorHandler(err, req, res, next) {
  console.error('Global Error Handler:', err);
  const status = err.status || err.statusCode || 500;
  const { code, response } = errorResponse(err.message || 'Internal Server Error', status);
  res.status(code).json(response);
}
