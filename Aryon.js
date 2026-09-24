/* ═══════════════════════════════════════════
   Aryon.js — Platform Engine v2.0
   توسط: Aryon (سید آرین عباس‌نژاد)
   ═══════════════════════════════════════════ */

// ═══════ Modal ═══════
function openAbout() {
  const m = document.getElementById('aboutModal');
  if (m) m.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAbout() {
  const m = document.getElementById('aboutModal');
  if (m) m.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const m = document.getElementById('aboutModal');
  if (m && e.target === m) closeAbout();
  const lb = document.getElementById('lightbox');
  if (lb && e.target === lb) closeFullscreen();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAbout();
    closeFullscreen();
  }
});

// ═══════ Theme ═══════
function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcon();
}

function updateThemeIcon() {
  const icons = document.querySelectorAll('.theme-icon');
  const isLight = document.body.classList.contains('light');
  icons.forEach(i => {
    i.style.transform = 'rotate(360deg) scale(0.6)';
    setTimeout(() => {
      i.textContent = isLight ? '☀️' : '🌙';
      i.style.transform = 'rotate(0) scale(1)';
    }, 150);
  });
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
  }
  updateThemeIcon();
}

// ═══════ Video Lazy Load ═══════
function loadVideo(placeholder, hash) {
  const wrapper = placeholder.parentElement;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame?titleShow=true&startTime=0`;
  iframe.allowFullScreen = true;
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('webkitAllowFullScreen', 'true');
  iframe.setAttribute('mozAllowFullScreen', 'true');

  wrapper.style.opacity = '0';
  setTimeout(() => {
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
    wrapper.style.transition = 'opacity 0.4s';
    wrapper.style.opacity = '1';
  }, 150);
}

// ═══════ Lightbox ═══════
function openFullscreen(hash) {
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lbContent');
  if (!lb || !content) return;
  content.innerHTML = `<iframe src="https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame?titleShow=true&startTime=0" allowFullScreen="true" allowfullscreen></iframe>`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('active');
  const c = document.getElementById('lbContent');
  if (c) c.innerHTML = '';
  document.body.style.overflow = '';
}

// ═══════ Tabs ═══════
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.video-section');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      const section = document.getElementById(target);
      if (section) {
        section.classList.add('active');
        // اسکرول به تب‌ها
        setTimeout(() => {
          const tabsBar = document.querySelector('.chapter-tabs');
          if (tabsBar) {
            const y = tabsBar.getBoundingClientRect().top + window.scrollY - 10;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
      history.replaceState(null, '', `#${target}`);
    });
  });

  if (window.location.hash) {
    const target = window.location.hash.substring(1);
    const tab = document.querySelector(`.tab-btn[data-target="${target}"]`);
    if (tab) tab.click();
  }
}

// ═══════ Counters ═══════
function animateCounter(el, target) {
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const duration = 1200;
  const interval = duration / (target / step);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + (target > 1 ? '+' : '');
  }, interval);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ═══════ Reveal Animation ═══════
function initReveal() {
  const cards = document.querySelectorAll('[data-aos], .grade-card, .video-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  cards.forEach(c => observer.observe(c));
}

// ═══════ Mouse Glow on Cards ═══════
function initMouseGlow() {
  document.querySelectorAll('.grade-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });
}

// ═══════ Scroll Top ═══════
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 400) btn.classList.add('show');
        else btn.classList.remove('show');
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ═══════ Init ═══════
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initTabs();
  initCounters();
  initReveal();
  initScrollTop();
  initMouseGlow();

  console.log('%c🧬 Aryon Platform v2.0', 'color:#22d3ee;font-size:22px;font-weight:900;text-shadow:0 0 20px #22d3ee;');
  console.log('%cساخته شده توسط Aryon — سید آرین عباس‌نژاد', 'color:#a78bfa;font-size:12px;');
  console.log('%cبله: https://ble.ir/Aryon_code', 'color:#06b6d4;font-size:11px;');
  console.log('%cروبیکا: https://rubika.ir/aryon_code', 'color:#f472b6;font-size:11px;');
});