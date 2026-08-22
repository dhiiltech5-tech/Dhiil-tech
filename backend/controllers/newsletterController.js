import { Newsletter } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields, isValidEmail } from '../utils/validators.js';

export async function subscribeNewsletter(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['email']);
    if (missing.length > 0) {
      const { code, response } = errorResponse('Email is required', 400);
      return res.status(code).json(response);
    }

    const email = data.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      const { code, response } = errorResponse('Invalid email address', 400);
      return res.status(code).json(response);
    }

    const existing = await Newsletter.findOne({ where: { email } });
    if (existing) {
      const { code, response } = successResponse(existing.toDict(), 'You are already subscribed!');
      return res.status(code).json(response);
    }

    const subscriber = await Newsletter.create({ email });
    const { code, response } = successResponse(subscriber.toDict(), 'Subscribed successfully to our newsletter', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error subscribing: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getAllSubscribers(req, res) {
  try {
    const subscribers = await Newsletter.findAll({
      order: [['subscribed_at', 'DESC']]
    });
    const { code, response } = successResponse(subscribers.map(s => s.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching subscribers: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function unsubscribeNewsletter(req, res) {
  try {
    const { id } = req.params;
    const subscriber = await Newsletter.findByPk(id);
    if (!subscriber) {
      const { code, response } = errorResponse('Subscriber not found', 404);
      return res.status(code).json(response);
    }

    await subscriber.destroy();
    const { code, response } = successResponse(null, 'Unsubscribed successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error unsubscribing: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
