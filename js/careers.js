/**
 * careers.js — Loads and renders job listings from data/careers.json
 *
 * Expects a <div id="job-cards"> container in careers.html.
 * Filter buttons must have data-filter="all|permanent|temporary".
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('job-cards');
  if (!container) return;

  let allJobs = [];

  try {
    const res  = await fetch('/data/careers.json');
    if (!res.ok) throw new Error('Failed to load careers data');
    allJobs = await res.json();
  } catch (err) {
    container.innerHTML = `
      <div class="careers__empty">
        <p>We're currently updating our listings. Please <a href="/contact.html">contact us</a> directly about available roles.</p>
      </div>`;
    return;
  }

  renderJobs(allJobs);

  /* ---- Filter buttons ---- */
  const filterBtns = document.querySelectorAll('.job-filter__btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? allJobs
        : allJobs.filter(j => j.type.toLowerCase() === filter);

      renderJobs(filtered);
    });
  });

  function renderJobs(jobs) {
    if (!jobs.length) {
      container.innerHTML = `
        <div class="careers__empty">
          <p>No roles found for this filter. <a href="/contact.html">Register your interest</a> and we'll reach out when a suitable role becomes available.</p>
        </div>`;
      return;
    }

    container.innerHTML = jobs.map(job => `
      <article class="job-card" data-type="${job.type.toLowerCase()}">
        <span class="job-card__type job-card__type--${job.type.toLowerCase()}">${job.type}</span>
        <h3 class="job-card__title">${escapeHtml(job.title)}</h3>
        ${job.company ? `<p class="job-card__company">${escapeHtml(job.company)}</p>` : ''}
        <p class="job-card__location">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${escapeHtml(job.location)}
        </p>
        ${job.description ? `<p class="job-card__desc">${escapeHtml(job.description)}</p>` : ''}
        <a href="/contact.html?role=${encodeURIComponent(job.title)}" class="btn btn--primary btn--sm">Apply Now</a>
      </article>
    `).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
