import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS: readonly string[] = Object.freeze([
  'https://taskrig.ca',
  'https://www.taskrig.ca',
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:3000']
    : []),
]);

export function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin ?? '';

  // Same-origin requests (e.g. Vercel frontend → Vercel API) have no Origin header.
  // Only set CORS headers when a cross-origin request provides a known origin.
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  if (req.method === 'OPTIONS') {
    // Preflight: allow same-origin (no origin header) or known origins
    res.status(!origin || ALLOWED_ORIGINS.includes(origin) ? 200 : 403).end();
    return true;
  }

  return false;
}
