import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";

export default function atlas(c, emit) {
  const { SITE, THEMES, TYPES, THEME_ORDER, roots, D } = c;
  const url = abs("atlas/");

  const months = [...D.months].filter(m => m.v).reverse();

  const payload = {
    root: "../",
    themes: Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [k, { label: v.label, short: v.short, color: v.color }])),
    types: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, { label: v.label }])),
    roots: roots.map(r => ({ repo: r.repo, account: r.account, title: r.title, url: r.url, theme: r.theme, type: r.type, http: r.http, created: r.created, slug: r.slug }))
  };

  const jsonld = [
    { "@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#page",
      name: "Atlas des 226 racines GitHub Pages", url, inLanguage: "fr-BE",
      description: "Inventaire filtrable des 226 dépôts avec GitHub Pages activé sur les comptes ouaisfieu et yannkeep, avec thème, type, statut HTTP et date de création.",
      isPartOf: { "@id": abs("") + "#website" },
      mainEntity: { "@type": "Dataset", name: "Inventaire des 226 racines", url: abs("data/roots.json"),
        license: "https://opendatacommons.org/licenses/odbl/1-0/",
        distribution: [
          { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: abs("data/roots.json") },
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: abs("data/archipel.csv") }
        ] }
    },
    { "@context": "https://schema.org", "@type": "ItemList", name: "Les 226 racines de l'archipel",
      numberOfItems: roots.length, itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: roots.slice(0, 60).map((r, i) => ({
        "@type": "ListItem", position: i + 1, url: abs(`atlas/${r.slug}/`), name: r.title
      }))
    },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
      { "@type": "ListItem", position: 2, name: "Atlas", item: url }
    ] }
  ];

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Atlas des 226 racines" }], 1)}</div>

<section class="wrap" style="padding-bottom:var(--sp-6)">
  <p class="eyebrow">Inventaire · 26 août 2026</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3)">Atlas des 226 racines</h1>
  <p class="lede" style="margin-top:1rem">
    Toutes les publications GitHub Pages des comptes <b>ouaisfieu</b> et <b>yannkeep</b>, avec leur thème,
    leur type, leur statut HTTP et leur date de création. Chaque combinaison de filtres est un permalien&nbsp;:
    l'URL suit ce que vous affichez.
  </p>
  <div class="chips" style="margin-top:1.5rem">
    <span class="stat-chip st-good">✔ ${D.live.length} en ligne</span>
    <span class="stat-chip st-critical">✕ ${D.dead.length} en 404</span>
    <span class="chip">${D.dupGroups.length} groupes de titres dupliqués</span>
    <span class="chip">${THEME_ORDER.length} thèmes · ${Object.keys(TYPES).length} types</span>
  </div>
</section>

<div class="filters">
  <div class="wrap">
    <div class="fbar">
      <label class="search">
        <span class="tiny" style="position:absolute;left:-9999px">Rechercher une racine</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L21 21"/></svg>
        <input type="search" id="q" placeholder="Rechercher un titre, un dépôt, un thème…  ( / )" autocomplete="off" spellcheck="false">
      </label>
      <select class="sel" id="f-theme" aria-label="Filtrer par thème">
        <option value="">Tous les thèmes</option>
        ${THEME_ORDER.map(t => `<option value="${t}">${esc(THEMES[t].label)} (${(D.byTheme[t] || []).length})</option>`).join("")}
      </select>
      <select class="sel" id="f-type" aria-label="Filtrer par type">
        <option value="">Tous les types</option>
        ${Object.entries(TYPES).map(([k, v]) => `<option value="${k}">${esc(v.label)} (${(D.byType[k] || []).length})</option>`).join("")}
      </select>
      <select class="sel" id="f-account" aria-label="Filtrer par compte">
        <option value="">Les deux comptes</option>
        <option value="ouaisfieu">ouaisfieu (165)</option>
        <option value="yannkeep">yannkeep (61)</option>
      </select>
      <select class="sel" id="f-status" aria-label="Filtrer par statut HTTP">
        <option value="">Tous les statuts</option>
        <option value="ok">En ligne — HTTP 200 (214)</option>
        <option value="ko">Mortes — HTTP 404 (12)</option>
      </select>
      <select class="sel" id="f-period" aria-label="Filtrer par mois de création">
        <option value="">Toutes les périodes</option>
        ${months.map(m => `<option value="${m.k}">${esc(m.label)} (${m.v})</option>`).join("")}
      </select>
      <select class="sel" id="f-sort" aria-label="Trier">
        <option value="date-desc">Plus récentes d'abord</option>
        <option value="date-asc">Plus anciennes d'abord</option>
        <option value="title-asc">Titre (A→Z)</option>
        <option value="repo-asc">Dépôt (A→Z)</option>
        <option value="theme-asc">Thème</option>
        <option value="status-asc">Statut HTTP</option>
      </select>
      <button class="btn btn-g" id="f-favonly" aria-pressed="false" style="padding:.55rem .8rem">★ Favoris</button>
      <div class="toggle" role="group" aria-label="Mode d'affichage">
        <button data-view="grid" aria-pressed="true">Grille</button>
        <button data-view="table" aria-pressed="false">Tableau</button>
      </div>
      <button class="btn btn-g" id="reset" style="padding:.55rem .8rem">Réinitialiser</button>
      <span class="count" id="atlas-count" role="status" aria-live="polite">226 racines</span>
    </div>
  </div>
</div>

<section class="wrap" style="padding-block:var(--sp-5) var(--sp-7)">
  <noscript><div class="note" style="margin-bottom:1.5rem"><b>JavaScript est désactivé.</b>
    Les filtres, la recherche et l'export sont inactifs, mais l'inventaire complet reste lisible ci-dessous,
    et chaque racine dispose d'une fiche HTML statique.</div>
    <div class="tw"><table><caption class="tiny dim" style="text-align:left;padding:.6rem .8rem">Les 226 racines, sans JavaScript</caption>
    <thead><tr><th scope="col">Publication</th><th scope="col">Thème</th><th scope="col" class="n">HTTP</th><th scope="col" class="n">Créé</th></tr></thead><tbody>
    ${roots.map(r => `<tr><td><a href="${r.slug}/">${esc(r.title)}</a><br><span class="tiny mono">${esc(r.repo)}</span></td><td>${esc(THEMES[r.theme].short)}</td><td class="n">${r.http}</td><td class="n">${r.created}</td></tr>`).join("")}
    </tbody></table></div>
  </noscript>
  <div id="atlas-out"></div>
</section>

<section class="wrap" style="padding-bottom:var(--sp-8)">
  <div class="panel">
    <div class="grid g-2" style="align-items:center">
      <div>
        <p class="kicker">Données ouvertes</p>
        <h3 style="margin-top:.6rem;font-size:var(--step-1)">Exportez ce que vous voyez</h3>
        <p class="small" style="margin-top:.8rem">
          Les boutons exportent le <b>sous-ensemble filtré</b>, pas seulement le catalogue entier.
          Le JSON est un <code>Dataset</code> schema.org valide, prêt à être republié.
          Licence ODbL — attribution demandée, réutilisation commerciale comprise.
        </p>
      </div>
      <div class="chips" style="justify-content:flex-end">
        <button class="btn" id="exp-csv">Exporter en CSV</button>
        <button class="btn" id="exp-json">Exporter en JSON-LD</button>
        <a class="btn btn-g" href="../data/roots.json">Catalogue complet</a>
      </div>
    </div>
  </div>
  <div style="margin-top:2rem">
    ${share({ url, title: "Atlas des 226 racines de l'archipel Ouaisfieu × Yannkeep", text: "226 GitHub Pages inventoriées, filtrables et exportables. 12 sont mortes." })}
  </div>
</section>

<script type="application/json" id="roots-data">${JSON.stringify(payload).replace(/</g, "\\u003c")}</script>`;

  emit("atlas", page({
    title: "Atlas des 226 racines",
    desc: "Inventaire filtrable des 226 GitHub Pages de l'archipel Ouaisfieu × Yannkeep : thème, type, statut HTTP, date de création. Export CSV et JSON-LD, une fiche par racine.",
    path: "atlas/", depth: 1, active: "atlas", jsonld, og: "og-atlas.png", body,
    extraJs: `\n<script src="../assets/atlas.js" defer></script>`
  }), { priority: 0.9, changefreq: "weekly" });
}
