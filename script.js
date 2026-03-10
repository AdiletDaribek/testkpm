/* ════════════════════════════════════════
   SAFEMEBEL — Landing Page Scripts
   ════════════════════════════════════════ */

'use strict';

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via rAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Grow on interactive elements
  const interactives = document.querySelectorAll('a, button, [role="button"]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(2)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
      follower.style.opacity   = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.opacity   = '0.5';
    });
  });
})();


/* ── STICKY NAV ── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── MOBILE MENU ── */
(function initMobileMenu() {
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();


/* ── ANIMATED COUNTERS ── */
(function initCounters() {
  const statsEls = document.querySelectorAll('.hstat strong, .pnum strong');

  function parseValue(str) {
    str = str.trim();
    if (str.includes('млрд')) return { raw: parseFloat(str), suffix: ' млрд', prefix: '₽ ' };
    if (str.includes('%'))    return { raw: parseFloat(str), suffix: '%', prefix: '' };
    if (str.includes('★'))   return { raw: parseFloat(str), suffix: ' ★', prefix: '' };
    if (str === '0 ₽')        return { raw: 0, suffix: ' ₽', prefix: '' };

    // Strip ₽, +, spaces
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    const suffix = str.includes('+') ? '+' : str.includes('₽') ? ' ₽' : '';
    const prefix = '';
    return { raw: num, suffix, prefix };
  }

  function formatNumber(n, original) {
    if (original.includes('млрд')) return n.toFixed(1);
    if (original.includes('%') || original.includes('★')) return n.toFixed(1);
    if (n >= 1000) return Math.round(n).toLocaleString('ru');
    return Math.round(n).toString();
  }

  function animateCounter(el, from, to, duration, fmt, original) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      el.textContent = fmt.prefix + formatNumber(current, original) + fmt.suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const original = el.textContent;
      const fmt = parseValue(original);
      if (isNaN(fmt.raw)) return;
      animateCounter(el, 0, fmt.raw, 1800, fmt, original);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statsEls.forEach(el => observer.observe(el));
})();


/* ── SMOOTH SCROLL ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── HERO ESCROW FLOW ANIMATION ── */
(function initEscrowAnimation() {
  const steps = [
    document.getElementById('efStep1'),
    document.getElementById('efStep2'),
    document.getElementById('efStep3'),
  ];
  const connectors = document.querySelectorAll('.ef-connector');
  if (!steps[0]) return;

  let current = 0;

  function advance() {
    current = (current + 1) % (steps.length + 1);

    steps.forEach((step, i) => {
      if (!step) return;
      step.classList.toggle('ef-active', i <= current - 1);
    });

    connectors.forEach((conn, i) => {
      conn.classList.toggle('ef-conn-active', i < current);
    });

    // Reset after completing cycle
    if (current >= steps.length) {
      setTimeout(() => {
        current = 0;
        steps.forEach(s => s && s.classList.remove('ef-active'));
        connectors.forEach(c => c.classList.remove('ef-conn-active'));
        // Re-activate first after short pause
        setTimeout(() => {
          steps[0] && steps[0].classList.add('ef-active');
          current = 1;
        }, 400);
      }, 1800);
    }
  }

  // Start with step 1 active
  steps[0] && steps[0].classList.add('ef-active');
  current = 1;

  setInterval(advance, 2000);
})();


/* ── PAIN CARDS HOVER TILT ── */
(function initTilt() {
  const cards = document.querySelectorAll('.pain-card, .benefit-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── ACTIVE NAV LINK HIGHLIGHT ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === `#${id}` ? 'var(--amber-dim)' : '';
          link.style.fontWeight = href === `#${id}` ? '600' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ── REVIEW CARDS PARALLAX ── */
(function initReviewParallax() {
  const featured = document.querySelector('.review-card-featured');
  if (!featured) return;

  window.addEventListener('scroll', () => {
    const rect = featured.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const offset = center * 0.04;
    featured.style.transform = `translateY(calc(-12px + ${offset}px))`;
  }, { passive: true });
})();


/* ── PAGE LOAD PROGRESS BAR ── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, #C9973A, #E3B860);
    transition: width 0.4s ease;
    pointer-events: none;
  `;
  document.body.prepend(bar);

  function updateBar() {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
})();


/* ── CTA BUTTON RIPPLE ── */
(function initRipple() {
  const btns = document.querySelectorAll('.btn-cta-primary, .btn-primary');

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        transform: scale(0);
        animation: ripple 0.5s ease-out forwards;
        pointer-events: none;
      `;
      if (getComputedStyle(btn).position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();
