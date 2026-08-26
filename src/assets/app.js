/* 227 — script global. Aucune dépendance, aucune requête réseau sortante. */
(function () {
  'use strict';
  var D = document, R = D.documentElement;
  var LS = { get: function (k, d) { try { var v = localStorage.getItem('a227.' + k); return v === null ? d : v; } catch (e) { return d; } },
             set: function (k, v) { try { localStorage.setItem('a227.' + k, v); } catch (e) {} } };

  /* ── Préférences : thème, contraste, densité, animations ─────────────── */
  var PREFS = [['theme', 'data-theme'], ['contrast', 'data-contrast'], ['density', 'data-density'], ['motion', 'data-motion']];
  PREFS.forEach(function (p) { var v = LS.get(p[0], ''); if (v) R.setAttribute(p[1], v); });

  function cycle(key, attr, values, labels) {
    var cur = R.getAttribute(attr) || values[0];
    var next = values[(values.indexOf(cur) + 1) % values.length];
    if (next === values[0]) { R.removeAttribute(attr); LS.set(key, ''); }
    else { R.setAttribute(attr, next); LS.set(key, next); }
    toast(labels[next] || labels[values[0]]);
    syncPressed();
  }
  function syncPressed() {
    var t = R.getAttribute('data-theme');
    var b = D.getElementById('btn-theme');
    if (b) b.setAttribute('aria-label', 'Thème : ' + (t || 'système') + '. Changer.');
  }

  D.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'theme')    cycle('theme', 'data-theme', ['', 'light', 'dark'], { '': 'Thème : système', light: 'Thème : clair', dark: 'Thème : sombre' });
    if (a === 'contrast') cycle('contrast', 'data-contrast', ['', 'high'], { '': 'Contraste normal', high: 'Contraste renforcé' });
    if (a === 'density')  cycle('density', 'data-density', ['', 'large'], { '': 'Texte normal', large: 'Texte agrandi' });
    if (a === 'motion')   cycle('motion', 'data-motion', ['', 'off'], { '': 'Animations activées', off: 'Animations désactivées' });
    if (a === 'menu')     { var m = D.getElementById('mobnav'); if (m) { m.classList.toggle('on'); el.setAttribute('aria-expanded', m.classList.contains('on')); } }
    if (a === 'cmd')      openCmd();
    if (a === 'top')      window.scrollTo({ top: 0, behavior: R.getAttribute('data-motion') === 'off' ? 'auto' : 'smooth' });
    if (a === 'print')    window.print();
    if (a === 'copy')     copy(el.getAttribute('data-copy') || location.href);
  });
  syncPressed();

  /* ── Toast ───────────────────────────────────────────────────────────── */
  var tEl, tTimer;
  function toast(msg) {
    if (!tEl) { tEl = D.createElement('div'); tEl.className = 'toast'; tEl.setAttribute('role', 'status'); tEl.setAttribute('aria-live', 'polite'); D.body.appendChild(tEl); }
    tEl.textContent = msg; tEl.classList.add('on');
    clearTimeout(tTimer); tTimer = setTimeout(function () { tEl.classList.remove('on'); }, 2400);
  }
  window.a227toast = toast;

  function copy(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { toast('Lien copié'); }, function () { fallbackCopy(txt); });
    } else fallbackCopy(txt);
  }
  function fallbackCopy(txt) {
    var ta = D.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-9999px'; D.body.appendChild(ta); ta.select();
    try { D.execCommand('copy'); toast('Lien copié'); } catch (e) { toast('Copie impossible'); }
    D.body.removeChild(ta);
  }

  /* ── Partage natif ───────────────────────────────────────────────────── */
  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-share]'); if (!b) return;
    e.preventDefault();
    var url = b.getAttribute('data-url') || location.href;
    var title = b.getAttribute('data-title') || D.title;
    var text = b.getAttribute('data-text') || '';
    if (navigator.share) navigator.share({ title: title, text: text, url: url }).catch(function () {});
    else copy(url);
  });
  if (!navigator.share) { var nb = D.querySelectorAll('[data-share]'); for (var i = 0; i < nb.length; i++) nb[i].setAttribute('title', 'Copier le lien'); }

  /* ── Ancres de section ───────────────────────────────────────────────── */
  var hs = D.querySelectorAll('main h2[id],main h3[id]');
  for (var j = 0; j < hs.length; j++) {
    var h = hs[j], a = D.createElement('a');
    a.className = 'anchor'; a.href = '#' + h.id; a.textContent = '#';
    a.setAttribute('aria-label', 'Lien vers la section « ' + h.textContent.trim() + ' »');
    h.appendChild(a);
  }

  /* ── Apparition au défilement ────────────────────────────────────────
     Implémentation par mesure directe : elle fonctionne partout, y compris
     lorsque IntersectionObserver n'émet pas (rendu hors écran, capture,
     navigateurs anciens). Aucun contenu ne peut rester masqué. */
  (function () {
    var nodes = [].slice.call(D.querySelectorAll('.reveal'));
    if (!nodes.length) return;
    var pending = false;
    function pass() {
      pending = false;
      var h = innerHeight || 800;
      for (var i = nodes.length - 1; i >= 0; i--) {
        var r = nodes[i].getBoundingClientRect();
        if (r.top < h * 0.96 && r.bottom > -h * 0.4) { nodes[i].classList.add('in'); nodes.splice(i, 1); }
      }
      if (!nodes.length) {
        removeEventListener('scroll', queue); removeEventListener('resize', queue);
      }
    }
    function queue() { if (!pending) { pending = true; requestAnimationFrame(pass); } }
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    pass();
    /* Filet de sécurité : rien ne reste invisible plus de trois secondes. */
    setTimeout(function () { nodes.forEach(function (n) { n.classList.add('in'); }); }, 3000);
  })();

  /* ── Compteurs animés — la valeur finale est garantie, animation ou pas ─── */
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches || R.getAttribute('data-motion') === 'off';
  D.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = (end % 1 !== 0) ? 1 : 0;
    var fin = end.toLocaleString('fr-BE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    el.setAttribute('data-final', fin);
    el.textContent = fin;
  });
  /* L'animation ne démarre que si requestAnimationFrame est réellement vivant.
     Sinon la valeur finale reste affichée : un chiffre faux ne peut jamais apparaître. */
  var rafAlive = false;
  requestAnimationFrame(function () { rafAlive = true; });
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        if (!rafAlive) return;
        var el = en.target, fin = el.getAttribute('data-final');
        var end = parseFloat(el.getAttribute('data-count')), dec = (end % 1 !== 0) ? 1 : 0;
        var t0 = null, dur = 1100, guard = setTimeout(function () { el.textContent = fin; }, dur + 900);
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = (end * e).toLocaleString('fr-BE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
          if (p < 1) requestAnimationFrame(step); else { clearTimeout(guard); el.textContent = fin; }
        }
        requestAnimationFrame(step);
      });
    }, { threshold: .4 });
    D.querySelectorAll('[data-count]').forEach(function (n) { co.observe(n); });
  }

  /* ── Palette de commandes (Ctrl/⌘ + K) ───────────────────────────────── */
  var dlg = D.getElementById('cmdk');
  function openCmd() {
    if (!dlg || !dlg.showModal) { location.href = (D.body.getAttribute('data-root') || '') + 'atlas/'; return; }
    dlg.showModal();
    var inp = dlg.querySelector('input'); inp.value = ''; filterCmd(''); inp.focus();
  }
  function filterCmd(q) {
    q = q.trim().toLowerCase();
    dlg.querySelectorAll('li').forEach(function (li) {
      li.hidden = q ? li.textContent.toLowerCase().indexOf(q) === -1 : false;
    });
  }
  if (dlg) {
    dlg.querySelector('input').addEventListener('input', function () { filterCmd(this.value); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var first = [].slice.call(dlg.querySelectorAll('li')).filter(function (l) { return !l.hidden; })[0];
      if (first && D.activeElement.tagName === 'INPUT') { e.preventDefault(); first.querySelector('a').click(); }
    });
  }
  D.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmd(); }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(D.activeElement.tagName)) {
      var s = D.getElementById('q'); if (s) { e.preventDefault(); s.focus(); s.select(); } else { e.preventDefault(); openCmd(); }
    }
  });

  /* ── Barre de progression de lecture ─────────────────────────────────── */
  var pb = D.getElementById('readbar');
  if (pb) {
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var h = D.body.scrollHeight - innerHeight;
        pb.style.transform = 'scaleX(' + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ')';
        tick = false;
      });
    }, { passive: true });
  }

  /* ── Service worker (hors-ligne) ─────────────────────────────────────── */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    addEventListener('load', function () {
      navigator.serviceWorker.register((D.body.getAttribute('data-root') || '') + 'sw.js').catch(function () {});
    });
  }
})();
