/* Carrie Loves — motion layer. Progressive enhancement: without JS, or with reduced motion, nothing is hidden. */
(function () {
  var d = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  // Hidden/prerendered loads (background tabs, link previews, headless tools) skip the entrance entirely.
  if (document.visibilityState && document.visibilityState !== 'visible') return;

  d.classList.add('m-on', 'm-pending');
  var released = false;
  function release() { if (!released) { released = true; d.classList.remove('m-pending'); } }
  // Always-on failsafe: never cleared, timer-based (not rAF), so content can't stay hidden.
  setTimeout(function () { release(); }, 1200);
  setTimeout(function () { revealInView(); }, 4000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState !== 'visible') { release(); revealAll(); } });
  window.addEventListener('pageshow', function (e) { if (e.persisted) { release(); revealAll(); } });

  var io = new IntersectionObserver(function (entries) {
    var hits = entries.filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
    hits.forEach(function (e, i) {
      var el = e.target;
      if (!el.style.getPropertyValue('--m-delay')) el.style.setProperty('--m-delay', Math.min(i, 4) * 0.07 + 's');
      show(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  function show(el) {
    el.classList.add('m-in');
    var delay = parseFloat(el.style.getPropertyValue('--m-delay')) || 0;
    setTimeout(function () { el.classList.add('m-done'); }, (delay + 1) * 1000);
  }
  function revealInView() {
    [].forEach.call(document.querySelectorAll('[data-m]:not(.m-in)'), function (el) {
      var b = el.getBoundingClientRect();
      if (b.top < innerHeight && b.bottom > 0) { show(el); io.unobserve(el); }
    });
  }
  function revealAll() {
    [].forEach.call(document.querySelectorAll('[data-m]:not(.m-in)'), function (el) { show(el); io.unobserve(el); });
  }

  function tag(el, kind, delay) {
    if (!el || el.hasAttribute('data-m')) return;
    var r = el.getBoundingClientRect();
    el.setAttribute('data-m', kind || 'up');
    if (delay != null) el.style.setProperty('--m-delay', delay + 's');
    if (r.bottom < 0) { el.classList.add('m-in', 'm-done'); return; } // already scrolled past (back/forward restore)
    io.observe(el);
  }

  function isRow(el) {
    var cs = getComputedStyle(el);
    if (el.children.length < 2) return false;
    if (cs.display.indexOf('grid') > -1) return cs.gridTemplateColumns.split(' ').length > 1;
    if (cs.display.indexOf('flex') > -1) return cs.flexDirection.indexOf('row') === 0;
    return false;
  }
  function isStack(el) {
    var cs = getComputedStyle(el);
    return el.children.length > 1 && cs.display.indexOf('flex') > -1 && cs.flexDirection.indexOf('column') === 0;
  }

  function setupHero(h) {
    [].forEach.call(h.children, function (cell) {
      if (cell.querySelector('img') && !cell.querySelector('h1')) { tag(cell, 'img', 0.18); return; }
      var kids = cell.children.length ? cell.children : [cell];
      [].forEach.call(kids, function (k, i) { tag(k, 'hero', Math.min(i, 6) * 0.07); });
    });
  }

  function arrows(root) {
    [].forEach.call(root.querySelectorAll('a, a span'), function (el) {
      if (el.children.length) return;
      var t = (el.textContent || '').trim();
      if (/→$/.test(t)) el.setAttribute('data-m-arrow', 'r');
      else if (/^←/.test(t) && el.tagName === 'A') el.setAttribute('data-m-arrow', 'l');
    });
  }

  function init(root) {
    var blocks = [].filter.call(root.children, function (el) { return el.tagName !== 'NAV'; });
    var hero = root.querySelector(':scope > header');
    if (hero) setupHero(hero);
    blocks.forEach(function (b) {
      if (b === hero) return;
      if (isRow(b) || isStack(b)) [].forEach.call(b.children, function (k) { tag(k, 'up'); });
      else tag(b, 'up');
    });
    arrows(root);
    setTimeout(release, 16);
  }

  function findRoot() {
    var nav = document.querySelector('nav');
    return nav && nav.parentElement && nav.parentElement.children.length > 2 ? nav.parentElement : null;
  }

  function start() {
    var t, done = false;
    var mo = new MutationObserver(function () {
      if (done || !findRoot()) return;
      clearTimeout(t);
      t = setTimeout(function () { done = true; mo.disconnect(); init(findRoot()); }, 60);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    if (findRoot()) { t = setTimeout(function () { if (!done) { done = true; mo.disconnect(); init(findRoot()); } }, 60); }
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
