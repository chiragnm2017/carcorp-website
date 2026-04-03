/**
 * Cloudflare Worker — CarCorp Contact Form Proxy
 *
 * Receives POST /api/contact from the contact form.
 * Verifies Cloudflare Turnstile server-side, validates required fields,
 * then forwards the submission to Zapier.
 *
 * Required Worker secrets (set via Cloudflare dashboard):
 *   TURNSTILE_SECRET_KEY  — from Cloudflare Turnstile dashboard > your site > Secret key
 *   ZAPIER_WEBHOOK_URL    — the Zapier Catch Hook URL (rotated, never in public code again)
 */

const ALLOWED_ORIGIN = 'https://carcorpaust.com.au';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Invalid request body' }, 400);
    }

    // Server-side required field validation
    const name    = (body.full_name  || '').trim();
    const email   = (body.email      || '').trim();
    const message = (body.message    || '').trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: 'Required fields missing' }, 400);
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Invalid email address' }, 400);
    }

    // Server-side Turnstile verification
    const token = (body['cf-turnstile-response'] || '').trim();
    if (!token) {
      return json({ ok: false, error: 'Security check required' }, 400);
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';
    const verifyForm = new FormData();
    verifyForm.append('secret',   env.TURNSTILE_SECRET_KEY);
    verifyForm.append('response', token);
    if (ip) verifyForm.append('remoteip', ip);

    let turnstileOk = false;
    try {
      const verifyRes  = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body:   verifyForm,
      });
      const verifyData = await verifyRes.json();
      turnstileOk = verifyData.success === true;
    } catch {
      return json({ ok: false, error: 'Security check could not be verified' }, 500);
    }

    if (!turnstileOk) {
      return json({ ok: false, error: 'Security check failed' }, 403);
    }

    // Forward clean payload to Zapier (URL is a secret, never in client code)
    const payload = {
      full_name:    name,
      email:        email,
      phone:        (body.phone   || '').trim(),
      subject:      (body.subject || '').trim(),
      message:      message,
      submitted_at: body.submitted_at || new Date().toISOString(),
      page_url:     body.page_url     || '',
    };

    try {
      const zapierRes = await fetch(env.ZAPIER_WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!zapierRes.ok) {
        return json({ ok: false, error: 'Submission failed — please call us directly' }, 502);
      }
    } catch {
      return json({ ok: false, error: 'Submission failed — please call us directly' }, 502);
    }

    return json({ ok: true }, 200);
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
