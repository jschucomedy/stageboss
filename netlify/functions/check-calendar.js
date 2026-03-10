// netlify/functions/check-calendar.js
// Fetches a venue's calendar page server-side (bypasses CORS) and parses for date availability.
// Deploy to: netlify/functions/check-calendar.js in your GitHub repo

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let calendarUrl, targetDates, venueName;
  try {
    const body = JSON.parse(event.body);
    calendarUrl = body.calendarUrl;
    targetDates = body.targetDates; // e.g. "June 14-15" or "June 2026"
    venueName = body.venueName || 'Venue';
  } catch(e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!calendarUrl) return { statusCode: 400, headers, body: JSON.stringify({ error: 'calendarUrl required' }) };

  // Normalize URL
  let url = calendarUrl.trim();
  if (!url.startsWith('http')) url = 'https://' + url;

  try {
    // Fetch the calendar page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StageBoss/1.0; +https://stageboss.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({
        success: false,
        error: `Could not load calendar page (HTTP ${response.status})`,
        hint: 'The venue website may block automated access. Try checking manually.',
        url,
      })};
    }

    const html = await response.text();

    // ── DATE PARSING ──────────────────────────────────────────────
    // Extract all text date mentions from the HTML
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Parse target dates into month + optional day numbers
    const targetInfo = parseTargetDates(targetDates);

    // Extract booked dates from page text
    const bookedDates = extractDatesFromText(textContent, targetInfo);

    // Determine availability
    const availability = assessAvailability(bookedDates, targetInfo, textContent, venueName);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url,
        venueName,
        targetDates,
        availability,
        bookedDates,
        pageTextSample: textContent.substring(0, 3000), // first 3000 chars for debugging
        fetchedAt: new Date().toISOString(),
      })
    };

  } catch(e) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: e.message,
        hint: 'Could not reach the venue website. Check the URL is correct and publicly accessible.',
        url,
      })
    };
  }
};

// ── HELPERS ──────────────────────────────────────────────────────

function parseTargetDates(input) {
  if (!input) return { months: [], days: [], raw: '' };

  const MONTHS = {
    january:1, jan:1, february:2, feb:2, march:3, mar:3,
    april:4, apr:4, may:5, june:6, jun:6, july:7, jul:7,
    august:8, aug:8, september:9, sep:9, sept:9, october:10, oct:10,
    november:11, nov:11, december:12, dec:12
  };

  const lower = input.toLowerCase();
  const months = [];
  const days = [];

  // Extract month names
  for (const [name, num] of Object.entries(MONTHS)) {
    if (lower.includes(name)) {
      if (!months.includes(num)) months.push(num);
    }
  }

  // Extract day numbers (1-31)
  const dayMatches = lower.match(/\b([1-9]|[12][0-9]|3[01])\b/g) || [];
  for (const d of dayMatches) {
    const n = parseInt(d);
    if (n >= 1 && n <= 31 && !days.includes(n)) days.push(n);
  }

  // Extract year
  const yearMatch = lower.match(/20(2[4-9]|3[0-9])/);
  const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

  return { months, days, year, raw: input };
}

function extractDatesFromText(text, targetInfo) {
  const found = [];
  const lower = text.toLowerCase();

  const MONTH_NAMES = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const MONTH_SHORT = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

  // Look for patterns like "June 14", "Jun 14", "6/14", "06/14/2026"
  // Pattern 1: Month name + day
  const pattern1 = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?\b/gi;
  let m;
  while ((m = pattern1.exec(text)) !== null) {
    const monthStr = m[1].toLowerCase().substring(0,3);
    const monthIdx = MONTH_SHORT.indexOf(monthStr) + 1;
    const day = parseInt(m[2]);
    if (monthIdx > 0 && day >= 1 && day <= 31) {
      found.push({ month: monthIdx, day, raw: m[0] });
    }
  }

  // Pattern 2: MM/DD or MM/DD/YYYY
  const pattern2 = /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/g;
  while ((m = pattern2.exec(text)) !== null) {
    const month = parseInt(m[1]);
    const day = parseInt(m[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      found.push({ month, day, raw: m[0] });
    }
  }

  // Filter to only dates in the target months if we have them
  if (targetInfo.months.length > 0) {
    return found.filter(d => targetInfo.months.includes(d.month));
  }

  return found;
}

function assessAvailability(bookedDates, targetInfo, fullText, venueName) {
  const lower = fullText.toLowerCase();

  // Check for common "no events" / "sold out" signals
  const soldOutSignals = ['sold out', 'tickets sold out', 'no tickets available', 'event full'];
  const noEventsSignals = ['no events', 'no upcoming events', 'no shows scheduled', 'calendar is empty', 'nothing scheduled'];
  const hasSoldOut = soldOutSignals.some(s => lower.includes(s));
  const hasNoEvents = noEventsSignals.some(s => lower.includes(s));

  if (hasNoEvents) {
    return {
      status: 'LIKELY_AVAILABLE',
      confidence: 'Medium',
      summary: `${venueName}'s calendar appears to have no events listed — your target dates may be open.`,
      detail: 'The page shows no upcoming events. This could mean dates are available OR the venue uses a different booking system not reflected on this page.',
      recommendation: 'Good signal to reach out — mention you checked their calendar and saw open dates.',
      bookedInWindow: [],
    };
  }

  // Check if any booked dates conflict with target days
  const bookedInWindow = targetInfo.days.length > 0
    ? bookedDates.filter(d => targetInfo.days.includes(d.day))
    : bookedDates;

  if (bookedInWindow.length === 0 && bookedDates.length > 0) {
    return {
      status: 'LIKELY_AVAILABLE',
      confidence: 'Medium-High',
      summary: `${venueName} has shows booked in ${targetInfo.months.length > 0 ? 'that month' : 'that period'} but your specific dates appear open.`,
      detail: `Found ${bookedDates.length} show(s) on their calendar in the target month, but none land on your target date(s): ${targetInfo.raw}.`,
      recommendation: 'Strong signal to pitch — the venue is active and booking, and your specific dates look open.',
      bookedInWindow: [],
      otherBookedDates: bookedDates.map(d => d.raw),
    };
  }

  if (bookedInWindow.length > 0) {
    return {
      status: 'LIKELY_BOOKED',
      confidence: 'Medium-High',
      summary: `${venueName} appears to have shows on or near your target dates.`,
      detail: `Found dates on calendar matching your target window: ${bookedInWindow.map(d=>d.raw).join(', ')}`,
      recommendation: 'These dates may be taken. Consider alternative dates — check their calendar manually to confirm, then pitch adjacent open weekends.',
      bookedInWindow: bookedInWindow.map(d => d.raw),
    };
  }

  if (bookedDates.length === 0 && targetInfo.months.length > 0) {
    return {
      status: 'UNCERTAIN',
      confidence: 'Low',
      summary: `Could not find date listings for ${targetInfo.raw} on ${venueName}'s calendar page.`,
      detail: 'The page loaded but date patterns were not detected. The venue may use a dynamic calendar (JavaScript-loaded), a ticketing embed, or a non-standard format.',
      recommendation: 'Check the calendar manually at the URL provided. If it loads dates in your browser but not here, the calendar is JavaScript-rendered — you\'ll need to check it directly.',
      bookedInWindow: [],
    };
  }

  return {
    status: 'UNCERTAIN',
    confidence: 'Low',
    summary: `Calendar loaded but availability for "${targetInfo.raw}" is unclear.`,
    detail: 'Date patterns were detected on the page but could not be matched conclusively to your target window.',
    recommendation: 'Review the calendar manually to confirm. If dates look open, proceed with outreach.',
    bookedInWindow: [],
  };
}
