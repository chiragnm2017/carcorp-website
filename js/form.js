/**
 * form.js — Contact form submission via Cloudflare Worker proxy
 *
 * Posts to /api/contact (Cloudflare Worker) which verifies Turnstile
 * server-side and forwards to Zapier. The Zapier webhook URL is a
 * Worker secret and never appears in client code.
 */

const CONTACT_ENDPOINT = '/api/contact';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.btn[type="submit"]');
  const msgEl     = form.querySelector('.form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields client-side
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        field.style.borderColor = '#EF4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Verify Cloudflare Turnstile was completed (client-side check)
    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileToken || !turnstileToken.value) {
      showMessage('Please complete the security check.', 'error');
      return;
    }

    // Build payload
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });
    data.submitted_at = new Date().toISOString();
    data.page_url     = window.location.href;

    // Disable submit while sending
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        showMessage('Thanks! Your enquiry has been received. We\'ll be in touch shortly.', 'success');
        form.reset();
      } else {
        showMessage(result.error || 'Something went wrong. Please try again or call us directly.', 'error');
      }

    } catch {
      showMessage('Something went wrong. Please try again or call us directly.', 'error');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Enquiry';
    }
  });

  function showMessage(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className   = 'form-message ' + type;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
