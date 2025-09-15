(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const siteNav = $('#site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!siteNav.classList.contains('open')) return;
      if (e.target === navToggle || navToggle.contains(e.target)) return;
      if (e.target === siteNav || siteNav.contains(e.target)) return;
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Smooth scroll for same-page anchors
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = $(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Countdown
  function initCountdown() {
    const container = $('.countdown');
    if (!container) return;
    const deadlineIso = container.getAttribute('data-deadline');
    if (!deadlineIso) return;
    const deadline = new Date(deadlineIso).getTime();
    const dd = $('#dd');
    const hh = $('#hh');
    const mm = $('#mm');
    const ss = $('#ss');

    function update() {
      const now = Date.now();
      const diff = Math.max(0, deadline - now);
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      dd && (dd.textContent = String(days).padStart(2, '0'));
      hh && (hh.textContent = String(hours).padStart(2, '0'));
      mm && (mm.textContent = String(minutes).padStart(2, '0'));
      ss && (ss.textContent = String(seconds).padStart(2, '0'));
    }
    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // Year in footer
  const y = new Date().getFullYear();
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(y);

  // Normalize clean URLs: ensure /rules directory has trailing slash for relative links
  // Removed to avoid redirect loops on Netlify

  // Rules (Text) loader
  async function initRulesText() {
    const container = $('#rules-text');
    if (!container) return;
    const src = container.getAttribute('data-src');
    if (!src) return;
    try {
      const res = await fetch(src, { cache: 'no-store' });
      const text = await res.text();
      renderRules(text, container);
      buildToc(container);
    } catch (e) {
      container.textContent = 'Failed to load rulebook.';
    }
  }

  function renderRules(text, container) {
    const lines = text.split(/\r?\n/);
    const frag = document.createDocumentFragment();
    let sectionIndex = 0;
    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line) { frag.appendChild(document.createElement('br')); continue; }
      // Heuristic: treat fully uppercase lines and lines ending with ':' as section titles
      const isAllCaps = line === line.toUpperCase() && /[A-Z]/.test(line);
      const isHeader = isAllCaps || /:\s*$/.test(line);
      const el = document.createElement('div');
      if (isHeader) {
        el.className = 'section-title';
        sectionIndex += 1;
        const id = 'sec-' + sectionIndex + '-' + slug(line);
        el.id = id;
        el.textContent = line;
      } else if (/^(\d+\.|\-|\•)/.test(line)) {
        el.className = 'rule-line';
        el.textContent = line;
      } else {
        el.className = 'meta';
        el.textContent = line;
      }
      frag.appendChild(el);
    }
    container.innerHTML = '';
    container.appendChild(frag);
  }

  function buildToc(container) {
    const toc = $('#toc-list');
    if (!toc) return;
    toc.innerHTML = '';
    const sections = $$('.section-title', container);
    sections.forEach((sec) => {
      const a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = sec.textContent || '';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(sec.id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      toc.appendChild(a);
    });
  }

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
  }

  initRulesText();

  // Load announcements from JSON file
  let ann = [];
  async function loadAnnouncements() {
    try {
      const response = await fetch('/assets/data/announcements.json');
      ann = await response.json();
      renderAnnouncements();
    } catch (e) {
      console.warn('Failed to load announcements, using fallback');
      ann = [
        { title: 'Registrations open soon', body: 'Stay tuned for the Google Form link.' },
        { title: 'Rulebook updated', body: 'Minor clarifications added to Dramatics and Media.' },
      ];
      renderAnnouncements();
    }
  }

  function renderAnnouncements() {
    const annWrap = document.getElementById('announcements');
    if (!annWrap) return;
    annWrap.innerHTML = '';
    ann.forEach((a, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'ann-item';
      item.setAttribute('data-index', String(idx));
      item.innerHTML = `<h4>${a.title}</h4><p>${a.body}</p>`;
      item.addEventListener('click', () => openAnn(idx));
      annWrap.appendChild(item);
    });
  }

  loadAnnouncements();

  // Announcements modal
  function openAnn(i) {
    const m = document.getElementById('ann-modal');
    const t = document.getElementById('ann-title');
    const b = document.getElementById('ann-body');
    if (!m || !t || !b) return;
    t.textContent = ann[i]?.title || '';
    b.textContent = ann[i]?.body || '';
    m.classList.add('open');
    m.removeAttribute('aria-hidden');
  }
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.hasAttribute('data-close')) {
      const m = document.getElementById('ann-modal');
      if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }
    }
  });
})();


