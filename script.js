/* ===== NAVIGATION ACTIVE STATE ===== */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === page || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Mobile toggle */
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('open');
      // swap icon
      const open = mobile.classList.contains('open');
      toggle.innerHTML = open
        ? '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
        : '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
      // sync active state in mobile nav
      document.querySelectorAll('.nav-mobile a').forEach(function (a) {
        const href = a.getAttribute('href');
        if (href === page || (page === 'index.html' && href === 'index.html')) {
          a.classList.add('active');
        }
      });
    });
    // close on link click
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobile.classList.remove('open'); });
    });
  }
})();

/* ===== INTERSECTION OBSERVER FOR ANIMATIONS ===== */
(function () {
  const els = document.querySelectorAll('.fade-up, .fade-in');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) {
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });
})();

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = el.dataset.target;
  if (!target) return;
  const isPercent = target.includes('%');
  const isMo = target.includes('mo');
  const isSlash = target.includes('/');
  const num = parseFloat(target);
  if (isNaN(num)) return;
  let start = 0;
  const duration = 1200;
  const step = 16;
  const steps = duration / step;
  const increment = num / steps;
  let current = 0;
  const timer = setInterval(function () {
    current += increment;
    if (current >= num) { current = num; clearInterval(timer); }
    if (isPercent) el.textContent = Math.round(current) + '%';
    else if (isMo) el.textContent = Math.round(current) + 'mo';
    else if (isSlash) el.textContent = '24/7';
    else el.textContent = Math.round(current);
  }, step);
}

(function () {
  const counters = document.querySelectorAll('[data-target]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter); return;
  }
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  counters.forEach(function (el) { obs.observe(el); });
})();
