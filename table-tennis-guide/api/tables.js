/**
 * GET /api/tables
 *
 * Serves table tennis product data. Protected by two layers:
 *   1. Origin/Referer header check — only allows requests from your domain
 *   2. X-Api-Key header — a secret baked into the React bundle at build time
 *
 * Environment variables (set in Vercel dashboard):
 *   API_SECRET      — A random secret string (e.g. openssl rand -hex 32)
 *   ALLOWED_ORIGINS — Comma-separated list of allowed origins
 *                     e.g. "https://recroompick.com,https://www.recroompick.com"
 *
 * The React app sends the secret via the X-Api-Key header using VITE_API_SECRET.
 * Set VITE_API_SECRET = same value as API_SECRET in Vercel environment variables.
 */

const tables = require('./data/tables.json');

// Localhost origins always allowed so local dev works without extra setup
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
];

module.exports = function handler(req, res) {
  const origin = (req.headers['origin'] || '').trim();
  const referer = (req.headers['referer'] || '').trim();
  const apiKey = (req.headers['x-api-key'] || '').trim();

  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const allAllowed = [...DEV_ORIGINS, ...configuredOrigins];

  // Check if the request comes from an allowed origin or carries the valid API key
  const originOk =
    allAllowed.some((o) => origin === o) ||
    allAllowed.some((o) => referer.startsWith(o));

  const keyOk =
    process.env.API_SECRET &&
    apiKey.length > 0 &&
    apiKey === process.env.API_SECRET;

  if (!originOk && !keyOk) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // CORS — reflect the allowed origin back so browsers accept the response
  if (origin && allAllowed.some((o) => origin === o)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Api-Key, Content-Type');
  res.setHeader('Vary', 'Origin');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Cache at Vercel CDN edge for 1 hour; serve stale while revalidating for 24h
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  return res.status(200).json(tables);
};
