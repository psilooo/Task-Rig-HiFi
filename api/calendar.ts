import type { VercelRequest, VercelResponse } from '@vercel/node';

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-04-15';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin ?? '';
  const isAllowed =
    origin === 'https://taskrig.ca' ||
    origin === 'https://www.taskrig.ca' ||
    origin.endsWith('.vercel.app') ||
    (process.env.NODE_ENV === 'development' && (origin === 'http://localhost:5173' || origin === 'http://localhost:3000'));
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  const calendarId = process.env.GHL_CALENDAR_ID;

  if (!apiKey || !locationId || !calendarId) {
    return res.status(500).json({ error: 'GHL calendar configuration missing' });
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: GHL_VERSION,
    'Content-Type': 'application/json',
  };

  // GET — fetch available slots
  if (req.method === 'GET') {
    const timezone = (req.query.timezone as string) || 'America/New_York';
    const now = Date.now();
    const twoWeeks = now + 14 * 24 * 60 * 60 * 1000;

    const url = new URL(`${GHL_BASE}/calendars/${calendarId}/free-slots`);
    url.searchParams.set('startDate', String(now));
    url.searchParams.set('endDate', String(twoWeeks));
    url.searchParams.set('timezone', timezone);

    const response = await fetch(url.toString(), { method: 'GET', headers });
    const data = await response.json();

    if (!response.ok) {
      console.error('GHL free-slots error:', data);
      return res.status(response.status).json({ error: 'Failed to fetch slots', details: data });
    }

    return res.status(200).json(data);
  }

  // POST — book an appointment
  if (req.method === 'POST') {
    const { contactId, startTime, timezone } = req.body as {
      contactId?: string;
      startTime?: string;
      timezone?: string;
    };

    if (!contactId || !startTime) {
      return res.status(400).json({ error: 'contactId and startTime are required' });
    }

    const response = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        calendarId,
        locationId,
        contactId,
        startTime,
        title: 'TaskRig Walkthrough',
        appointmentStatus: 'new',
        ...(timezone && { timezone }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GHL create appointment error:', data);
      return res.status(response.status).json({ error: 'Failed to book appointment', details: data });
    }

    return res.status(200).json({ appointmentId: data.id, startTime: data.startTime, endTime: data.endTime });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
