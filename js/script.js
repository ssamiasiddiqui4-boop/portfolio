(() => {
  'use strict';

  const root = document.documentElement;

  /* ------------------------------------------------------------
     1. Accent color picker (saved in the visitor's browser)
     ------------------------------------------------------------ */
  const swatches = Array.from(document.querySelectorAll('.swatch'));

  const setAccent = (color, persist) => {
    root.style.setProperty('--accent', color);
    swatches.forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.accent === color)));
    if (persist) {
      try { localStorage.setItem('portfolio-accent', color); } catch (e) { /* storage unavailable */ }
    }
  };

  try {
    const saved = localStorage.getItem('portfolio-accent');
    if (saved && swatches.some((s) => s.dataset.accent === saved)) setAccent(saved, false);
  } catch (e) { /* storage unavailable */ }

  swatches.forEach((s) => s.addEventListener('click', () => setAccent(s.dataset.accent, true)));

  /* ------------------------------------------------------------
     2. Mobile navigation
     ------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');

  const setMenu = (open) => {
    header.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  document.querySelectorAll('.site-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ------------------------------------------------------------
     3. Highlight the current section in the nav and fill skill bars
     ------------------------------------------------------------ */
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const skillGrid = document.querySelector('.skill-grid');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navObserver.observe(s));

    if (skillGrid) {
      const barObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((e) => e.isIntersecting)) {
          skillGrid.classList.add('in-view');
          observer.disconnect();
        }
      }, { threshold: 0.25 });
      barObserver.observe(skillGrid);
    }
  } else if (skillGrid) {
    skillGrid.classList.add('in-view');
  }

  /* ------------------------------------------------------------
     4. Contact form: validation and sending
     ------------------------------------------------------------ */
  // Optional: paste a Formspree (or similar) endpoint here to send messages directly.
  // Example: 'https://formspree.io/f/your-form-id'
  const FORM_ENDPOINT = '';
  // Used when FORM_ENDPOINT is empty: the visitor's email app opens with the message filled in.
  const CONTACT_EMAIL = 'ssamiasiddiqui4@gmail.com';

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const sendBtn = document.getElementById('send-btn');
  const count = document.getElementById('count');

  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.')
  };

  const fields = ['name', 'email', 'message'].map((id) => document.getElementById(id));

  const validate = (field) => {
    const error = rules[field.name](field.value);
    document.getElementById(field.id + '-error').textContent = error;
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    field.closest('.field').classList.toggle('invalid', Boolean(error));
    return !error;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  fields[2].addEventListener('input', () => { count.textContent = fields[2].value.length; });

  const showStatus = (text, type) => {
    status.textContent = text;
    status.className = 'form-status ' + (type || '');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showStatus('', '');

    const results = fields.map(validate);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }

    const data = {
      name: fields[0].value.trim(),
      email: fields[1].value.trim(),
      message: fields[2].value.trim()
    };

    if (FORM_ENDPOINT) {
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';
      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        count.textContent = '0';
        showStatus('Message sent. Thanks, ' + data.name + '.', 'ok');
      } catch (err) {
        showStatus('The message could not be sent. Check your connection and try again, or email ' + CONTACT_EMAIL + '.', 'fail');
      } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send message';
      }
    } else {
      const subject = encodeURIComponent('Portfolio message from ' + data.name);
      const body = encodeURIComponent(data.message + '\n\n' + data.name + '\n' + data.email);
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      showStatus('Opening your email app with the message filled in. Press send there to finish.', 'ok');
    }
  });

  /* ------------------------------------------------------------
     5. Footer year
     ------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
