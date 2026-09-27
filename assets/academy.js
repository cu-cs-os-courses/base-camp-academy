/* Base Camp Academy — page runtime.
   Reading behavior follows the QEC Atlas Academy tutorials (terms, quizzes,
   scroll spy, progress). Present mode is ours: press P and every
   `.ch-head` / `.sec` becomes a 16:9 slide.
   Markup contract: see README.md. */
(function (root) {
  'use strict';
  const doc = root.document;
  const html = doc.documentElement;
  const ctrls = new WeakMap();
  const stepOf = new WeakMap();
  let slides = [];
  let cur = 0;

  /* ---------- term tooltips (hover, focus, or tap) ---------- */
  function initTerms() {
    doc.querySelectorAll('.term').forEach((t) => {
      t.setAttribute('tabindex', '0');
      t.addEventListener('click', () => {
        doc.querySelectorAll('.term.tip-open').forEach((o) => { if (o !== t) o.classList.remove('tip-open'); });
        t.classList.toggle('tip-open');
      });
    });
  }

  /* ---------- quizzes ----------
     <div class="quiz" data-quiz> … .q-opt[data-ok] … .q-fb.ok / .q-fb.no
     A wrong option may carry its own hint in data-why. */
  function initQuizzes() {
    doc.querySelectorAll('[data-quiz]').forEach((q) => {
      const opts = q.querySelectorAll('.q-opt');
      const fbOk = q.querySelector('.q-fb.ok');
      const fbNo = q.querySelector('.q-fb.no');
      const noDefault = fbNo ? fbNo.innerHTML : '';
      opts.forEach((o) => {
        o.addEventListener('click', () => {
          const right = o.hasAttribute('data-ok');
          o.classList.add(right ? 'picked-ok' : 'picked-no');
          if (right) {
            opts.forEach((oo) => (oo.disabled = true));
            if (fbOk) fbOk.classList.add('show');
            if (fbNo) fbNo.classList.remove('show');
          } else if (fbNo) {
            fbNo.innerHTML = o.dataset.why || noDefault;
            fbNo.classList.add('show');
          }
        });
      });
    });
  }

  /* ---------- scroll spy + progress ---------- */
  function initNav() {
    const bar = doc.querySelector('.progress-bar');
    const links = [...doc.querySelectorAll('.rail a[href^="#"]')];
    const targets = links.map((a) => doc.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    function onScroll() {
      if (html.classList.contains('present')) return;
      if (bar) {
        const p = html.scrollTop / Math.max(1, html.scrollHeight - html.clientHeight);
        bar.style.width = (p * 100).toFixed(2) + '%';
      }
      if (targets.length) {
        let active = 0;
        for (let i = 0; i < targets.length; i++) if (targets[i].getBoundingClientRect().top < 130) active = i;
        links.forEach((a, i) => a.classList.toggle('active', i === active));
      }
    }
    root.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- stepping (fragments + widget controllers) ---------- */
  function maxStep(s) {
    let m = (ctrls.get(s) && ctrls.get(s).steps) || 0;
    s.querySelectorAll('[data-step]').forEach((el) => { m = Math.max(m, +el.dataset.step || 0); });
    return m;
  }
  function readStep(s) {
    const c = ctrls.get(s);
    return c && 'readStep' in c ? c.readStep : maxStep(s);
  }
  function applyStep(s, i) {
    stepOf.set(s, i);
    const presenting = html.classList.contains('present');
    s.querySelectorAll('[data-step]').forEach((el) => el.classList.toggle('pending', presenting && +el.dataset.step > i));
    const c = ctrls.get(s);
    if (c && c.show) c.show(i);
  }

  /* ---------- present mode ---------- */
  function fit(s) {
    s.style.setProperty('--z', 1);
    const h = Math.max(s.getBoundingClientRect().height, 562);
    const z = Math.min(root.innerWidth * 0.94 / 1000, root.innerHeight * 0.9 / h);
    s.style.setProperty('--z', z.toFixed(4));
  }
  function showSlide(i, step) {
    if (slides[cur]) slides[cur].classList.remove('p-cur');
    cur = Math.max(0, Math.min(slides.length - 1, i));
    const s = slides[cur];
    s.classList.add('p-cur');
    applyStep(s, step === 'end' ? maxStep(s) : step || 0);
    fit(s);
    const bar = doc.querySelector('.pbar');
    if (bar) bar.style.width = ((cur + 1) / slides.length * 100) + '%';
    const cnt = doc.querySelector('.pnav .count');
    if (cnt) cnt.textContent = (cur + 1) + ' / ' + slides.length;
    if (s.id) history.replaceState(null, '', '#' + s.id);
  }
  function next() {
    const s = slides[cur], i = stepOf.get(s) || 0;
    if (i < maxStep(s)) applyStep(s, i + 1);
    else if (cur < slides.length - 1) showSlide(cur + 1, 0);
  }
  function prev() {
    const s = slides[cur], i = stepOf.get(s) || 0;
    if (i > 0) applyStep(s, i - 1);
    else if (cur > 0) showSlide(cur - 1, 'end');
  }
  function nearestSlide() {
    let best = 0, bestD = Infinity;
    slides.forEach((s, k) => {
      if (s.classList.contains('present-only')) return;
      const d = Math.abs(s.getBoundingClientRect().top - 80);
      if (d < bestD) { bestD = d; best = k; }
    });
    if (html.scrollTop < 200) {
      // at the top: start from the slide the URL names, else the title slide
      const at = slides.findIndex((s) => s.id && '#' + s.id === location.hash);
      return at >= 0 ? at : 0;
    }
    return best;
  }
  function setPresent(on) {
    if (on === html.classList.contains('present')) return;
    if (on) {
      const i = nearestSlide();
      html.classList.add('present');
      showSlide(i, 0);
    } else {
      const s = slides[cur];
      html.classList.remove('present');
      slides.forEach((x) => { x.classList.remove('p-cur'); x.style.removeProperty('--z'); applyStep(x, readStep(x)); });
      if (s && !s.classList.contains('present-only')) s.scrollIntoView({ block: 'start' });
      if (doc.fullscreenElement) doc.exitFullscreen().catch(() => {});
    }
  }
  function typing(e) {
    const t = e.target;
    return t && (t.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName));
  }
  function onKey(e) {
    if (e.key === 'Escape') doc.querySelectorAll('.term.tip-open').forEach((o) => o.classList.remove('tip-open'));
    if (e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
    const k = e.key;
    if (k === 'p' || k === 'P') { e.preventDefault(); setPresent(!html.classList.contains('present')); return; }
    if (!html.classList.contains('present')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) {
      if (k === ' ' && e.target.closest && e.target.closest('button')) return;
      e.preventDefault(); next();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); showSlide(0, 0); }
    else if (k === 'End') { e.preventDefault(); showSlide(slides.length - 1, 0); }
    else if (k === 'Escape') setPresent(false);
    else if (k === 'f' || k === 'F') {
      if (doc.fullscreenElement) doc.exitFullscreen().catch(() => {});
      else if (html.requestFullscreen) html.requestFullscreen().catch(() => {});
    }
  }

  function init() {
    slides = [...doc.querySelectorAll('main > .sec, main .chapter > .ch-head, main .chapter > .sec')];
    slides.forEach((s) => applyStep(s, readStep(s)));
    initTerms();
    initQuizzes();
    initNav();

    const nav = doc.createElement('div');
    nav.className = 'pnav';
    nav.innerHTML = '<button type="button" data-nav="prev" aria-label="Previous">‹</button><span class="count"></span>' +
      '<button type="button" data-nav="next" aria-label="Next">›</button><button type="button" data-nav="exit">Esc · read</button>';
    doc.body.appendChild(nav);
    const bar = doc.createElement('div'); bar.className = 'pbar'; doc.body.appendChild(bar);
    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-nav]'); if (!b) return;
      if (b.dataset.nav === 'prev') prev(); else if (b.dataset.nav === 'next') next(); else setPresent(false);
    });
    doc.addEventListener('keydown', onKey);
    root.addEventListener('resize', () => { if (html.classList.contains('present')) fit(slides[cur]); });
  }

  root.Academy = {
    /* Hook a widget into stepping: spec = { steps, show(i), readStep? }.
       Returns { go(i) } for the widget's own buttons. */
    register(slide, spec) {
      const s = typeof slide === 'string' ? doc.getElementById(slide) : slide;
      ctrls.set(s, spec);
      return { go(i) { applyStep(s, i); } };
    },
    presenting() { return html.classList.contains('present'); },
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else queueMicrotask(init);
})(window);
