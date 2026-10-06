/* VLS Engineers — Home page behaviour */

// ---------- mobile menu ----------
(function () {
  var b = document.querySelector('.burger');
  var n = document.querySelector('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  n.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      n.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

// ---------- hero slider: 11 second auto-rotate ----------
(function () {
  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('.dots button');
  if (slides.length < 2) return;

  var DURATION = 11000;
  var i = 0, timer = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(n) {
    slides[i].classList.remove('on');
    dots[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('on');
    // restart the dot progress animation
    var bar = dots[i].querySelector('span');
    bar.style.transition = 'none';
    bar.style.width = '0';
    void bar.offsetWidth;
    bar.style.transition = '';
    dots[i].classList.add('on');
  }

  function start() {
    if (reduce) return;
    stop();
    timer = setInterval(function () { show(i + 1); }, DURATION);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach(function (d, n) {
    d.addEventListener('click', function () { show(n); start(); });
  });

  // pause while the tab is hidden so slides do not race when it returns
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  // swipe left / right to change slide
  var hero = document.querySelector('.hero');
  var sx = 0, sy = 0;
  hero.addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    show(dx < 0 ? i + 1 : i - 1);
    start();
  }, { passive: true });

  slides[0].classList.add('on');
  dots[0].classList.add('on');
  start();
})();

// ---------- marquee: duplicate the track so the loop is seamless ----------
(function () {
  document.querySelectorAll('.marq-track').forEach(function (t) {
    t.innerHTML += t.innerHTML;
  });
})();

// ---------- reveal on scroll ----------
(function () {
  var els = document.querySelectorAll('.rise');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) { io.observe(el); });
})();

// ---------- year ----------
var yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// ---------- enquiry form to WhatsApp ----------
var form = document.getElementById('enquiry');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var msg = 'New enquiry from vlsengineers.com\n' +
      'Name: ' + f.cname.value + '\n' +
      'Organisation: ' + (f.org.value || '-') + '\n' +
      'Phone: ' + f.phone.value + '\n' +
      'Email: ' + (f.email.value || '-') + '\n' +
      'Service: ' + f.service.value + '\n' +
      'Details: ' + (f.details.value || '-');
    window.open('https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(msg), '_blank');
  });
}

// ---------- header: compact once scrolled ----------
(function () {
  var h = document.querySelector('.head');
  if (!h) return;
  function f() { h.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', f, { passive: true });
  f();
})();

// ---------- scroll progress bar ----------
(function () {
  var bar = document.querySelector('.progress');
  if (!bar) return;
  function f() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
  }
  window.addEventListener('scroll', f, { passive: true });
  f();
})();

// ---------- hero image parallax ----------
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var imgs = hero.querySelectorAll('.bg');
  window.addEventListener('scroll', function () {
    if (window.innerWidth <= 760 || window.scrollY > hero.offsetHeight) return;
    var y = window.scrollY * 0.18;
    imgs.forEach(function (b) { b.style.transform = 'translate3d(0,' + y + 'px,0)'; });
  }, { passive: true });
})();

// ---------- service cards: cursor spotlight and gentle tilt ----------
(function () {
  var cards = document.querySelectorAll('.svc');
  var fine = window.matchMedia('(hover: hover)').matches &&
             !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cards.forEach(function (c) {
    var s = document.createElement('span');
    s.className = 'spot';
    c.appendChild(s);
    if (!fine) return;
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px');
      c.style.setProperty('--my', y + 'px');
      c.style.setProperty('--ry', ((x / r.width - .5) * 8).toFixed(2) + 'deg');
      c.style.setProperty('--rx', ((.5 - y / r.height) * 8).toFixed(2) + 'deg');
    });
    c.addEventListener('mouseleave', function () {
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    });
  });
})();

// ---------- count-up numbers ----------
(function () {
  var nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function run(el) {
    var to = parseInt(el.getAttribute('data-count'), 10);
    var suf = el.getAttribute('data-suffix') || '';
    if (reduce || el.hasAttribute('data-plain')) { el.textContent = to + suf; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!('IntersectionObserver' in window)) { nums.forEach(function (n) { n.textContent = n.getAttribute('data-count') + (n.getAttribute('data-suffix') || ''); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.4 });
  nums.forEach(function (n) { io.observe(n); });
})();
