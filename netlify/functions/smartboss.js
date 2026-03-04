// netlify/functions/smartboss.js
//
// ─── SECURITY DESIGN ────────────────────────────────────────────────────────
// Handles all SmartBoss AI calls (chat + tour plan generation).
// API key lives server-side only — never exposed to the browser.
// Auth: every request must include a valid Supabase JWT.
// Rate limit: 30 calls/hour per user.
// ────────────────────────────────────────────────────────────────────────────

const ANTHROPIC_KEY     = process.env.ANTHROPIC_KEY;
const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function verifyJWT(token) {
  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return typeof user?.id === 'string' ? user.id : null;
  } catch {
    return null;
  }
}

const rateLimitMap = new Map();
const RATE_LIMIT   = 30;
const RATE_WINDOW  = 60 * 60 * 1000;

function checkRateLimit(userId) {
  const now   = Date.now();
  const entry = rateLimitMap.get(userId) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_WINDOW) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  rateLimitMap.set(userId, entry);
  return true;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  // Auth
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const userId = await verifyJWT(token);
  if (!userId) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Authentication required.' }) };

  // Rate limit
  if (!checkRateLimit(userId)) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Rate limit reached. Try again in an hour.' }) };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request.' }) };
  }

  const { messages, system, max_tokens } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'messages array required.' }) };
  }

  if (!ANTHROPIC_KEY) {
    console.error('[smartboss] ANTHROPIC_KEY not configured');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI service not configured.' }) };
  }

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 1800,
        system:     system || '',
        messages:   messages,
      }),
    });

    if (!aiRes.ok) {
      console.error('[smartboss] Anthropic status:', aiRes.status);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service error. Try again.' }) };
    }

    const data = await aiRes.json();
    console.log('[smartboss] ok');
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    console.error('[smartboss] error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Network error. Try again.' }) };
  }
};
