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
    document.getElementById('efs1'),
    document.getElementById('efs2'),
    document.getElementById('efs3'),
  ];
  const lines = [
    document.getElementById('efsLine1'),
    document.getElementById('efsLine2'),
  ];
  if (!steps[0]) return;

  let current = 0;

  function showStep(idx) {
    steps.forEach((s, i) => {
      if (!s) return;
      s.classList.toggle('efs-active', i === idx);
    });
    lines.forEach((l, i) => {
      if (!l) return;
      l.classList.toggle('efs-line-active', i < idx);
    });
  }

  showStep(0);
  setInterval(() => {
    current = (current + 1) % steps.length;
    showStep(current);
  }, 2200);
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


/* ── MODAL & LEADS ── */
(function initModal() {
  const overlay    = document.getElementById('modalOverlay');
  const modal      = document.getElementById('modal');
  const closeBtn   = document.getElementById('modalClose');
  const submitBtn  = document.getElementById('modalSubmit');
  const successDiv = document.getElementById('modalSuccess');
  const bodyDiv    = document.getElementById('modalBody');
  const successClose = document.getElementById('successClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub   = document.getElementById('modalSub');
  const modalIcon  = document.getElementById('modalIcon');
  const adminBtn   = document.getElementById('adminBtn');
  const leadsPanel = document.getElementById('leadsPanel');
  const exportBtn  = document.getElementById('exportBtn');

  if (!overlay) return;

  // Lead storage
  let leads = JSON.parse(localStorage.getItem('sm_leads') || '[]');
  let currentType = 'buyer';

  const MODAL_CONFIGS = {
    buyer: {
      icon: '🛒',
      title: 'Найти мебель безопасно',
      sub: 'Оставьте контакты — мы покажем лучшие предложения от проверенных продавцов'
    },
    seller: {
      icon: '🏭',
      title: 'Стать продавцом',
      sub: 'Мы расскажем об условиях работы и поможем пройти верификацию'
    },
    default: {
      icon: '🔒',
      title: 'Оставьте заявку',
      sub: 'Мы свяжемся с вами в течение 15 минут'
    }
  };

  function openModal(type) {
    const cfg = MODAL_CONFIGS[type] || MODAL_CONFIGS.default;
    currentType = type || 'default';
    modalIcon.textContent = cfg.icon;
    modalTitle.textContent = cfg.title;
    modalSub.textContent = cfg.sub;
    bodyDiv.classList.remove('hide');
    successDiv.classList.remove('show');
    // Reset fields
    document.getElementById('fieldName').value = '';
    document.getElementById('fieldPhone').value = '';
    document.getElementById('fieldEmail').value = '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('fieldName').focus(), 300);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open on all data-modal buttons
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(btn.getAttribute('data-modal'));
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  if (successClose) successClose.addEventListener('click', closeModal);

  // Submit
  submitBtn.addEventListener('click', () => {
    const name  = document.getElementById('fieldName').value.trim();
    const phone = document.getElementById('fieldPhone').value.trim();
    const email = document.getElementById('fieldEmail').value.trim();

    // Simple validation
    if (!name) {
      document.getElementById('fieldName').focus();
      document.getElementById('fieldName').style.borderColor = '#e53e3e';
      setTimeout(() => document.getElementById('fieldName').style.borderColor = '', 1500);
      return;
    }
    if (!phone) {
      document.getElementById('fieldPhone').focus();
      document.getElementById('fieldPhone').style.borderColor = '#e53e3e';
      setTimeout(() => document.getElementById('fieldPhone').style.borderColor = '', 1500);
      return;
    }

    const lead = {
      id: Date.now(),
      date: new Date().toLocaleString('ru-RU'),
      type: currentType === 'buyer' ? 'Покупатель' : currentType === 'seller' ? 'Продавец' : 'Заявка',
      name, phone, email
    };

    leads.push(lead);
    localStorage.setItem('sm_leads', JSON.stringify(leads));
    updateAdminPanel();

    // Show success
    bodyDiv.classList.add('hide');
    successDiv.classList.add('show');
  });

  // Admin panel
  function updateAdminPanel() {
    const countEl = document.getElementById('leadsCount');
    const listEl  = document.getElementById('leadsList');
    if (!countEl || !listEl) return;
    countEl.textContent = leads.length;
    listEl.innerHTML = leads.slice().reverse().map(l => `
      <div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
        <div style="font-weight:600;color:#E3B860;">${l.name} · ${l.type}</div>
        <div style="color:#8A9BB5;font-size:11px;">${l.phone}${l.email ? ' · ' + l.email : ''}</div>
        <div style="color:#555;font-size:10px;">${l.date}</div>
      </div>
    `).join('');
  }

  // Show admin button if leads exist OR after first submission
  function checkAdminBtn() {
    if (leads.length > 0 && adminBtn) {
      adminBtn.style.display = 'flex';
      adminBtn.style.alignItems = 'center';
      adminBtn.style.justifyContent = 'center';
    }
  }

  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      updateAdminPanel();
      leadsPanel.style.display = leadsPanel.style.display === 'none' ? 'block' : 'none';
      adminBtn.style.display = 'none';
    });
  }

  // Export CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!leads.length) return;
      const headers = ['ID','Дата','Тип','Имя','Телефон','Email'];
      const rows = leads.map(l => [l.id, l.date, l.type, l.name, l.phone, l.email].map(v => `"${v}"`).join(','));
      const csv  = [headers.join(','), ...rows].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'safemebel_leads.csv';
      a.click(); URL.revokeObjectURL(url);
    });
  }

  checkAdminBtn();
  updateAdminPanel();
})();

/* ── HERO TRUST GRID BAR ANIMATION ── */
(function initTrustBar() {
  const fill = document.querySelector('.htg-bar-fill');
  if (!fill) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => { fill.style.width = '94%'; }, 300);
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  const bar = document.querySelector('.htg-bar');
  if (bar) observer.observe(bar);
})();

/* ── FIT HERO TITLE TO FULL WIDTH ── */
(function fitHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  function fit() {
    title.style.fontSize = '10px';
    const available = title.parentElement.clientWidth;
    let size = 10;
    title.style.fontSize = size + 'px';
    while (title.scrollWidth <= available && size < 300) {
      size += 0.5;
      title.style.fontSize = size + 'px';
    }
    title.style.fontSize = (size - 0.5) + 'px';
  }

  fit();
  window.addEventListener('resize', fit);
})();
