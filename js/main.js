/**
 * main.js — Navigation, scroll effects, dropdowns, FAQ accordion
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky nav shadow on scroll ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile hamburger ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Desktop dropdown ---- */
  const dropdowns = document.querySelectorAll('.nav__dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav__dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);

      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('open');
          const otherToggle = other.querySelector('.nav__dropdown-toggle');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
      const toggle = dropdown.querySelector('.nav__dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Active nav link highlighting ---- */
  const currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav__links a, .nav__dropdown-menu a').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      question.setAttribute('aria-expanded', isOpen);
    });
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Simple scroll reveal ---- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.card, .role-card, .process-step, .why-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(el);
    });
  }

});
