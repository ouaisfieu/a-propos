/* 227 — Atlas des 226 racines. Filtres, recherche, tri, vues, favoris, export.
   État synchronisé avec l'URL : chaque vue est un permalien partageable. */
(function () {
  'use strict';
  var D = document;
  var node = D.getElementById('roots-data'); if (!node) return;
  var DATA = JSON.parse(node.textContent);
  var ROOTS = DATA.roots, THEMES = DATA.themes, TYPES = DATA.types, ROOT = DATA.root || '';

  var FAV_KEY = 'a227.fav';
  function favs() { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch (e) { return []; } }
  function setFavs(a) { try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch (e) {} }

  var S = { q: '', theme: '', type: '', account: '', status: '', period: '', fav: 0, sort: 'date-desc', view: 'grid' };

  /* normalisation : recherche insensible aux accents et à la casse */
  function nrm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  ROOTS.forEach(function (r) { r._s = nrm(r.repo + ' ' + r.title + ' ' + THEMES[r.theme].label + ' ' + r.type); });

  function readURL() {
    var p = new URLSearchParams(location.search);
    Object.keys(S).forEach(function (k) {
      if (p.has(k)) S[k] = (k === 'fav') ? (p.get(k) === '1' ? 1 : 0) : p.get(k);
    });
  }
  function writeURL() {
    var p = new URLSearchParams();
    Object.keys(S).forEach(function (k) {
      var d = { q: '', theme: '', type: '', account: '', status: '', period: '', fav: 0, sort: 'date-desc', view: 'grid' }[k];
      if (S[k] !== d && S[k] !== '' && S[k] !== 0) p.set(k, S[k]);
    });
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  var FAVSET = null;
  function favSet(){ if(!FAVSET){ FAVSET={}; favs().forEach(function(x){FAVSET[x]=1;}); } return FAVSET; }
  function invalidateFav(){ FAVSET = null; }

  function match(r) {
    if (S.theme && r.theme !== S.theme) return false;
    if (S.type && r.type !== S.type) return false;
    if (S.account && r.account !== S.account) return false;
    if (S.status === 'ok' && r.http !== 200) return false;
    if (S.status === 'ko' && r.http !== 404) return false;
    if (S.period && r.created.slice(0, 7) !== S.period) return false;
    if (S.fav && !favSet()[r.repo]) return false;
    if (S.q) { var t = nrm(S.q).split(/\s+/).filter(Boolean); for (var i = 0; i < t.length; i++) if (r._s.indexOf(t[i]) === -1) return false; }
    return true;
  }

  var SORTS = {
    'date-desc':  function (a, b) { return b.created.localeCompare(a.created) || a.repo.localeCompare(b.repo); },
    'date-asc':   function (a, b) { return a.created.localeCompare(b.created) || a.repo.localeCompare(b.repo); },
    'title-asc':  function (a, b) { return a.title.localeCompare(b.title, 'fr'); },
    'repo-asc':   function (a, b) { return a.repo.localeCompare(b.repo, 'fr'); },
    'theme-asc':  function (a, b) { return THEMES[a.theme].label.localeCompare(THEMES[b.theme].label, 'fr') || a.repo.localeCompare(b.repo); },
    'status-asc': function (a, b) { return a.http - b.http || a.repo.localeCompare(b.repo); }
  };

  var $grid = D.getElementById('atlas-out'), $count = D.getElementById('atlas-count');
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"/></svg>';

  function card(r) {
    var th = THEMES[r.theme], f = !!favSet()[r.repo];
    return '<article class="rcard' + (r.http === 404 ? ' dead' : '') + '" style="--th:' + th.color + '">' +
      '<a class="rt" href="' + ROOT + 'atlas/' + r.slug + '/">' + esc(r.title) + '</a>' +
      '<span class="rp">' + esc(r.repo) + '</span>' +
      '<div class="rf">' +
        '<span class="chip" style="color:' + th.color + '"><span class="dot"></span>' + esc(th.short) + '</span>' +
        '<span class="tiny mono">' + (r.http === 404 ? '404' : r.created) + '</span>' +
        '<button class="fav" data-fav="' + esc(r.repo) + '" aria-pressed="' + f + '" aria-label="Mettre « ' + esc(r.title) + ' » en favori" title="Favori">' + STAR + '</button>' +
      '</div></article>';
  }

  function row(r) {
    var th = THEMES[r.theme];
    return '<tr' + (r.http === 404 ? ' class="dead"' : '') + '>' +
      '<td><a href="' + ROOT + 'atlas/' + r.slug + '/" style="font-weight:600">' + esc(r.title) + '</a><br><span class="tiny mono">' + esc(r.repo) + '</span></td>' +
      '<td><span class="chip" style="color:' + th.color + '"><span class="dot"></span>' + esc(th.short) + '</span></td>' +
      '<td class="mono tiny">' + esc(TYPES[r.type].label) + '</td>' +
      '<td class="n">' + (r.http === 404 ? '<span style="color:var(--red)">404</span>' : '200') + '</td>' +
      '<td class="n tiny">' + r.created + '</td></tr>';
  }

  function render() {
    var list = ROOTS.filter(match).sort(SORTS[S.sort] || SORTS['date-desc']);
    if (!list.length) {
      $grid.innerHTML = '<p class="empty">Aucune racine ne correspond.<br><button class="btn btn-g" id="reset2" style="margin-top:1rem">Réinitialiser les filtres</button></p>';
      var r2 = D.getElementById('reset2'); if (r2) r2.onclick = reset;
    } else if (S.view === 'table') {
      $grid.innerHTML = '<div class="tw"><table><caption class="tiny dim" style="text-align:left;padding:.6rem .8rem">' + list.length +
        ' racines — cliquez un titre pour la fiche détaillée</caption><thead><tr><th scope="col">Publication</th><th scope="col">Thème</th><th scope="col">Type</th><th scope="col" class="n">HTTP</th><th scope="col" class="n">Créé</th></tr></thead><tbody>' +
        list.map(row).join('') + '</tbody></table></div>';
    } else {
      $grid.innerHTML = '<div class="rgrid">' + list.map(card).join('') + '</div>';
    }
    $count.innerHTML = '<b>' + list.length + '</b> / ' + ROOTS.length + ' racines' +
      (list.length ? ' · <span class="dim">' + list.filter(function (r) { return r.http === 404; }).length + ' en 404</span>' : '');
    window.__atlasList = list;
    writeURL();
  }

  /* ── Contrôles ───────────────────────────────────────────────────────── */
  function bind(id, key, ev) {
    var el = D.getElementById(id); if (!el) return;
    el.addEventListener(ev || 'change', function () { S[key] = this.value; render(); });
  }
  var qEl = D.getElementById('q');
  if (qEl) { var deb; qEl.addEventListener('input', function () { var v = this.value; clearTimeout(deb); deb = setTimeout(function () { S.q = v; render(); }, 120); }); }
  ['theme', 'type', 'account', 'status', 'period', 'sort'].forEach(function (k) { bind('f-' + k, k); });

  D.addEventListener('click', function (e) {
    var v = e.target.closest('[data-view]');
    if (v) { S.view = v.getAttribute('data-view'); D.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b === v); }); render(); }
    var f = e.target.closest('[data-fav]');
    if (f) {
      var id = f.getAttribute('data-fav'), a = favs(), i = a.indexOf(id);
      if (i > -1) a.splice(i, 1); else a.push(id);
      setFavs(a); invalidateFav(); f.setAttribute('aria-pressed', i === -1);
      if (window.a227toast) window.a227toast(i === -1 ? 'Ajouté aux favoris (' + a.length + ')' : 'Retiré des favoris');
      if (S.fav) render();
    }
    var tg = e.target.closest('#f-favonly');
    if (tg) { S.fav = S.fav ? 0 : 1; tg.setAttribute('aria-pressed', !!S.fav); render(); }
  });

  function reset() {
    S = { q: '', theme: '', type: '', account: '', status: '', period: '', fav: 0, sort: 'date-desc', view: S.view };
    syncControls(); render();
  }
  var rb = D.getElementById('reset'); if (rb) rb.onclick = reset;

  function syncControls() {
    if (qEl) qEl.value = S.q;
    ['theme', 'type', 'account', 'status', 'period', 'sort'].forEach(function (k) { var el = D.getElementById('f-' + k); if (el) el.value = S[k]; });
    var fo = D.getElementById('f-favonly'); if (fo) fo.setAttribute('aria-pressed', !!S.fav);
    D.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === S.view); });
  }

  /* ── Export du sous-ensemble affiché ─────────────────────────────────── */
  function dl(name, text, mime) {
    var b = new Blob([text], { type: mime + ';charset=utf-8' }), u = URL.createObjectURL(b);
    var a = D.createElement('a'); a.href = u; a.download = name; D.body.appendChild(a); a.click();
    D.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(u); }, 400);
    if (window.a227toast) window.a227toast(name + ' téléchargé');
  }
  var eC = D.getElementById('exp-csv'), eJ = D.getElementById('exp-json');
  if (eC) eC.onclick = function () {
    var L = window.__atlasList || ROOTS;
    var head = ['repo', 'compte', 'titre', 'url', 'theme', 'type', 'http', 'cree'];
    var q = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
    dl('archipel-227.csv', '﻿' + head.join(',') + '\n' + L.map(function (r) {
      return [r.repo, r.account, r.title, r.url, THEMES[r.theme].label, r.type, r.http, r.created].map(q).join(',');
    }).join('\n'), 'text/csv');
  };
  if (eJ) eJ.onclick = function () {
    var L = window.__atlasList || ROOTS;
    dl('archipel-227.json', JSON.stringify({
      "@context": "https://schema.org", "@type": "Dataset",
      name: "Archipel Ouaisfieu × Yannkeep — sous-ensemble filtré",
      dateCreated: new Date().toISOString().slice(0, 10),
      creator: { "@type": "Organization", name: "227" },
      license: "https://opendatacommons.org/licenses/odbl/1-0/",
      variableMeasured: ["repo", "account", "title", "url", "theme", "type", "http", "created"],
      numberOfItems: L.length,
      hasPart: L.map(function (r) { return { repo: r.repo, account: r.account, title: r.title, url: r.url, theme: THEMES[r.theme].label, type: r.type, http: r.http, created: r.created }; })
    }, null, 2), 'application/json');
  };

  readURL(); syncControls(); render();
})();
