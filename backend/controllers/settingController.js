import { Setting } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export async function getSettings(req, res) {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        company_email: 'info@onetapsolution.com',
        contact_phone: '+252 61 9586339',
        office_location: 'Mogadishu, Somalia',
        projects_done: 1,
        trusted_partners: 20,
        services_provided: 7,
        satisfaction_rate: 3
      });
    }
    const { code, response } = successResponse(settings.toDict(), 'Settings retrieved successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error fetching settings: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}

export async function updateSettings(req, res) {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    const data = req.body || {};

    if (data.company_email !== undefined) settings.company_email = data.company_email;
    if (data.contact_phone !== undefined) settings.contact_phone = data.contact_phone;
    if (data.office_location !== undefined) settings.office_location = data.office_location;
    if (data.projects_done !== undefined) settings.projects_done = Number(data.projects_done);
    if (data.trusted_partners !== undefined) settings.trusted_partners = Number(data.trusted_partners);
    if (data.services_provided !== undefined) settings.services_provided = Number(data.services_provided);
    if (data.satisfaction_rate !== undefined) settings.satisfaction_rate = Number(data.satisfaction_rate);

    await settings.save();
    const { code, response } = successResponse(settings.toDict(), 'Settings updated successfully');
    return res.status(code).json(response);
  } catch (err) {
    const { code, response } = errorResponse(`Error updating settings: ${err.message}`, 500);
    return res.status(code).json(response);
  }
}
