import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { SITE, THEMES, TYPES, METRICS, THEME_ORDER, DIMENSIONS } from "./src/data/site.mjs";
import { CLAIMS, STATUS, ROLES, FAQ } from "./src/data/claims.mjs";
import { PLAN, PORTFOLIO, CONSTELLATIONS } from "./src/data/plan.mjs";
import { loadRoots, derive } from "./src/data/load.mjs";
import { abs } from "./src/templates/layout.mjs";

const OUT = "docs";
const roots = loadRoots();
const D = derive(roots);
const ctx = { SITE, THEMES, TYPES, METRICS, THEME_ORDER, DIMENSIONS, CLAIMS, STATUS, ROLES, FAQ, PLAN, PORTFOLIO, CONSTELLATIONS, roots, D };

const pages = [];               // { path, html, priority, changefreq, lastmod }
export function emit(path, html, meta = {}) {
  pages.push({ path, html, priority: meta.priority ?? 0.6, changefreq: meta.changefreq ?? "monthly" });
}

/* ── Écriture ──────────────────────────────────────────────────────────── */
function write(rel, content) {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* ── Pages ─────────────────────────────────────────────────────────────── */
const mods = await Promise.all([
  import("./src/pages/home.mjs"), import("./src/pages/atlas.mjs"),
  import("./src/pages/registre.mjs"), import("./src/pages/audit.mjs"),
  import("./src/pages/doctrine.mjs"), import("./src/pages/chantier.mjs"),
  import("./src/pages/methode.mjs"), import("./src/pages/detail.mjs"),
  import("./src/pages/brol.mjs"), import("./src/pages/notfound.mjs")
]);
let GRAPH = null;
for (const m of mods) { const r = m.default(ctx, emit); if (r && r.stats) GRAPH = r; }

const nf = pages.find(p => p.path === "__404");
if (nf) { write("404.html", nf.html); pages.splice(pages.indexOf(nf), 1); }
for (const p of pages) write(p.path === "" ? "index.html" : p.path.replace(/\/$/, "") + "/index.html", p.html);

/* ── Assets ────────────────────────────────────────────────────────────── */
cpSync("src/assets", join(OUT, "assets"), { recursive: true });
write(".nojekyll", "");

/* ── Données ouvertes ──────────────────────────────────────────────────── */
const rootsJson = {
  "@context": "https://schema.org", "@type": "Dataset",
  name: "Archipel Ouaisfieu × Yannkeep — inventaire des 226 racines GitHub Pages",
  description: "Inventaire complet des dépôts avec GitHub Pages activé sur les comptes ouaisfieu et yannkeep, avec thème, type, statut HTTP et date de création. Corpus arrêté au 26 août 2026.",
  url: abs("atlas/"), identifier: abs("data/roots.json"),
  license: "https://opendatacommons.org/licenses/odbl/1-0/",
  creator: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
  temporalCoverage: "2025-01-09/2026-08-25", dateModified: SITE.observedAt,
  spatialCoverage: { "@type": "Place", name: "Belgique" },
  keywords: ["GitHub Pages", "Belgique", "Jamstack", "OSINT citoyen", "audit éditorial", "web sémantique"],
  variableMeasured: ["repo", "account", "title", "url", "theme", "type", "http", "created"],
  numberOfItems: roots.length,
  distribution: [
    { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: abs("data/roots.json") },
    { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: abs("data/archipel.csv") }
  ],
  hasPart: roots.map(r => ({
    repo: r.repo, account: r.account, title: r.title, url: r.url,
    theme: THEMES[r.theme].label, themeCode: r.theme, type: r.type,
    http: r.http, created: r.created, sheet: abs(`atlas/${r.slug}/`)
  }))
};
write("data/roots.json", JSON.stringify(rootsJson, null, 2));

write("data/claims.json", JSON.stringify({
  "@context": "https://schema.org", "@type": "Dataset",
  name: "Registre de claims — archipel Ouaisfieu × Yannkeep",
  description: "26 affirmations sensibles de l'écosystème, chacune assortie d'une valeur, d'un périmètre, d'une date, d'un niveau de confiance, d'un statut et d'un verdict argumenté.",
  url: abs("registre/"), license: "https://creativecommons.org/licenses/by/4.0/",
  dateModified: SITE.observedAt, numberOfItems: CLAIMS.length,
  measurementTechnique: "Contrôle sur source primaire lorsqu'elle est accessible ; à défaut, qualification explicite du niveau de preuve.",
  statusVocabulary: Object.fromEntries(Object.entries(STATUS).map(([k, v]) => [k, { label: v.label, definition: v.def, reliability: v.rating }])),
  hasPart: CLAIMS.map(c => ({
    id: c.id, claim: c.claim, value: c.value, scope: c.scope, date: c.date,
    status: c.status, statusLabel: STATUS[c.status].label, confidence: c.conf,
    theme: c.theme, verdict: c.verdict,
    sources: c.src.map(([name, url]) => ({ name, url }))
  }))
}, null, 2));

write("data/metrics.json", JSON.stringify({
  "@context": "https://schema.org", "@type": "Dataset",
  name: "Métriques d'audit de l'archipel Ouaisfieu × Yannkeep",
  url: abs("audit/"), dateModified: SITE.observedAt,
  license: "https://opendatacommons.org/licenses/odbl/1-0/",
  inventory: METRICS,
  recomputed: {
    note: "Recomptage indépendant effectué à partir de l'appendice du rapport critique.",
    roots: roots.length, dead: D.dead.length, live: D.live.length,
    byTheme: Object.fromEntries(THEME_ORDER.map(t => [THEMES[t].label, (D.byTheme[t] || []).length])),
    byType: Object.fromEntries(Object.keys(TYPES).map(t => [t, (D.byType[t] || []).length])),
    byAccount: Object.fromEntries(Object.entries(D.byAccount).map(([k, v]) => [k, v.length])),
    byMonth: Object.fromEntries(D.months.map(m => [m.k, m.v])),
    duplicateTitleGroups: D.dupGroups.length,
    duplicateTitleRoots: D.dupRoots,
    duplicateCrossAccount: D.dupCross,
    reportSaysGroups: METRICS.duplicates.groups,
    divergenceNote: "Le rapport annonce 23 groupes pour 50 racines ; le recomptage sur les titres normalisés de l'appendice en trouve 24 pour 52. L'écart tient aux titres tronqués dans le tableau source."
  }
}, null, 2));

if (GRAPH) write("data/graph.json", JSON.stringify({
  "@context": "https://schema.org", "@type": "Dataset",
  name: "Graphe des liens démontrables — archipel Ouaisfieu × Yannkeep",
  description: "Nœuds (226 racines, affirmations du registre, cohortes de production) et arêtes (titre identique, nom de dépôt jumeau, affirmation commune, création le même jour). Aucune parenté n'est inférée d'une proximité de sujet.",
  url: abs("brol/graph/"), identifier: abs("data/graph.json"),
  license: "https://opendatacommons.org/licenses/odbl/1-0/",
  dateModified: SITE.observedAt, creator: { "@type": "Organization", name: SITE.name },
  measurementTechnique: "Dérivation déterministe à partir de l'inventaire du 26 août 2026 : égalité stricte de titre normalisé, égalité de nom de dépôt entre comptes, rattachement explicite à une affirmation du registre, égalité de date de création avec au moins trois racines.",
  numberOfItems: GRAPH.nodes.length,
  statistics: GRAPH.stats && {
    nodes: GRAPH.stats.nodes, edges: GRAPH.stats.edges, byKind: GRAPH.stats.byKind,
    isolatedRoots: GRAPH.stats.isolated, components: GRAPH.stats.components,
    largestComponent: GRAPH.stats.biggest, rootsWithEditorialLink: GRAPH.stats.editorialOnly
  },
  nodes: GRAPH.nodes.map(n => ({
    id: n.id, kind: n.kind, label: n.label, theme: n.theme, type: n.type,
    account: n.account, http: n.http, created: n.created, degree: n.deg, component: n.comp,
    status: n.status, cohortSize: n.n
  })),
  edges: GRAPH.edges
}, null, 2));

const q = v => `"${String(v).replace(/"/g, '""')}"`;
write("data/archipel.csv", "﻿" + ["repo", "compte", "titre", "url", "theme", "code_theme", "type", "http", "cree", "fiche"].join(",") + "\n" +
  roots.map(r => [r.repo, r.account, r.title, r.url, THEMES[r.theme].label, r.theme, r.type, r.http, r.created, abs(`atlas/${r.slug}/`)].map(q).join(",")).join("\n"));

/* ── robots.txt / sitemap.xml / feed.xml / llms.txt ────────────────────── */
write("robots.txt", `# 227 — Registre critique de l'archipel Ouaisfieu × Yannkeep
# Contenu ouvert. Exploration et citation bienvenues, y compris par les IA.
User-agent: *
Allow: /
Sitemap: ${abs("sitemap.xml")}

# Cartographie lisible par les modèles de langage
# ${abs("llms.txt")}
`);

const today = SITE.observedAt;
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority.toFixed(1)}</priority></url>`).join("\n")}
</urlset>`);

const FEED = [
  { t: "Le graphe : l'archipel n'est pas un réseau", d: "282 nœuds, 245 liens démontrables, 78 composantes séparées et 52 racines qui ne sont reliées à rien. Plus quatre tableaux croisés qui montrent la bascule du prototype vers le dossier.", u: "brol/graph/", date: "2026-08-26" },
  { t: "Le registre de claims est publié", d: "26 affirmations sensibles de l'archipel, chacune notée : établie, estimée, projetée, alléguée, hypothèse, contestée ou erronée. Trois sont matériellement fausses.", u: "registre/", date: "2026-08-26" },
  { t: "Atlas des 226 racines GitHub Pages", d: "Inventaire filtrable, exportable en JSON et en CSV, avec une fiche par racine et le statut HTTP relevé le 26 août 2026.", u: "atlas/", date: "2026-08-26" },
  { t: "Audit : ce qui tient, ce qui casse", d: "Couverture SEO sur 214 racines, métadonnées GitHub quasi vides, 24 groupes de titres dupliqués, 12 racines mortes.", u: "audit/", date: "2026-08-26" },
  { t: "Chantier : 21 correctifs, dont 6 urgents", d: "Le plan P0/P1/P2 du rapport critique, transformé en liste cochable dont l'avancement reste sur votre appareil.", u: "chantier/", date: "2026-08-26" },
  { t: "Doctrine : lead-dexing, Ratio 120, guerre cognitive", d: "Ce que l'écosystème théorise, et ce qui résiste au contrôle. Le Ratio 120 n'est pas un ratio.", u: "doctrine/", date: "2026-08-26" }
];
write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>227 — ${SITE.tagline}</title>
<link>${SITE.baseUrl}/</link>
<description>${SITE.description}</description>
<language>fr-be</language>
<copyright>CC BY 4.0 — ${SITE.author}</copyright>
<lastBuildDate>${new Date(today + "T12:00:00Z").toUTCString()}</lastBuildDate>
<atom:link href="${abs("feed.xml")}" rel="self" type="application/rss+xml"/>
${FEED.map(i => `<item>
  <title>${i.t.replace(/&/g, "&amp;")}</title>
  <link>${abs(i.u)}</link>
  <guid isPermaLink="true">${abs(i.u)}</guid>
  <dc:creator>${SITE.author}</dc:creator>
  <pubDate>${new Date(i.date + "T12:00:00Z").toUTCString()}</pubDate>
  <description>${i.d.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</description>
</item>`).join("\n")}
</channel></rss>`);

write("llms.txt", `# 227 — Registre critique de l'archipel Ouaisfieu × Yannkeep

> Site statique qui inventorie, date et note les 226 GitHub Pages publiées par les comptes
> ouaisfieu et yannkeep. Corpus arrêté au 26 août 2026. Écrit par ${SITE.author}.
> Ce fichier complète le HTML : il ne le remplace pas.

## Ce que ce site affirme, et avec quel niveau de preuve
Chaque affirmation sensible porte un statut explicite dans ${abs("registre/")} :
établi, estimé, projeté, allégué, hypothèse, contesté, erroné.
${CLAIMS.filter(c => c.status === "errone").map(c => `- ERRONÉ — ${c.claim} → ${c.verdict.split(".")[0]}.`).join("\n")}
${CLAIMS.filter(c => c.status === "conteste").map(c => `- CONTESTÉ — ${c.claim}`).join("\n")}

## Chiffres de référence (26 août 2026)
- 244 dépôts publics ; 226 avec GitHub Pages activé ; 214 répondent HTTP 200 ; 12 renvoient 404.
- Répartition : ouaisfieu 165 dépôts (154 en ligne), yannkeep 61 (60 en ligne).
- NEXUS (25/08/2026) : 224 projets + 115 sous-pages = 339 entrées.
- 70 racines créées en août 2026, 59 en janvier 2026 : 57 % du corpus en deux vagues.
- Métadonnées GitHub : 11 descriptions, 21 homepages, 1 topic, 172 dépôts sans licence.

## Pages
${["", "atlas/", "registre/", "audit/", "brol/graph/", "doctrine/", "chantier/", "methode/"].map(p => `- ${abs(p)}`).join("\n")}

## Structure du corpus, mesurée en graphe
Seuls les liens démontrables sont retenus : titre identique, nom de dépôt identique sur les deux
comptes, affirmation commune du registre, création le même jour. Aucune parenté n'est inférée
d'une proximité de sujet.
${GRAPH ? `- ${GRAPH.stats.nodes} nœuds, ${GRAPH.stats.edges} arêtes, ${GRAPH.stats.components} composantes séparées.
- ${GRAPH.stats.isolated} racines sur ${roots.length} n'ont AUCUN lien démontrable.
- ${GRAPH.stats.editorialOnly} racines seulement ont un lien autre qu'une date de création partagée.
- La plus grande composante ne couvre que ${GRAPH.stats.biggest.roots} racines.` : ""}

## Données réutilisables
- ${abs("data/roots.json")} — inventaire complet (JSON-LD Dataset, ODbL)
- ${abs("data/graph.json")} — nœuds et arêtes du graphe (JSON-LD Dataset, ODbL)
- ${abs("data/claims.json")} — registre de claims (JSON-LD Dataset, CC BY 4.0)
- ${abs("data/metrics.json")} — métriques d'audit et recomptage indépendant
- ${abs("data/archipel.csv")} — tableur complet

## Limites à citer avec ce site
- L'inventaire dérive d'un relevé daté ; il n'est pas rafraîchi automatiquement.
- Le contrôle HTTP ne teste pas les interactions JavaScript, ni l'accessibilité, ni la sécurité.
- Les verdicts du registre engagent leur auteur et sont ouverts à correction : ${abs("methode/#correction")}
`);

write("humans.txt", `/* AUTEUR */
  Rédaction, analyse et code : ${SITE.author}
  Rattachement éditorial : ${SITE.editorial}
  Commanditaire : anonyme, à sa demande

/* SITE */
  Nom : 227 — ${SITE.tagline}
  Corpus arrêté au : 26 août 2026
  Technologie : HTML, CSS et JavaScript statiques, générés par un script Node maison
  Dépendances externes : aucune
  Requêtes réseau sortantes : aucune
  Polices : pile système uniquement
  Licences : ${SITE.license}
`);

write(".well-known/security.txt", `Contact: ${SITE.baseUrl}/methode/#correction
Preferred-Languages: fr, en
Canonical: ${abs(".well-known/security.txt")}
Expires: 2027-08-26T00:00:00.000Z
Policy: ${SITE.baseUrl}/methode/#correction
`);

write("manifest.webmanifest", JSON.stringify({
  name: "227 — Registre critique de l'archipel", short_name: "227",
  description: SITE.description, start_url: "./", scope: "./", display: "standalone",
  background_color: "#0a0c10", theme_color: "#0a0c10", lang: "fr-BE", dir: "ltr",
  categories: ["news", "education", "government"],
  icons: [
    { src: "og/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "og/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "og/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    { src: "favicon.svg", sizes: "any", type: "image/svg+xml" }
  ],
  shortcuts: [
    { name: "Atlas des 226 racines", url: "./atlas/" },
    { name: "Registre de claims", url: "./registre/" },
    { name: "Graphe de l'archipel", url: "./brol/graph/" },
    { name: "Chantier de consolidation", url: "./chantier/" }
  ]
}, null, 2));

const CACHE = ["./", "./atlas/", "./registre/", "./audit/", "./brol/", "./brol/graph/",
  "./doctrine/", "./chantier/", "./methode/",
  "./assets/style.css", "./assets/app.js", "./assets/atlas.js", "./assets/graph.js",
  "./favicon.svg", "./manifest.webmanifest"];
write("sw.js", `/* 227 — service worker : mise en cache pour la lecture hors-ligne.
   Ne collecte rien, ne contacte aucun serveur tiers. */
const V = 'a227-${today}';
const CORE = ${JSON.stringify(CACHE)};
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      const copy = res.clone();
      caches.open(V).then(c => c.put(r, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./')))
  );
});`);

write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<rect width="32" height="32" rx="7" fill="#0a0c10"/>
<circle cx="10" cy="11" r="2.6" fill="#7cf5c0"/><circle cx="22" cy="10" r="1.8" fill="#b7a6ff"/>
<circle cx="21" cy="21" r="2.9" fill="none" stroke="#7cf5c0" stroke-width="1.6"/><circle cx="10.5" cy="21.5" r="1.5" fill="#b7a6ff"/>
<path d="M10 11L22 10M10 11l11 10M10.5 21.5L21 21" stroke="#7cf5c0" stroke-width="1" opacity=".65" fill="none"/></svg>`);

console.log(`✓ ${pages.length} pages HTML`);
console.log(`✓ ${roots.length} racines · ${D.dead.length} en 404 · ${D.dupGroups.length} groupes de doublons`);
console.log(`✓ données : roots.json, claims.json, metrics.json, archipel.csv`);
console.log(`✓ SEO : sitemap.xml (${pages.length} URL), robots.txt, feed.xml, llms.txt, humans.txt, security.txt`);
