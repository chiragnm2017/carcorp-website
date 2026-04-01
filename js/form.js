/**
 * form.js — Contact form submission via Zapier webhook
 *
 * Replace ZAPIER_WEBHOOK_URL with the actual Zapier catch hook URL.
 * The form posts JSON; Zapier receives it and routes to email + Sheets.
 */

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/4694436/unqxddt/';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = form.querySelector('.btn[type="submit"]');
  const msgEl      = form.querySelector('.form-message');

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

    // Build payload from form fields
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });
    data.submitted_at = new Date().toISOString();
    data.page_url     = window.location.href;

    // Disable submit while sending
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',   // Zapier catch hooks don't return CORS headers
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // no-cors means we can't read the response status — assume success if no throw
      showMessage('Thanks! Your enquiry has been received. We\'ll be in touch shortly.', 'success');
      form.reset();

    } catch {
      showMessage('Something went wrong. Please try again or call us directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
    }
  });

  function showMessage(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = 'form-message ' + type;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
