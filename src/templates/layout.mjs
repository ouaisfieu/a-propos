import { SITE } from "../data/site.mjs";

export const esc = (s = "") => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const attr = (s = "") => esc(s);
export const abs = (p = "") => SITE.baseUrl.replace(/\/$/, "") + "/" + String(p).replace(/^\//, "");

/* Profondeur -> chemin relatif vers la racine du site */
export const rootOf = (depth) => depth === 0 ? "" : "../".repeat(depth);

export const NAV = [
  { href: "",           label: "Accueil",  key: "home",     desc: "Le manifeste et les chiffres clés" },
  { href: "atlas/",     label: "Atlas",    key: "atlas",    desc: "Les 226 racines, filtrables" },
  { href: "registre/",  label: "Registre", key: "registre", desc: "26 affirmations, notées une à une" },
  { href: "audit/",     label: "Audit",    key: "audit",    desc: "Ce qui tient, ce qui casse" },
  { href: "brol/graph/", label: "Graphe",  key: "brol",     desc: "Le réseau des liens démontrables" },
  { href: "doctrine/",  label: "Doctrine", key: "doctrine", desc: "Lead-dexing, Ratio 120, guerre cognitive" },
  { href: "chantier/",  label: "Chantier", key: "chantier", desc: "21 correctifs, cochables" },
  { href: "methode/",   label: "Méthode",  key: "methode",  desc: "Sources, limites, usage de l'IA" }
];

const ICON = {
  sun:  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>',
  aa:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19l5-14 5 14M4.8 14.6h6.4M15 19l3-9 3 9M15.9 16.4h4.2"/></svg>',
  ctr:  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 000-18z" fill="currentColor" stroke="none"/></svg>',
  cmd:  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L21 21"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7h17M3.5 12h17M3.5 17h17"/></svg>'
};

export const MARK = (c1 = "var(--sig)", c2 = "var(--lil)") => `<svg class="mk" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
<rect x="1" y="1" width="30" height="30" rx="8" fill="none" stroke="${c1}" stroke-width="1.6" opacity=".55"/>
<circle cx="10" cy="11" r="2.6" fill="${c1}"/><circle cx="22" cy="10" r="1.7" fill="${c2}"/>
<circle cx="21" cy="21" r="2.9" fill="none" stroke="${c1}" stroke-width="1.5"/><circle cx="10.5" cy="21.5" r="1.5" fill="${c2}"/>
<path d="M10 11L22 10M10 11l11 10M10.5 21.5L21 21" stroke="${c1}" stroke-width="1" opacity=".6" fill="none"/></svg>`;

/* ── <head> complet : SEO + OG + JSON-LD ──────────────────────────────── */
export function head({ title, desc, path = "", depth = 0, jsonld = [], og = "og-default.png", type = "WebPage", extraCss = "" }) {
  const R = rootOf(depth);
  const url = abs(path);
  const full = path === "" ? `${SITE.name} — ${SITE.tagline}` : `${title} · ${SITE.name}`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${attr(desc)}">
<link rel="canonical" href="${url}">
<meta name="author" content="${attr(SITE.author)}">
<meta name="generator" content="227 static builder — Node ${process.version}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="theme-color" content="#0a0c10" media="(prefers-color-scheme:dark)">
<meta name="theme-color" content="#fbfaf7" media="(prefers-color-scheme:light)">
<meta name="color-scheme" content="dark light">
<meta property="og:type" content="${type === "Article" ? "article" : "website"}">
<meta property="og:site_name" content="${attr(SITE.name + " — " + SITE.tagline)}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:title" content="${attr(full)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs("og/" + og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(title + " — 227, registre critique de l'archipel Ouaisfieu × Yannkeep")}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(full)}">
<meta name="twitter:description" content="${attr(desc)}">
<meta name="twitter:image" content="${abs("og/" + og)}">
<meta name="twitter:image:alt" content="${attr(title)}">
<meta name="twitter:label1" content="Corpus observé"><meta name="twitter:data1" content="226 racines GitHub Pages">
<meta name="twitter:label2" content="Arrêté au"><meta name="twitter:data2" content="26 août 2026">
<link rel="icon" href="${R}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${R}og/icon-180.png">
<link rel="manifest" href="${R}manifest.webmanifest">
<link rel="alternate" type="application/rss+xml" title="227 — mises à jour" href="${R}feed.xml">
<link rel="alternate" type="application/json" title="Catalogue des 226 racines" href="${R}data/roots.json">
<link rel="sitemap" type="application/xml" href="${R}sitemap.xml">
<link rel="stylesheet" href="${R}assets/style.css">${extraCss}
<script>/* amorçage : préférences appliquées avant le premier rendu, pas de flash */
(function(){var d=document.documentElement;d.className+=" js";try{["theme","contrast","density","motion"].forEach(function(k){var v=localStorage.getItem("a227."+k);if(v)d.setAttribute("data-"+k,v);});}catch(e){}})();</script>
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}`;
}

export function header(active, depth = 0) {
  const R = rootOf(depth);
  const links = NAV.map(n =>
    `<a href="${R}${n.href}"${n.key === active ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("");
  return `<a class="skip" href="#main">Aller au contenu</a>
<div id="readbar" style="position:fixed;top:0;left:0;right:0;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left;z-index:99"></div>
<header class="hdr">
  <div class="hdr-in">
    <a class="brand" href="${R}" aria-label="227 — accueil">${MARK()}<b>227</b><span class="dim">Registre critique de l'archipel</span></a>
    <nav class="nav" aria-label="Navigation principale">${links}</nav>
    <div class="tools">
      <button class="iconbtn" data-act="cmd" aria-label="Rechercher — raccourci Ctrl K" title="Rechercher (Ctrl+K)">${ICON.cmd}</button>
      <button class="iconbtn" id="btn-theme" data-act="theme" aria-label="Changer de thème" title="Thème clair / sombre / système">${ICON.sun}</button>
      <button class="iconbtn" data-act="density" aria-label="Agrandir le texte" title="Taille du texte">${ICON.aa}</button>
      <button class="iconbtn" data-act="contrast" aria-label="Renforcer le contraste" title="Contraste renforcé">${ICON.ctr}</button>
      <button class="iconbtn" data-act="menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobnav" style="display:none" id="btn-menu">${ICON.menu}</button>
    </div>
  </div>
  <nav class="mobnav" id="mobnav" aria-label="Navigation mobile">${links}</nav>
</header>
<style>@media(max-width:68rem){#btn-menu{display:grid!important}}</style>`;
}

export function cmdk(depth = 0) {
  const R = rootOf(depth);
  const items = [
    ...NAV.map(n => ({ href: R + n.href, label: n.label, hint: n.desc })),
    { href: R + "atlas/?status=ko", label: "Les 12 racines mortes", hint: "HTTP 404" },
    { href: R + "atlas/?theme=JUS", label: "Justice & scandales", hint: "21 racines" },
    { href: R + "atlas/?period=2026-08", label: "Créations d'août 2026", hint: "70 racines" },
    { href: R + "registre/#errone", label: "Les 3 affirmations erronées", hint: "Correctifs P0" },
    { href: R + "audit/#seo", label: "Couverture des signaux SEO", hint: "10 mesures" },
    { href: R + "chantier/#P0", label: "Chantier P0", hint: "6 correctifs urgents" },
    { href: R + "brol/graph/#methode", label: "Comment le graphe est construit", hint: "4 liens retenus, 3 écartés" },
    { href: R + "brol/graph/#theme-type", label: "Croisement thème × type", hint: "54 cases" },
    { href: R + "data/graph.json", label: "Graphe JSON", hint: "282 nœuds" },
    { href: R + "data/roots.json", label: "Catalogue JSON", hint: "226 racines" },
    { href: R + "data/claims.json", label: "Registre JSON", hint: "26 claims" },
    { href: SITE.usba, label: "11·60 bis — dl.ouaisfi.eu/usba", hint: "Externe" }
  ];
  return `<dialog class="cmd" id="cmdk" aria-label="Recherche rapide">
<input type="search" placeholder="Aller à…  (Échap pour fermer)" aria-label="Filtrer les destinations" autocomplete="off">
<ul>${items.map(i => `<li><a href="${i.href}">${esc(i.label)}<em>${esc(i.hint)}</em></a></li>`).join("")}</ul>
</dialog>`;
}

/* ── Barre de partage social ──────────────────────────────────────────── */
const SI = {
  x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.83L1.25 2.25h6.82l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z"/></svg>',
  bsky:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.77 3.4C8.42 5.4 11.27 9.44 12 11.6c.73-2.16 3.58-6.2 6.23-8.2C20.14 1.96 23 .84 23 4.11c0 .65-.37 5.5-.6 6.28-.75 2.75-3.55 3.45-6.05 3.02 4.36.75 5.47 3.2 3.08 5.66-4.55 4.67-6.54-1.17-7.05-2.67-.1-.28-.14-.4-.14-.29 0-.11-.05.01-.14.29-.51 1.5-2.5 7.34-7.05 2.67-2.4-2.45-1.28-4.91 3.08-5.66-2.5.43-5.3-.27-6.05-3.02C.83 9.6.46 4.76.46 4.11.46.84 3.33 1.96 5.24 3.4z"/></svg>',
  masto:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 8.2c0-4.3-2.8-5.5-2.8-5.5C17.4 2 15 1.7 12.5 1.7h-.06c-2.5 0-4.9.3-6.3.94 0 0-2.8 1.2-2.8 5.5v3.2c0 4.35.7 8.1 4.9 9.2 1.9.5 3.6.6 4.9.55 2.5-.14 3.9-.9 3.9-.9l-.08-1.8s-1.8.56-3.8.5c-2-.07-4.1-.22-4.4-2.66a5 5 0 01-.05-.7s2-.5 4.5-.6c1.53-.1 2.96-.1 4.4-.3 3.05-.36 5.7-2.24 6.03-3.96.5-2.7.47-6.6.47-6.6zm-3.4 5.6h-2.1V8.7c0-1.1-.46-1.65-1.4-1.65-1.02 0-1.54.66-1.54 1.97v2.86h-2.1V9.02c0-1.31-.5-1.97-1.53-1.97-.93 0-1.4.56-1.4 1.65v5.1H6V8.55c0-1.1.28-1.97.85-2.62.58-.64 1.34-.97 2.28-.97 1.1 0 1.92.42 2.47 1.25l.53.88.53-.88c.55-.83 1.38-1.25 2.47-1.25.94 0 1.7.33 2.28.97.57.65.85 1.53.85 2.62z"/></svg>',
  li:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
  fb:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.5h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>',
  wa:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 01-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.02 6.93 2.88a9.74 9.74 0 012.87 6.93c0 5.4-4.4 9.81-9.81 9.81zM20.5 3.49A11.78 11.78 0 0012.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.36-1.67a11.86 11.86 0 005.6 1.43h.01c6.53 0 11.85-5.32 11.86-11.86a11.8 11.8 0 00-3.41-8.41z"/></svg>',
  tg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.94 0C5.35 0 0 5.35 0 11.94s5.35 11.94 11.94 11.94 11.94-5.35 11.94-11.94S18.53 0 11.94 0zm5.53 8.2-1.85 8.72c-.14.62-.5.77-1.02.48l-2.82-2.08-1.36 1.31c-.15.15-.28.28-.57.28l.2-2.87 5.23-4.72c.23-.2-.05-.31-.35-.11l-6.46 4.07-2.78-.87c-.6-.19-.62-.6.13-.9l10.87-4.19c.5-.18.94.12.78.88z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 4H2a1 1 0 00-1 1v14a1 1 0 001 1h20a1 1 0 001-1V5a1 1 0 00-1-1zm-1.6 2L12 12.3 3.6 6zM3 18V7.3l8.4 6.3a1 1 0 001.2 0L21 7.3V18z"/></svg>',
  link:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a4 4 0 005.66 0l3.54-3.54a4 4 0 00-5.66-5.66l-1.77 1.77 1.42 1.42 1.77-1.77a2 2 0 012.83 2.83l-3.54 3.53a2 2 0 01-2.83 0zm2.8-2.8a4 4 0 00-5.66 0l-3.54 3.54a4 4 0 105.66 5.66l1.77-1.77-1.42-1.42-1.77 1.77a2 2 0 11-2.83-2.83l3.54-3.53a2 2 0 012.83 0z"/></svg>',
  share:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8a3 3 0 10-2.83-4H14L8.9 6.6a3 3 0 100 4.8L14 14h.17A3 3 0 1015 12.2L9.9 9.6a3 3 0 000-1.2L15 5.8A3 3 0 0017 8z"/></svg>'
};

export function share({ url, title, text = "", depth = 0, label = "Partager" }) {
  const u = encodeURIComponent(url), t = encodeURIComponent(title), tx = encodeURIComponent(text || title);
  const L = [
    ["x", `https://twitter.com/intent/tweet?text=${t}&url=${u}`, "X (Twitter)"],
    ["bsky", `https://bsky.app/intent/compose?text=${t}%20${u}`, "Bluesky"],
    ["masto", `https://mastodonshare.com/?text=${t}&url=${u}`, "Mastodon"],
    ["li", `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, "LinkedIn"],
    ["fb", `https://www.facebook.com/sharer/sharer.php?u=${u}`, "Facebook"],
    ["wa", `https://api.whatsapp.com/send?text=${t}%20${u}`, "WhatsApp"],
    ["tg", `https://t.me/share/url?url=${u}&text=${t}`, "Telegram"],
    ["mail", `mailto:?subject=${t}&body=${tx}%0A%0A${u}`, "E-mail"]
  ];
  return `<div class="share" role="group" aria-label="${attr(label)}">
  <span class="tiny mono dim" style="margin-right:.3rem">${esc(label)}</span>
  <button class="sb" data-share data-url="${attr(url)}" data-title="${attr(title)}" data-text="${attr(text)}" aria-label="Partager avec le menu du système">${SI.share}</button>
  ${L.map(([k, href, name]) => `<a class="sb" href="${href}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Partager sur ${name}" title="${name}">${SI[k]}</a>`).join("")}
  <button class="sb" data-act="copy" data-copy="${attr(url)}" aria-label="Copier le lien" title="Copier le lien">${SI.link}</button>
</div>`;
}

export function crumbs(items, depth = 0) {
  const R = rootOf(depth);
  return `<nav class="crumbs" aria-label="Fil d'Ariane">` + items.map((it, i) =>
    (i ? '<span aria-hidden="true">›</span>' : "") +
    (it.href !== undefined ? `<a href="${R}${it.href}">${esc(it.label)}</a>` : `<span aria-current="page" style="color:var(--fg-2)">${esc(it.label)}</span>`)
  ).join("") + `</nav>`;
}

export function footer(depth = 0) {
  const R = rootOf(depth);
  return `<footer class="ftr">
  <div class="wrap">
    <div class="grid g-3" style="align-items:start">
      <div>
        <a class="brand" href="${R}" style="margin-bottom:.9rem">${MARK()}<b>227</b></a>
        <p class="small" style="max-width:34ch">« La prochaine avancée n'est pas un 227ᵉ site. » En voici un quand même : il n'ajoute rien, il trie, il date et il contredit.</p>
        <p class="tiny" style="margin-top:1rem"><span class="badge-live">Corpus arrêté au 26 août 2026</span></p>
      </div>
      <nav aria-label="Pages du site"><h4>Le site</h4><ul>
        ${NAV.map(n => `<li><a href="${R}${n.href}">${esc(n.label)}</a> <span class="tiny dim">— ${esc(n.desc)}</span></li>`).join("")}
      </ul></nav>
      <div><h4>Données ouvertes</h4><ul>
        <li><a href="${R}data/roots.json">Catalogue des 226 racines (JSON)</a></li>
        <li><a href="${R}data/claims.json">Registre de claims (JSON)</a></li>
        <li><a href="${R}data/metrics.json">Métriques d'audit (JSON)</a></li>
        <li><a href="${R}data/archipel.csv">Tableur complet (CSV)</a></li>
        <li><a href="${R}feed.xml">Flux RSS</a></li>
        <li><a href="${R}sitemap.xml">Plan du site (XML)</a></li>
        <li><a href="${R}llms.txt">llms.txt</a></li>
      </ul>
      <h4 style="margin-top:1.6rem">L'archipel</h4><ul>
        <li><a href="https://yannkeep.github.io/nexus/" rel="noopener">NEXUS — atlas source</a></li>
        <li><a href="https://ouaisfieu.github.io/" rel="noopener">ouaisfieu.github.io</a></li>
        <li><a href="https://yannkeep.github.io/" rel="noopener">yannkeep.github.io</a></li>
        <li><a href="${SITE.usba}" rel="noopener"><b>11·60 bis — dl.ouaisfi.eu/usba</b></a></li>
      </ul></div>
    </div>
    <hr>
    <div class="grid g-2" style="gap:1rem">
      <p class="tiny">Écrit et construit par <b>${esc(SITE.author)}</b> à partir de deux rapports critiques et d'un contrôle direct des sources.
      Rattachement éditorial : <b>${esc(SITE.editorial)}</b>. Commanditaire anonyme.<br>
      ${esc(SITE.license)} — réutilisation libre avec attribution.</p>
      <p class="tiny" style="text-align:right">
        Zéro requête externe · zéro traceur · zéro cookie<br>
        <a href="${R}methode/#ia">Politique d'usage de l'IA</a> ·
        <a href="${R}methode/#correction">Signaler une erreur</a> ·
        <button class="btn btn-g" data-act="print" style="padding:.2rem .5rem;font-size:.72rem;margin-top:.4rem">Imprimer cette page</button>
      </p>
    </div>
  </div>
</footer>`;
}

export function page({ title, desc, path = "", depth = 0, active, jsonld = [], og, body, extraJs = "", type = "WebPage" }) {
  const R = rootOf(depth);
  return `<!doctype html>
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
${head({ title, desc, path, depth, jsonld, og, type })}
</head>
<body data-root="${R}">
${header(active, depth)}
<main id="main">
${body}
</main>
${footer(depth)}
${cmdk(depth)}
<script src="${R}assets/app.js" defer></script>${extraJs}
</body>
</html>`;
}
