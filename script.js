// Accordion — modules
document.querySelectorAll('.module__header').forEach(header => {
  header.addEventListener('click', () => {
    const module = header.closest('.module');
    const isOpen = module.classList.contains('open');
    document.querySelectorAll('.module').forEach(m => m.classList.remove('open'));
    if (!isOpen) module.classList.add('open');
  });
});

// Open first module by default
const firstModule = document.querySelector('.module');
if (firstModule) firstModule.classList.add('open');

// FAQ accordion
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Scroll fade-in
const fadeEls = document.querySelectorAll('.section__title, .pain__card, .solution__item, .review__card, .module, .pricing__card, .pain__callout');
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// Smooth buy button
document.querySelector('#buy-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  // Replace with your payment link
  alert('Переход к оплате...\n\nПодключите вашу платёжную систему (Kaspi, Halyk, Stripe и др.)');
});

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (window.scrollY > 10) {
    nav.style.boxShadow = '0 1px 24px rgba(0,0,0,0.4)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
