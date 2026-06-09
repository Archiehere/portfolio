// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Navbar scroll state =====
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Mobile menu =====
const toggle = document.getElementById('navToggle');
const links = document.querySelector('.nav__links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
  revealObserver.observe(el);
});

// ===== Count-up stats =====
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.stat__num').forEach((el) => countObserver.observe(el));

// ===== Hero word rotator =====
const words = ['full stack apps', 'fintech products', 'Web3 integrations', 'scalable backends', 'delightful UX'];
const rotator = document.getElementById('rotator');
let wi = 0, ci = 0, deleting = false;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeLoop() {
  const word = words[wi];
  if (!deleting) {
    rotator.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; return setTimeout(typeLoop, 1700); }
  } else {
    rotator.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
if (reduceMotion) {
  rotator.textContent = words[0];
} else {
  rotator.textContent = '';
  setTimeout(typeLoop, 600);
}

// ===== Active nav link highlight =====
const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = new Map(
  [...document.querySelectorAll('.nav__links a')].map((a) => [a.getAttribute('href').slice(1), a])
);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.remove('active'));
      navAnchors.get(e.target.id)?.classList.add('active');
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => spy.observe(s));
