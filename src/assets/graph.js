/* 227 — Graphe de l'archipel. Rendu canvas et simulation de forces écrits à la main.
   Aucune bibliothèque, aucune requête réseau. */
(function () {
  'use strict';
  var D = document, host = D.getElementById('graph'), src = D.getElementById('graph-data');
  if (!host || !src) return;
  var DATA = JSON.parse(src.textContent);
  var NODES = DATA.nodes, EDGES = DATA.edges, ROOT = DATA.root || '';

  var cv = D.createElement('canvas');
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label',
    'Graphe de ' + NODES.length + ' nœuds et ' + EDGES.length + ' liens. ' +
    'Le contenu équivalent est disponible en tableaux sous le graphe.');
  cv.tabIndex = 0;
  cv.style.cursor = 'grab';
  host.appendChild(cv);
  var ctx = cv.getContext('2d');

  /* ── Index ───────────────────────────────────────────────────────────── */
  var IX = {}, i, n;
  for (i = 0; i < NODES.length; i++) { IX[NODES[i].id] = i; NODES[i].i = i; }
  var ADJ = NODES.map(function () { return []; });
  var LINKS = [];
  for (i = 0; i < EDGES.length; i++) {
    var a = IX[EDGES[i].a], b = IX[EDGES[i].b];
    if (a === undefined || b === undefined) continue;
    LINKS.push({ a: a, b: b, kind: EDGES[i].kind });
    ADJ[a].push(b); ADJ[b].push(a);
  }

  /* ── Palette lue dans le CSS : le graphe suit le thème du site ───────── */
  var P = {};
  function readPalette() {
    var cs = getComputedStyle(D.documentElement);
    var v = function (k) { return cs.getPropertyValue(k).trim() || '#888'; };
    P = {
      bg: v('--surface'), grid: v('--line'), ink: v('--fg'), ink2: v('--fg-3'), ink3: v('--fg-4'),
      mirror: v('--st-critical'), twin: v('--st-warn'), claim: v('--t-POL'), cohort: v('--t-DOC'),
      cohortNode: v('--fg-4'), accent: v('--sig'),
      st: { etabli: v('--st-good'), estime: v('--st-good'), projete: v('--st-warn'),
            allegue: v('--st-warn'), hypothese: v('--st-serious'), conteste: v('--st-serious'),
            errone: v('--st-critical') },
      th: {}
    };
    ['POL', 'JUS', 'SOC', 'EDU', 'ARG', 'BXL', 'DOC', 'OUT', 'LAB'].forEach(function (t) { P.th[t] = v('--t-' + t); });
  }
  readPalette();
  new MutationObserver(function () { readPalette(); draw(); })
    .observe(D.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (matchMedia) matchMedia('(prefers-color-scheme:dark)').addEventListener
    && matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function () { readPalette(); draw(); });

  function nodeColor(d) {
    if (d.kind === 'claim') return P.st[d.status] || P.ink2;
    if (d.kind === 'cohort') return P.cohortNode;
    return P.th[d.theme] || P.ink2;
  }
  function nodeRadius(d) {
    if (d.kind === 'cohort') return 3.4 + Math.sqrt(d.n) * 1.5;
    if (d.kind === 'claim') return 5.5 + Math.sqrt(d.deg) * 1.6;
    return 3.2 + Math.sqrt(d.deg) * 2.1;
  }

  /* ── État ────────────────────────────────────────────────────────────── */
  var S = {
    /* Les cohortes de production sont masquées au départ : sans elles, la structure
       éditoriale réelle est lisible. Les rallumer montre le rythme de fabrication. */
    kinds: { mirror: 1, twin: 1, claim: 1, cohort: 0 },
    hideIso: 0, theme: '', account: '', q: '',
    repel: 1, dist: 1, focus: null, hover: null, sel: null,
    tx: 0, ty: 0, k: 1
  };
  var visible = new Uint8Array(NODES.length);
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches ||
               D.documentElement.getAttribute('data-motion') === 'off';

  function matches(d) {
    if (!S.q) return false;
    var q = S.q.toLowerCase();
    return (d.label || '').toLowerCase().indexOf(q) > -1 || (d.sub || '').toLowerCase().indexOf(q) > -1;
  }

  function computeVisible() {
    var linkOn = NODES.map(function () { return 0; });
    for (var j = 0; j < LINKS.length; j++) {
      if (!S.kinds[LINKS[j].kind]) continue;
      linkOn[LINKS[j].a] = 1; linkOn[LINKS[j].b] = 1;
    }
    var focusSet = null;
    if (S.focus !== null) {
      focusSet = {}; focusSet[S.focus] = 1;
      ADJ[S.focus].forEach(function (x) { focusSet[x] = 1; ADJ[x].forEach(function (y) { focusSet[y] = 1; }); });
    }
    for (var i2 = 0; i2 < NODES.length; i2++) {
      var d = NODES[i2], ok = 1;
      if (d.kind === 'claim' && !S.kinds.claim) ok = 0;
      if (d.kind === 'cohort' && !S.kinds.cohort) ok = 0;
      if (d.kind === 'root') {
        if (S.theme && d.theme !== S.theme) ok = 0;
        if (S.account && d.account !== S.account) ok = 0;
        if (S.hideIso && !linkOn[i2]) ok = 0;
      }
      if (focusSet && !focusSet[i2]) ok = 0;
      visible[i2] = ok;
    }
  }

  /* ── Disposition initiale : cercle par composante ────────────────────── */
  var W = 900, H = 620;
  (function seed() {
    var comps = {};
    NODES.forEach(function (d) { (comps[d.comp] = comps[d.comp] || []).push(d); });
    var keys = Object.keys(comps).sort(function (a, b) { return comps[b].length - comps[a].length; });
    var cols = Math.ceil(Math.sqrt(keys.length));
    keys.forEach(function (k, ci) {
      var g = comps[k], cx, cy;
      if (ci === 0) { cx = 0; cy = 0; }
      else {
        var ring = Math.floor((ci - 1) / cols) + 1, pos = (ci - 1) % cols;
        var ang = (pos / cols) * Math.PI * 2 + ring * 0.7;
        cx = Math.cos(ang) * (170 + ring * 120);
        cy = Math.sin(ang) * (170 + ring * 120);
      }
      g.forEach(function (d, gi) {
        var a2 = (gi / Math.max(1, g.length)) * Math.PI * 2;
        var r = 12 + Math.sqrt(g.length) * 9;
        d.x = cx + Math.cos(a2) * r + (gi % 3) * 2;
        d.y = cy + Math.sin(a2) * r + (gi % 5) * 2;
        d.vx = 0; d.vy = 0; d.fx = null; d.fy = null;
      });
    });
  })();

  /* ── Simulation ──────────────────────────────────────────────────────── */
  var alpha = 1, running = true;
  function tick() {
    var i2, j2, d, e, dx, dy, d2, f, L = NODES.length;
    /* répulsion */
    var K = 900 * S.repel;
    for (i2 = 0; i2 < L; i2++) {
      if (!visible[i2]) continue;
      var A = NODES[i2];
      for (j2 = i2 + 1; j2 < L; j2++) {
        if (!visible[j2]) continue;
        var B = NODES[j2];
        dx = B.x - A.x; dy = B.y - A.y;
        d2 = dx * dx + dy * dy;
        if (d2 < 1) { d2 = 1; dx = (i2 % 7) - 3; dy = (j2 % 7) - 3; }
        if (d2 > 40000) continue;
        f = K / d2;
        var dd = Math.sqrt(d2), ux = dx / dd, uy = dy / dd;
        A.vx -= ux * f * alpha; A.vy -= uy * f * alpha;
        B.vx += ux * f * alpha; B.vy += uy * f * alpha;
      }
    }
    /* ressorts */
    var LEN = 46 * S.dist;
    for (i2 = 0; i2 < LINKS.length; i2++) {
      e = LINKS[i2];
      if (!S.kinds[e.kind] || !visible[e.a] || !visible[e.b]) continue;
      var na = NODES[e.a], nb = NODES[e.b];
      dx = nb.x - na.x; dy = nb.y - na.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      f = (dist - LEN) * 0.055 * alpha;
      var vx = (dx / dist) * f, vy = (dy / dist) * f;
      na.vx += vx; na.vy += vy; nb.vx -= vx; nb.vy -= vy;
    }
    /* centrage + intégration + contrainte radiale.
       Sans lien, un nœud ne subit que la répulsion : la contrainte l'empêche
       de partir à l'infini et garde la carte cadrable. */
    var nVis = 0;
    for (i2 = 0; i2 < L; i2++) if (visible[i2]) nVis++;
    var RMAX = 30 + 23 * Math.sqrt(Math.max(1, nVis));
    for (i2 = 0; i2 < L; i2++) {
      d = NODES[i2];
      if (!visible[i2]) continue;
      if (d.fx !== null) { d.x = d.fx; d.y = d.fy; d.vx = 0; d.vy = 0; continue; }
      d.vx -= d.x * 0.005 * alpha; d.vy -= d.y * 0.005 * alpha;
      d.vx *= 0.86; d.vy *= 0.86;
      d.x += d.vx; d.y += d.vy;
      var rr = Math.sqrt(d.x * d.x + d.y * d.y);
      if (rr > RMAX) { var s2 = RMAX / rr; d.x *= s2; d.y *= s2; d.vx *= 0.4; d.vy *= 0.4; }
    }
    alpha *= 0.994;
    if (alpha < 0.008) { alpha = 0.008; }
  }

  /* ── Rendu ───────────────────────────────────────────────────────────── */
  var dpr = Math.min(devicePixelRatio || 1, 2);
  function resize() {
    var r = host.getBoundingClientRect();
    W = Math.max(320, r.width); H = Math.max(360, r.height);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  addEventListener('resize', resize);

  function tf(d) { return { x: (d.x * S.k) + S.tx + W / 2, y: (d.y * S.k) + S.ty + H / 2 }; }

  /* Cadrage automatique : tout ce qui est visible tient dans le canvas.
     Ne s'applique plus dès que la personne a touché à la vue. */
  var touched = false;
  function fit(force) {
    if (touched && !force) return;
    var minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9, any = false;
    for (var i3 = 0; i3 < NODES.length; i3++) {
      if (!visible[i3]) continue;
      var d = NODES[i3], r = nodeRadius(d) + 26;
      any = true;
      if (d.x - r < minx) minx = d.x - r;
      if (d.y - r < miny) miny = d.y - r;
      if (d.x + r > maxx) maxx = d.x + r;
      if (d.y + r > maxy) maxy = d.y + r;
    }
    if (!any) return;
    var gw = Math.max(1, maxx - minx), gh = Math.max(1, maxy - miny);
    S.k = Math.min(2.2, Math.max(0.18, Math.min(W / gw, H / gh)));
    S.tx = -((minx + maxx) / 2) * S.k;
    S.ty = -((miny + maxy) / 2) * S.k;
  }

  function neighbourSet(i2) {
    var s = {}; s[i2] = 1;
    ADJ[i2].forEach(function (x) { s[x] = 1; });
    return s;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var hi = S.hover !== null ? S.hover : S.sel;
    var near = hi !== null ? neighbourSet(hi) : null;
    var qActive = !!S.q;

    /* arêtes */
    for (var i2 = 0; i2 < LINKS.length; i2++) {
      var e = LINKS[i2];
      if (!S.kinds[e.kind] || !visible[e.a] || !visible[e.b]) continue;
      var A = tf(NODES[e.a]), B = tf(NODES[e.b]);
      var on = !near || (near[e.a] && near[e.b]);
      ctx.globalAlpha = near ? (on ? 0.85 : 0.07) : (e.kind === 'cohort' ? 0.3 : 0.5);
      ctx.strokeStyle = P[e.kind];
      ctx.lineWidth = (e.kind === 'mirror' ? 1.9 : e.kind === 'twin' ? 1.5 : e.kind === 'claim' ? 1.2 : 0.8) * Math.min(S.k, 2);
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* nœuds */
    var labels = [];
    for (i2 = 0; i2 < NODES.length; i2++) {
      if (!visible[i2]) continue;
      var d = NODES[i2], p = tf(d), r = nodeRadius(d) * Math.min(Math.max(S.k, .55), 1.9);
      var on2 = !near || near[i2];
      var m = qActive && matches(d);
      ctx.globalAlpha = near ? (on2 ? 1 : 0.12) : (qActive ? (m ? 1 : 0.18) : 1);
      var shape = function (rr) {
        ctx.beginPath();
        if (d.kind === 'cohort') ctx.rect(p.x - rr, p.y - rr, rr * 2, rr * 2);
        else ctx.arc(p.x, p.y, rr, 0, 6.2832);
      };
      /* 1. halo de séparation, dessiné SOUS le nœud */
      shape(r + 1.4); ctx.fillStyle = P.bg; ctx.fill();
      /* 2. le nœud */
      shape(r);
      if (d.kind === 'root' && d.http === 404) {
        /* Racine morte : anneau creux dans la couleur de son thème.
           Le rouge est déjà pris par un thème — la forme porte l'information, pas la teinte. */
        ctx.fillStyle = P.bg; ctx.fill();
        ctx.strokeStyle = nodeColor(d); ctx.lineWidth = 1.9; ctx.stroke();
      } else { ctx.fillStyle = nodeColor(d); ctx.fill(); }
      /* 3. anneau de mise en évidence, par-dessus */
      if (i2 === hi || m) { shape(r + 2.2); ctx.strokeStyle = P.ink; ctx.lineWidth = 1.8; ctx.stroke(); }
      if (on2 && (i2 === hi || m || d.deg >= 4 || S.k > 1.7 || d.kind === 'claim' && S.k > 1.1))
        labels.push({ d: d, p: p, r: r, strong: i2 === hi || m });
    }
    ctx.globalAlpha = 1;

    /* étiquettes */
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    labels.sort(function (a, b) { return (a.strong ? 1 : 0) - (b.strong ? 1 : 0); });
    for (i2 = 0; i2 < labels.length; i2++) {
      var l = labels[i2], t = l.d.kind === 'root' ? l.d.sub : l.d.kind === 'cohort' ? l.d.label : l.d.sub;
      if (l.d.kind === 'claim') t = '◆ ' + l.d.cid;
      ctx.font = (l.strong ? '600 ' : '') + (l.strong ? 12 : 10.5) + 'px ui-monospace,SFMono-Regular,Menlo,monospace';
      var w = ctx.measureText(t).width;
      ctx.globalAlpha = l.strong ? 1 : 0.82;
      ctx.fillStyle = P.bg;
      ctx.fillRect(l.p.x - w / 2 - 3, l.p.y + l.r + 2, w + 6, 14);
      ctx.fillStyle = l.strong ? P.ink : P.ink2;
      ctx.fillText(t, l.p.x, l.p.y + l.r + 3);
    }
    ctx.globalAlpha = 1;
  }

  var frames = 0;
  function loop() {
    if (running) {
      tick();
      frames++;
      if (!touched && (frames === 60 || frames === 220 || frames === 600)) fit();
      draw();
    }
    requestAnimationFrame(loop);
  }

  /* ── Interaction ─────────────────────────────────────────────────────── */
  function pick(mx, my) {
    var best = null, bd = 24 * 24;
    for (var i2 = 0; i2 < NODES.length; i2++) {
      if (!visible[i2]) continue;
      var p = tf(NODES[i2]);
      var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      var r = nodeRadius(NODES[i2]) * Math.min(Math.max(S.k, .55), 1.9) + 5;
      if (d2 < Math.max(r * r, 64) && d2 < bd) { bd = d2; best = i2; }
    }
    return best;
  }

  var drag = null, panning = null, moved = false;
  cv.addEventListener('pointerdown', function (ev) {
    cv.setPointerCapture(ev.pointerId);
    var r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    var hit = pick(mx, my); moved = false;
    if (hit !== null) { drag = hit; NODES[hit].fx = NODES[hit].x; NODES[hit].fy = NODES[hit].y; alpha = Math.max(alpha, 0.35); }
    else panning = { x: ev.clientX - S.tx, y: ev.clientY - S.ty };
    touched = true;
  });
  cv.addEventListener('pointermove', function (ev) {
    var r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    if (drag !== null) {
      moved = true;
      NODES[drag].fx = (mx - S.tx - W / 2) / S.k;
      NODES[drag].fy = (my - S.ty - H / 2) / S.k;
      alpha = Math.max(alpha, 0.3);
      return;
    }
    if (panning) { moved = true; S.tx = ev.clientX - panning.x; S.ty = ev.clientY - panning.y; draw(); return; }
    var h = pick(mx, my);
    if (h !== S.hover) { S.hover = h; cv.style.cursor = h === null ? 'grab' : 'pointer'; draw(); }
  });
  function endPointer() {
    if (drag !== null && !moved) select(drag);
    if (drag !== null) { NODES[drag].fx = null; NODES[drag].fy = null; }
    drag = null; panning = null;
  }
  cv.addEventListener('pointerup', endPointer);
  cv.addEventListener('pointercancel', endPointer);
  cv.addEventListener('pointerleave', function () { S.hover = null; draw(); });
  cv.addEventListener('dblclick', function (ev) {
    var r = cv.getBoundingClientRect();
    var h = pick(ev.clientX - r.left, ev.clientY - r.top);
    if (h !== null && NODES[h].kind === 'root') location.href = ROOT + 'atlas/' + NODES[h].slug + '/';
  });
  cv.addEventListener('wheel', function (ev) {
    ev.preventDefault();
    touched = true;
    var r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
    var old = S.k, f = Math.exp(-ev.deltaY * 0.0016);
    S.k = Math.min(4, Math.max(0.28, S.k * f));
    S.tx = mx - W / 2 - ((mx - W / 2 - S.tx) / old) * S.k;
    S.ty = my - H / 2 - ((my - H / 2 - S.ty) / old) * S.k;
    draw();
  }, { passive: false });

  /* clavier : parcourir les nœuds visibles */
  cv.addEventListener('keydown', function (ev) {
    var order = [];
    for (var i2 = 0; i2 < NODES.length; i2++) if (visible[i2]) order.push(i2);
    if (!order.length) return;
    var cur = order.indexOf(S.sel === null ? order[0] : S.sel);
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { ev.preventDefault(); select(order[(cur + 1) % order.length]); centre(S.sel); }
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') { ev.preventDefault(); select(order[(cur - 1 + order.length) % order.length]); centre(S.sel); }
    if (ev.key === 'Enter' && S.sel !== null && NODES[S.sel].kind === 'root') location.href = ROOT + 'atlas/' + NODES[S.sel].slug + '/';
    if (ev.key === 'Escape') { S.sel = null; S.focus = null; computeVisible(); panel(null); draw(); }
  });
  function centre(i2) {
    if (i2 === null) return;
    S.tx = -NODES[i2].x * S.k; S.ty = -NODES[i2].y * S.k; draw();
  }

  /* ── Panneau latéral ─────────────────────────────────────────────────── */
  var pan = D.getElementById('gpanel');
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var KINDL = DATA.kinds;

  function select(i2) {
    S.sel = i2; panel(i2); draw();
  }
  function panel(i2) {
    if (!pan) return;
    if (i2 === null) {
      pan.innerHTML = '<p class="kicker">Nœud sélectionné</p><p class="small" style="margin-top:.8rem">' +
        'Survolez un nœud pour isoler ses liens. Cliquez pour l\'épingler ici. Double-cliquez une racine pour ouvrir sa fiche.' +
        '</p><p class="tiny dim" style="margin-top:1rem">Molette pour zoomer, glisser pour déplacer, flèches du clavier pour parcourir, <kbd>Échap</kbd> pour désélectionner.</p>';
      return;
    }
    var d = NODES[i2];
    var links = {};
    for (var j = 0; j < LINKS.length; j++) {
      var e = LINKS[j];
      if (e.a !== i2 && e.b !== i2) continue;
      if (!S.kinds[e.kind]) continue;
      (links[e.kind] = links[e.kind] || []).push(NODES[e.a === i2 ? e.b : e.a]);
    }
    var h = '';
    if (d.kind === 'root') {
      h += '<p class="kicker">Racine</p><h3 style="margin-top:.5rem;font-size:var(--step-1)">' + esc(d.label) + '</h3>' +
        '<p class="tiny mono dim" style="margin-top:.35rem;word-break:break-all">' + esc(d.sub) + '</p>' +
        '<div class="chips" style="margin-top:.9rem">' +
        '<span class="chip" style="color:' + nodeColor(d) + '"><span class="dot"></span>' + esc(DATA.themes[d.theme]) + '</span>' +
        '<span class="chip">' + esc(d.type) + '</span>' +
        '<span class="stat-chip ' + (d.http === 404 ? 'st-critical">✕ 404' : 'st-good">✔ 200') + '</span>' +
        '<span class="chip">' + d.created + '</span></div>' +
        '<p style="margin-top:1rem"><a class="btn btn-g" style="padding:.35rem .7rem;font-size:.78rem" href="' + ROOT + 'atlas/' + d.slug + '/">Fiche complète</a> ' +
        '<button class="btn btn-g" style="padding:.35rem .7rem;font-size:.78rem" data-focus="' + i2 + '">Graphe local</button></p>';
    } else if (d.kind === 'claim') {
      h += '<p class="kicker">Affirmation</p><h3 style="margin-top:.5rem;font-size:var(--step-0);line-height:1.35">« ' + esc(d.label) + ' »</h3>' +
        '<div class="chips" style="margin-top:.9rem"><span class="stat-chip" style="color:' + nodeColor(d) + '">' + esc(d.sub) + '</span></div>' +
        '<p style="margin-top:1rem"><a class="btn btn-g" style="padding:.35rem .7rem;font-size:.78rem" href="' + ROOT + 'registre/#' + d.cid + '">Lire le verdict</a> ' +
        '<button class="btn btn-g" style="padding:.35rem .7rem;font-size:.78rem" data-focus="' + i2 + '">Graphe local</button></p>';
    } else {
      h += '<p class="kicker">Cohorte de production</p><h3 style="margin-top:.5rem;font-size:var(--step-1)">' + esc(d.label) + '</h3>' +
        '<p class="small" style="margin-top:.5rem">' + esc(d.sub) + '</p>' +
        '<p style="margin-top:1rem"><a class="btn btn-g" style="padding:.35rem .7rem;font-size:.78rem" href="' + ROOT + 'atlas/?period=' + d.label.slice(0, 7) + '">Voir ce mois dans l\'atlas</a> ' +
        '<button class="btn btn-g" style="padding:.35rem .7rem;font-size:.78rem" data-focus="' + i2 + '">Graphe local</button></p>';
    }
    var total = Object.keys(links).reduce(function (a, k) { return a + links[k].length; }, 0);
    h += '<hr><p class="kicker">' + total + ' lien' + (total > 1 ? 's' : '') + '</p>';
    if (!total) h += '<p class="small" style="margin-top:.8rem">Aucun lien démontrable avec le reste de l\'archipel. Cette racine n\'est reliée ni par un titre, ni par un nom de dépôt, ni par une affirmation, ni même par une date de création partagée.</p>';
    Object.keys(KINDL).forEach(function (k) {
      if (!links[k]) return;
      h += '<p class="tiny mono" style="margin-top:.9rem;color:' + P[k] + '">' + esc(KINDL[k]) + ' · ' + links[k].length + '</p><ul style="list-style:none;padding:0;margin-top:.4rem;display:grid;gap:.3rem">';
      links[k].slice(0, 14).forEach(function (o) {
        var href = o.kind === 'root' ? ROOT + 'atlas/' + o.slug + '/' : o.kind === 'claim' ? ROOT + 'registre/#' + o.cid : '#';
        h += '<li class="tiny"><a href="' + href + '" style="text-decoration:none">' + esc(o.kind === 'root' ? o.sub : o.label) + '</a></li>';
      });
      if (links[k].length > 14) h += '<li class="tiny dim">… et ' + (links[k].length - 14) + ' autres</li>';
      h += '</ul>';
    });
    pan.innerHTML = h;
  }
  panel(null);

  D.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-focus]');
    if (!b) return;
    var i2 = +b.getAttribute('data-focus');
    S.focus = S.focus === i2 ? null : i2;
    b.textContent = S.focus === null ? 'Graphe local' : 'Vue complète';
    computeVisible(); alpha = 0.9; draw();
  });

  /* ── Contrôles ───────────────────────────────────────────────────────── */
  function bindToggle(id, kind) {
    var el = D.getElementById(id); if (!el) return;
    el.addEventListener('click', function () {
      S.kinds[kind] = S.kinds[kind] ? 0 : 1;
      el.setAttribute('aria-pressed', !!S.kinds[kind]);
      computeVisible(); alpha = Math.max(alpha, .55); draw();
    });
  }
  ['mirror', 'twin', 'claim', 'cohort'].forEach(function (k) { bindToggle('g-' + k, k); });

  var iso = D.getElementById('g-iso');
  /* Après un changement de filtre, la vue se recadre toute seule. */
  function refilter(a) { computeVisible(); alpha = Math.max(alpha, a); touched = false; frames = 0; running = true; fit(); draw(); }
  if (iso) iso.addEventListener('click', function () {
    S.hideIso = S.hideIso ? 0 : 1; iso.setAttribute('aria-pressed', !!S.hideIso); refilter(.6);
  });
  var th = D.getElementById('g-theme');
  if (th) th.addEventListener('change', function () { S.theme = this.value; refilter(.85); });
  var ac = D.getElementById('g-account');
  if (ac) ac.addEventListener('change', function () { S.account = this.value; refilter(.85); });
  var q = D.getElementById('g-q');
  if (q) q.addEventListener('input', function () {
    S.q = this.value.trim(); draw();
    var c = D.getElementById('g-qcount');
    if (c) { var n2 = 0; for (var i3 = 0; i3 < NODES.length; i3++) if (visible[i3] && matches(NODES[i3])) n2++; c.textContent = S.q ? n2 + ' nœud' + (n2 > 1 ? 's' : '') : ''; }
  });
  var rp = D.getElementById('g-repel');
  if (rp) rp.addEventListener('input', function () { S.repel = +this.value; alpha = Math.max(alpha, .5); });
  var dt = D.getElementById('g-dist');
  if (dt) dt.addEventListener('input', function () { S.dist = +this.value; alpha = Math.max(alpha, .5); });
  var rs = D.getElementById('g-reset');
  if (rs) rs.addEventListener('click', function () {
    S.focus = null; S.sel = null; S.q = '';
    if (q) q.value = ''; computeVisible(); panel(null); alpha = Math.max(alpha, .45);
    fit(true); touched = false; frames = 0; draw();
  });
  var pz = D.getElementById('g-pause');
  if (pz) pz.addEventListener('click', function () {
    running = !running; pz.setAttribute('aria-pressed', !running);
    pz.textContent = running ? 'Figer' : 'Reprendre';
  });
  var dl = D.getElementById('g-png');
  if (dl) dl.addEventListener('click', function () {
    var tmp = D.createElement('canvas');
    tmp.width = cv.width; tmp.height = cv.height;
    var c2 = tmp.getContext('2d');
    c2.fillStyle = P.bg; c2.fillRect(0, 0, tmp.width, tmp.height);
    c2.drawImage(cv, 0, 0);
    var a2 = D.createElement('a');
    a2.href = tmp.toDataURL('image/png'); a2.download = 'archipel-graphe.png';
    D.body.appendChild(a2); a2.click(); D.body.removeChild(a2);
    if (window.a227toast) window.a227toast('Graphe exporté en PNG');
  });

  computeVisible();
  resize();
  if (reduce) { for (var t = 0; t < 420; t++) tick(); running = false; fit(); draw(); }
  else requestAnimationFrame(loop);
  /* Les mouvements se calment tout seuls : au bout de ~25 s, la simulation est figée. */
  setTimeout(function () {
    if (reduce) return;
    running = false; fit(); draw();
    if (pz) { pz.setAttribute('aria-pressed', 'true'); pz.textContent = 'Reprendre'; }
  }, 25000);
})();
