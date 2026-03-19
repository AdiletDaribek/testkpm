/* ════════════════════════════════════════
   SAFEMEBEL — Scripts · Clean Minimal
   ════════════════════════════════════════ */
'use strict';

/* ── CURSOR ── */
(function () {
  const c = document.getElementById('cursor'), f = document.getElementById('cursorFollower');
  if (!c || !f) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    c.style.left = mx + 'px'; c.style.top = my + 'px';
  });
  (function loop() {
    fx += (mx - fx) * .12; fy += (my - fy) * .12;
    f.style.left = fx + 'px'; f.style.top = fy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .cat-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      c.style.transform = 'translate(-50%,-50%) scale(2)';
      f.style.opacity = '.2';
    });
    el.addEventListener('mouseleave', () => {
      c.style.transform = 'translate(-50%,-50%) scale(1)';
      f.style.opacity = '.4';
    });
  });
})();

/* ── NAV ── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });
})();

/* ── MOBILE MENU ── */
(function () {
  const b = document.getElementById('burger'), m = document.getElementById('mobileMenu');
  if (!b || !m) return;
  b.addEventListener('click', () => {
    const open = m.classList.toggle('open');
    b.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.mm-link, .mm-fill').forEach(l => l.addEventListener('click', () => {
    m.classList.remove('open'); b.classList.remove('open'); document.body.style.overflow = '';
  }));
  document.addEventListener('click', e => {
    if (!m.contains(e.target) && !b.contains(e.target)) {
      m.classList.remove('open'); b.classList.remove('open'); document.body.style.overflow = '';
    }
  });
})();

/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── COUNTERS ── */
(function () {
  const els = document.querySelectorAll('.hstat strong, .num strong');

  function parse(s) {
    s = s.trim();
    if (s.includes('млрд')) {
      const n = parseFloat(s.replace(/[^0-9.,]/g, '').replace(',', '.'));
      const prefix = s.includes('₸') ? '₸ ' : '';
      return { raw: isNaN(n) ? 0 : n, suffix: ' млрд', prefix };
    }
    if (s.includes('%')) return { raw: parseFloat(s), suffix: '%', prefix: '' };
    if (s.includes('★')) return { raw: parseFloat(s), suffix: ' ★', prefix: '' };
    if (s === '0 ₸') return { raw: 0, suffix: ' ₸', prefix: '' };
    const n = parseFloat(s.replace(/[^0-9.]/g, ''));
    const suffix = s.includes('+') ? '+' : s.includes('₸') ? ' ₸' : '';
    return { raw: n, suffix, prefix: '' };
  }

  function fmt(n, orig) {
    if (orig.includes('млрд')) return n.toFixed(1);
    if (orig.includes('%') || orig.includes('★')) return n.toFixed(1);
    if (n >= 1000) return Math.round(n).toLocaleString('ru');
    return Math.round(n).toString();
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, orig = el.textContent, f = parse(orig);
      if (isNaN(f.raw)) return;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / 1800, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = f.prefix + fmt(f.raw * ease, orig) + f.suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  els.forEach(el => obs.observe(el));
})();

/* ── SMOOTH SCROLL ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const h = a.getAttribute('href');
      if (!h || h === '#') return;
      const t = document.querySelector(h);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 66, behavior: 'smooth' });
    });
  });
})();

/* ── PROGRESS BAR ── */
(function () {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;height:2px;width:0%;background:linear-gradient(90deg,#C9973A,#E3B860);transition:width .3s;pointer-events:none';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    bar.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
  }, { passive: true });
})();

/* ── RIPPLE ── */
(function () {
  document.querySelectorAll('.btn-fill, .nav-fill').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect(), sz = Math.max(r.width, r.height);
      const rip = document.createElement('span');
      rip.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(255,255,255,.2);left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px;transform:scale(0);animation:ripple .5s ease-out forwards;pointer-events:none`;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 600);
    });
  });
  const s = document.createElement('style');
  s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
  document.head.appendChild(s);
})();

/* ── MODAL & LEADS ── */
let _openModal = () => {};

(function () {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  const closeBtn = document.getElementById('modalClose');
  const submitBtn = document.getElementById('modalSubmit');
  const successDiv = document.getElementById('modalSuccess');
  const bodyDiv = document.getElementById('modalBody');
  const successClose = document.getElementById('successClose');
  const mIcon = document.getElementById('modalIcon');
  const mTitle = document.getElementById('modalTitle');
  const mSub = document.getElementById('modalSub');
  const adminBtn = document.getElementById('adminBtn');
  const leadsPanel = document.getElementById('leadsPanel');
  const exportBtn = document.getElementById('exportBtn');

  let leads = JSON.parse(localStorage.getItem('sm_leads') || '[]');
  let curType = 'buyer';

  const CFG = {
    buyer: { icon: '🛒', title: 'Найти мебель безопасно', sub: 'Оставьте контакты — покажем лучшие предложения' },
    seller: { icon: '🏭', title: 'Стать продавцом', sub: 'Расскажем об условиях и поможем пройти верификацию' },
    default: { icon: '🔒', title: 'Оставьте заявку', sub: 'Мы свяжемся с вами в течение 15 минут' }
  };

  function open(type) {
    const cfg = CFG[type] || CFG.default;
    curType = type || 'default';
    if (mIcon) mIcon.textContent = cfg.icon;
    if (mTitle) mTitle.textContent = cfg.title;
    if (mSub) mSub.textContent = cfg.sub;
    bodyDiv.classList.remove('hide');
    successDiv.classList.remove('show');
    ['fieldName', 'fieldPhone', 'fieldEmail'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const n = document.getElementById('fieldName'); if (n) n.focus(); }, 300);
  }
  _openModal = open;

  function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      open(btn.getAttribute('data-modal'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  if (successClose) successClose.addEventListener('click', close);

  if (submitBtn) submitBtn.addEventListener('click', () => {
    const name = document.getElementById('fieldName')?.value.trim();
    const phone = document.getElementById('fieldPhone')?.value.trim();
    const email = document.getElementById('fieldEmail')?.value.trim();
    if (!name) { const f = document.getElementById('fieldName'); f.focus(); f.style.borderColor = '#ef4444'; setTimeout(() => { f.style.borderColor = ''; }, 1500); return; }
    if (!phone) { const f = document.getElementById('fieldPhone'); f.focus(); f.style.borderColor = '#ef4444'; setTimeout(() => { f.style.borderColor = ''; }, 1500); return; }
    saveLead({ type: curType === 'buyer' ? 'Покупатель' : curType === 'seller' ? 'Продавец' : 'Заявка', name, phone, email });
    bodyDiv.classList.add('hide'); successDiv.classList.add('show');
  });

  function saveLead(data) {
    const lead = { id: Date.now(), date: new Date().toLocaleString('ru-RU'), ...data };
    leads.push(lead);
    localStorage.setItem('sm_leads', JSON.stringify(leads));
    updatePanel();
  }

  function updatePanel() {
    const c = document.getElementById('leadsCount'), l = document.getElementById('leadsList');
    if (c) c.textContent = leads.length;
    if (l) l.innerHTML = leads.slice().reverse().map(x =>
      `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.07)">
        <div style="font-weight:600;color:#E3B860">${x.name} · ${x.type}</div>
        <div style="color:#8A9BB5;font-size:11px">${x.phone}${x.email ? ' · ' + x.email : ''}</div>
        <div style="color:#555;font-size:10px">${x.date}</div>
      </div>`).join('');
    if (leads.length > 0 && adminBtn) {
      adminBtn.style.display = 'flex';
      adminBtn.style.alignItems = 'center';
      adminBtn.style.justifyContent = 'center';
    }
  }

  if (adminBtn) adminBtn.addEventListener('click', () => {
    updatePanel();
    leadsPanel.style.display = leadsPanel.style.display === 'none' ? 'block' : 'none';
    adminBtn.style.display = 'none';
  });

  if (exportBtn) exportBtn.addEventListener('click', () => {
    if (!leads.length) return;
    const h = ['ID', 'Дата', 'Тип', 'Имя', 'Телефон', 'Email'];
    const r = leads.map(l => [l.id, l.date, l.type, l.name, l.phone, l.email].map(v => `"${v}"`).join(','));
    const blob = new Blob(['\uFEFF' + [h.join(','), ...r].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'safemebel_leads.csv' });
    a.click(); URL.revokeObjectURL(a.href);
  });

  updatePanel();
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('cfSuccess');
  if (!form) return;

  function submit(type) {
    const name = document.getElementById('cfName')?.value.trim();
    const phone = document.getElementById('cfPhone')?.value.trim();

    if (!name) {
      const f = document.getElementById('cfName');
      f.style.borderColor = '#ef4444'; f.focus();
      setTimeout(() => { f.style.borderColor = ''; }, 1500); return;
    }
    if (!phone) {
      const f = document.getElementById('cfPhone');
      f.style.borderColor = '#ef4444'; f.focus();
      setTimeout(() => { f.style.borderColor = ''; }, 1500); return;
    }

    const leads = JSON.parse(localStorage.getItem('sm_leads') || '[]');
    leads.push({
      id: Date.now(),
      date: new Date().toLocaleString('ru-RU'),
      type: type === 'buyer' ? 'Покупатель' : 'Продавец',
      name,
      phone,
      email: document.getElementById('cfEmail')?.value.trim() || '',
      message: document.getElementById('cfMessage')?.value.trim() || ''
    });
    localStorage.setItem('sm_leads', JSON.stringify(leads));

    form.querySelectorAll('input, textarea, .cf-two, .cf-agree, .cf-btns').forEach(el => {
      el.style.display = 'none';
    });
    form.querySelector('.cf-lead').style.display = 'none';
    if (success) success.classList.add('show');
  }

  const bb = document.getElementById('cfBuyer');
  const bs = document.getElementById('cfSeller');
  if (bb) bb.addEventListener('click', () => submit('buyer'));
  if (bs) bs.addEventListener('click', () => submit('seller'));
})();
