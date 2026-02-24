// netlify/functions/generate-email.js
//
// ─── SECURITY DESIGN ────────────────────────────────────────────────────────
//
// PURPOSE:
//   Receive prompt data from an authenticated client, call Anthropic, return
//   a generated email subject + body. That is ALL this function does.
//
// AUTH MODEL:
//   Every request must include:  Authorization: Bearer <supabase_access_token>
//   The token is verified by calling Supabase's /auth/v1/user endpoint using
//   only the public ANON key. This is the correct, documented pattern:
//     - The anon key is the PUBLIC key — safe to use on a server
//     - /auth/v1/user returns only the token-bearer's own profile
//     - It does NOT bypass Row Level Security
//     - It does NOT grant admin access
//   Requests without a valid token receive 401 and no further processing.
//
// DATABASE:
//   ZERO database reads. ZERO database writes. No Supabase table is touched.
//   RLS is therefore irrelevant — there is nothing to scope.
//
// ENVIRONMENT VARIABLES — ONLY THESE THREE:
//   ANTHROPIC_KEY     — Anthropic secret key. Server-side only. Never in client.
//   SUPABASE_URL      — e.g. https://xxxxxx.supabase.co
//   SUPABASE_ANON_KEY — Public anon key. Used only to verify the user's JWT.
//
// EXPLICITLY NOT USED:
//   SUPABASE_SERVICE_KEY — NOT present. NOT required. Would bypass RLS.
//                          This function has no need for admin DB access.
//   REACT_APP_*          — No client-side secrets of any kind.
//
// LOGGING POLICY — nothing sensitive is ever logged:
//   Logged:       HTTP status codes, touch number (integer)
//   Never logged: tokens, request bodies, email content, venue data, API keys
//
// ────────────────────────────────────────────────────────────────────────────

const ANTHROPIC_KEY     = process.env.ANTHROPIC_KEY;
const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ---------------------------------------------------------------------------
// JWT verification — anon key only, no service key, zero DB access
// Returns user UUID on success, null on any failure.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Rate limiting — in-memory, per userId UUID, resets on cold start
// ---------------------------------------------------------------------------
const rateLimitMap = new Map();
const RATE_LIMIT   = 20;
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

// Sanitize: strip control chars, enforce max length
const safe = (s, max = 200) =>
  typeof s === 'string' ? s.replace(/[\x00-\x1F\x7F]/g, ' ').slice(0, max).trim() : '';

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  // ── Step 1: Extract and verify Supabase JWT ────────────────────────────
  // Must have: Authorization: Bearer <supabase_access_token>
  // Verified by calling /auth/v1/user with anon key — NOT service key.
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  const userId = await verifyJWT(token);

  if (!userId) {
    // No logging here — could be a probe, don't give info away
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Authentication required.' }) };
  }

  // ── Step 2: Rate limit — keyed to verified UUID, not anything from body ──
  if (!checkRateLimit(userId)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Rate limit reached. Please wait before generating more emails.' }),
    };
  }

  // ── Step 3: Parse body ───────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  const { venue, template, tone, dates, touchHistory } = body;
  // Note: userId comes from verified JWT above, NOT from the request body

  // ── Step 4: Validate and sanitize all inputs ─────────────────────────────
  if (!venue || typeof venue !== 'object' || !venue.venue || !venue.city || !venue.state) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'venue with name, city, and state is required.' }),
    };
  }

  const venueName   = safe(venue.venue,     100);
  const venueCity   = safe(venue.city,      100);
  const venueState  = safe(venue.state,      50);
  const booker      = safe(venue.booker,    100);
  const venueType   = safe(venue.venueType,  50);
  const warmth      = safe(venue.warmth,     20);
  const capacity    = Number.isFinite(venue.capacity) ? venue.capacity : 'unknown';
  const safeDates   = safe(dates,           100);
  const safeTone    = safe(tone,             50);
  const baseSubject = safe(template?.subject, 200);
  const baseBody    = safe(template?.body,   3000);

  // Touch history: only date + note fields, cap at 3 entries
  const safeHistory = (Array.isArray(touchHistory) ? touchHistory : [])
    .slice(-3)
    .map(t => `${safe(String(t?.date || ''), 30)}: ${safe(String(t?.note || ''), 200)}`)
    .join('\n') || 'No previous contact';

  // ── Step 5: Check Anthropic key is configured ────────────────────────────
  if (!ANTHROPIC_KEY) {
    console.error('[generate-email] ANTHROPIC_KEY not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'AI service not configured. Contact support.' }),
    };
  }

  // ── Step 6: Build prompt — nothing sensitive is logged ───────────────────
  const touchNum   = (Array.isArray(touchHistory) ? touchHistory.length : 0) + 1;
  const isFollowUp = touchNum > 1;

  const promptText = [
    'You are helping Jason Schuster book comedy shows. Generate a personalized booking email.',
    '',
    'VENUE INFO:',
    `- Venue: ${venueName}`,
    `- Location: ${venueCity}, ${venueState}`,
    `- Booker: ${booker || 'unknown'}`,
    `- Venue Type: ${venueType || 'Comedy Club'}`,
    `- Capacity: ${capacity}`,
    `- Warmth: ${warmth || 'Cold'}`,
    '',
    'OUTREACH CONTEXT:',
    `- Touch number: ${touchNum}`,
    `- Is follow-up: ${isFollowUp}`,
    `- Dates: ${safeDates || 'flexible'}`,
    `- Recent history:\n${safeHistory}`,
    `- Tone: ${safeTone || 'professional'}`,
    '',
    baseBody ? `BASE TEMPLATE:\nSubject: ${baseSubject}\n\n${baseBody}` : '',
    '',
    'INSTRUCTIONS:',
    "- Personalize for this specific venue and booker",
    "- Keep Jason's voice: warm, professional, specific, never pushy",
    '- Under 250 words',
    '- Output format MUST be exactly:',
    'SUBJECT: [subject line]',
    '',
    '[email body]',
    '',
    '- Sign as: Jason Schuster, jschucomedy@gmail.com',
    '- Output ONLY the email. No commentary before or after.',
  ].filter(Boolean).join('\n');

  // ── Step 7: Call Anthropic ───────────────────────────────────────────────
  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages:   [{ role: 'user', content: promptText }],
      }),
    });

    if (!aiRes.ok) {
      // Log status only — never log body, which could echo back key info
      console.error('[generate-email] Anthropic status:', aiRes.status);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'AI service error. Use a template manually or try again.' }),
      };
    }

    const aiData = await aiRes.json();
    const text   = aiData.content?.map(b => b.text || '').join('') || '';

    if (!text) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'No AI response. Try again.' }) };
    }

    // Parse SUBJECT / body
    const respLines  = text.split('\n');
    let subject = '', bodyLines = [], foundSubject = false;

    for (const line of respLines) {
      if (!foundSubject && /^SUBJECT:/i.test(line)) {
        subject = line.replace(/^SUBJECT:\s*/i, '').trim();
        foundSubject = true;
      } else if (foundSubject) {
        bodyLines.push(line);
      }
    }

    if (!subject) {
      subject   = baseSubject || `Phil Medina - ${safeDates || 'Availability'} - ${venueName}`;
      bodyLines = respLines;
    }

    const emailBody = bodyLines.join('\n').replace(/^\n+/, '');

    // Log only opaque metadata
    console.log(`[generate-email] ok touch=${touchNum}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ subject, body: emailBody, touchNum }),
    };

  } catch (err) {
    console.error('[generate-email] fetch error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Network error. Please try again.' }),
    };
  }
};
