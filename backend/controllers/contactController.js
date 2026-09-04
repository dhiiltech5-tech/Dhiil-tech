import { Contact } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { requireFields, isValidEmail } from '../utils/validators.js';

export async function submitContact(req, res) {
  try {
    const data = req.body || {};
    const missing = requireFields(data, ['name', 'email', 'message']);
    if (missing.length > 0) {
      const { code, response } = errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
      return res.status(code).json(response);
    }

    if (!isValidEmail(data.email)) {
      const { code, response } = errorResponse('Invalid email address', 400);
      return res.status(code).json(response);
    }

    const contact = await Contact.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject ? data.subject.trim() : null,
      message: data.message.trim(),
      is_read: false
    });

    const { code, response } = successResponse(contact.toDict(), 'Your message has been sent successfully', 201);
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error submitting message: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function getAllContacts(req, res) {
  try {
    const contacts = await Contact.findAll({
      order: [['created_at', 'DESC']]
    });
    const { code, response } = successResponse(contacts.map(c => c.toDict()));
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching messages: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    if (!contact) {
      const { code, response } = errorResponse('Message not found', 404);
      return res.status(code).json(response);
    }

    contact.is_read = true;
    await contact.save();

    const { code, response } = successResponse(contact.toDict(), 'Message marked as read');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating message: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    if (!contact) {
      const { code, response } = errorResponse('Message not found', 404);
      return res.status(code).json(response);
    }

    await contact.destroy();
    const { code, response } = successResponse(null, 'Message deleted successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error deleting message: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
