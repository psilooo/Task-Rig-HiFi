import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  const allowedOrigins = [
    'https://taskrig.com',
    'https://www.taskrig.com',
    ...(process.env.VERCEL_ENV === 'preview' ? [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''] : []),
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:5173', 'http://localhost:3000'] : []),
  ].filter(Boolean);
  const origin = req.headers.origin ?? '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    const payload = buildGHLPayload(req.body as LeadBody, locationId);

    const response = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GHL create contact error:', data);
      return res.status(response.status).json({ error: 'Failed to create contact', details: data });
    }

    return res.status(200).json({ contactId: data.contact?.id ?? data.id });
  }

  if (req.method === 'PUT') {
    const { contactId, ...fields } = req.body as LeadBody;

    if (!contactId) {
      return res.status(400).json({ error: 'contactId is required for updates' });
    }

    const payload = buildGHLPayload(fields, locationId);

    const response = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GHL update contact error:', data);
      return res.status(response.status).json({ error: 'Failed to update contact', details: data });
    }

    return res.status(200).json({ contactId: data.contact?.id ?? contactId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
