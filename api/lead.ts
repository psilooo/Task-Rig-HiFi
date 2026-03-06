import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_shared/cors';

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

interface LeadBody {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address1?: string;
  source?: string;
  tags?: string[];
  contactId?: string;
  [key: string]: unknown;
}

function buildGHLPayload(body: LeadBody, locationId: string) {
  const payload: Record<string, unknown> = { locationId };

  if (body.firstName) payload.firstName = body.firstName;
  if (body.lastName) payload.lastName = body.lastName;
  if (body.name) payload.name = body.name;
  if (body.email) payload.email = body.email;
  if (body.phone) payload.phone = body.phone;
  if (body.companyName) payload.companyName = body.companyName;
  if (body.address1) payload.address1 = body.address1;
  if (body.source) payload.source = body.source;
  if (body.tags?.length) payload.tags = body.tags;

  return payload;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (setCorsHeaders(req, res)) return;

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'GHL configuration missing' });
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: GHL_VERSION,
    'Content-Type': 'application/json',
  };

  if (req.method === 'POST') {
    try {
      const payload = buildGHLPayload(req.body as LeadBody, locationId);
      const response = await fetch(`${GHL_BASE}/contacts/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('GHL create contact error:', data);
        return res.status(response.status).json({ error: 'Failed to create contact' });
      }

      return res.status(200).json({ contactId: data.contact?.id ?? data.id });
    } catch (err) {
      console.error('GHL API unreachable (POST /contacts/):', err);
      return res.status(502).json({ error: 'Contact service temporarily unavailable' });
    }
  }

  if (req.method === 'PUT') {
    const { contactId, ...fields } = req.body as LeadBody;

    if (!contactId) {
      return res.status(400).json({ error: 'contactId is required for updates' });
    }

    try {
      const payload = buildGHLPayload(fields, locationId);
      const response = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('GHL update contact error:', data);
        return res.status(response.status).json({ error: 'Failed to update contact' });
      }

      return res.status(200).json({ contactId: data.contact?.id ?? contactId });
    } catch (err) {
      console.error('GHL API unreachable (PUT /contacts/):', err);
      return res.status(502).json({ error: 'Contact service temporarily unavailable' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
