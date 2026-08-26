import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";
import { barsH, tableOf, figure } from "../templates/viz.mjs";

const DEAD = {
  title: "Cette racine ne répond pas",
  text: "GitHub signale « Pages activé » pour ce dépôt, mais la racine renvoie une erreur 404 au relevé du 26 août 2026. Une racine morte reste indexable comme telle : elle consomme du budget d'exploration et affiche une erreur à qui suit un lien. Deux issues, l'une comme l'autre acceptables — réparer la publication, ou désactiver Pages sur le dépôt."
};

export default function detail(c, emit) {
  const { SITE, THEMES, TYPES, roots, D, PORTFOLIO, CLAIMS } = c;
  const portfolioUrls = new Set(PORTFOLIO.map(p => p.url.replace(/\/$/, "")));
  const sortedByDate = [...roots].sort((a, b) => b.created.localeCompare(a.created));
  const dupIndex = new Map();
  for (const g of D.dupGroups) for (const r of g.repos) dupIndex.set(r, g);

  /* ── Une fiche par racine ────────────────────────────────────────────── */
  for (const r of roots) {
    const th = THEMES[r.theme], ty = TYPES[r.type];
    const path = `atlas/${r.slug}/`, url = abs(path);
    const dup = dupIndex.get(r.repo);
    const inPortfolio = portfolioUrls.has(r.url.replace(/\/$/, ""));
    const dead = r.http === 404;
    const siblings = (D.byTheme[r.theme] || []).filter(x => x.repo !== r.repo && x.http === 200)
      .sort((a, b) => b.created.localeCompare(a.created)).slice(0, 6);
    const related = CLAIMS.filter(cl => (cl.repos || []).includes(r.repo) ||
      cl.src.some(([, u]) => u && u.replace(/\/$/, "") === r.url.replace(/\/$/, "")));
    const pf = PORTFOLIO.find(p => p.url.replace(/\/$/, "") === r.url.replace(/\/$/, ""));
    const rank = sortedByDate.indexOf(r) + 1;
    const ageDays = Math.round((Date.UTC(2026, 7, 26) - Date.parse(r.created + "T00:00:00Z")) / 86400000);

    const jsonld = [
      { "@context": "https://schema.org", "@type": dead ? "WebPage" : "WebSite",
        name: r.title, url: r.url, inLanguage: "fr-BE",
        description: `${ty.label} du thème « ${th.label} », publié depuis le dépôt ${r.repo} et créé le ${r.created}. Statut HTTP relevé le 26 août 2026 : ${r.http}.`,
        isAccessibleForFree: true,
        creativeWorkStatus: dead ? "Indisponible" : "Publié",
        dateCreated: r.created,
        codeRepository: `https://github.com/${r.repo}`,
        publisher: { "@type": "Organization", name: SITE.editorial }
      },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
        { "@type": "ListItem", position: 2, name: "Atlas", item: abs("atlas/") },
        { "@type": "ListItem", position: 3, name: r.title, item: url }
      ] }
    ];

    const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Atlas", href: "atlas/" }, { label: r.title }], 2)}</div>

<article class="wrap" style="padding-bottom:var(--sp-8)">
  <div class="split-r split">
    <div>
      <div class="chips">
        <span class="chip" style="color:${th.color}"><span class="dot"></span>${esc(th.label)}</span>
        <span class="chip">${ty.icon} ${esc(ty.label)}</span>
        <span class="stat-chip ${dead ? "st-critical" : "st-good"}">${dead ? "✕ HTTP 404" : "✔ HTTP 200"}</span>
        ${inPortfolio ? `<span class="stat-chip st-good">★ Portefeuille recommandé</span>` : ""}
        ${dup ? `<span class="stat-chip st-warn">⧉ Titre partagé avec ${dup.n - 1} autre${dup.n > 2 ? "s" : ""}</span>` : ""}
      </div>
      <h1 style="margin-top:1.2rem;font-size:var(--step-3)">${esc(r.title)}</h1>
      <p class="mono small" style="margin-top:.8rem;word-break:break-all">
        <a href="${r.url}" rel="noopener nofollow" target="_blank">${esc(r.url)}</a>
      </p>

      ${dead ? `<div class="note bad" style="margin-top:1.5rem"><b>${DEAD.title}.</b> ${DEAD.text}</div>` : ""}

      ${dup ? `<div class="note" style="margin-top:1.5rem">
        <b>Ce titre n'est pas unique.</b> ${dup.n} racines de l'archipel s'intitulent « ${esc(dup.title)} »${dup.cross ? ", à cheval sur les deux comptes" : ""} :
        ${dup.repos.map(x => `<code>${esc(x)}</code>`).join(" · ")}.
        Un titre identique ne prouve pas un contenu identique, mais il suffit à créer de l'ambiguïté :
        moteurs et lecteurs doivent deviner quelle version fait autorité, les signaux de liens se répartissent,
        et une ancienne copie peut apparaître avant la bonne.
        <a href="../../audit/#doublons">Voir les ${D.dupGroups.length} groupes →</a></div>` : ""}

      <div class="prose" style="margin-top:2rem">
        <h2 id="lecture">Comment lire cette racine</h2>
        <p>${esc(th.note)}</p>
        <p><b>${esc(ty.label)}</b> — ${esc(ty.note)}</p>
        <p>Créée le <b>${r.created}</b>, soit ${ageDays} jours avant l'arrêt du corpus.
        ${r.created.slice(0, 7) === "2026-08" ? "Elle appartient à la vague d'août 2026, qui a produit 70 racines en un mois — le rythme même qui rend une relecture éditoriale uniforme impossible sans pipeline explicite." :
          r.created.slice(0, 7) === "2026-01" ? "Elle appartient à la vague de janvier 2026, la seconde des deux poussées qui totalisent 57 % du corpus." :
          "Elle est antérieure aux deux grandes vagues de janvier et août 2026."}</p>
        <p>Dans l'ordre chronologique du corpus, c'est la <b>${rank}<sup>e</sup></b> racine la plus récente sur ${roots.length}, et l'une des <b>${(D.byTheme[r.theme] || []).length}</b> du thème « ${esc(th.label)} » — soit ${(((D.byTheme[r.theme] || []).length / roots.length) * 100).toFixed(1)} % de l'archipel.</p>
        ${r.isRootRepo ? `<p>Ce dépôt porte la racine du compte : c'est l'adresse la plus courte et la plus citable de <code>${esc(r.account)}</code>. À ce titre, c'est aussi celle qui devrait porter la carte d'exploration de tout le reste.</p>` : ""}
      </div>

      ${pf ? `<div class="note ok" style="margin-top:2rem">
        <b>★ Portefeuille recommandé — ${esc(pf.role)}.</b> ${esc(pf.why)}
        <br><span class="tiny dim">Le rapport critique retient douze vitrines actives. Celle-ci en fait partie : elle devrait être maintenue, datée et citée, pendant que les projets voisins sont rattachés, marqués « laboratoire » ou archivés.</span></div>` : ""}

      ${related.length ? `<div style="margin-top:2.5rem">
        <h2 id="claims">Affirmations rattachées à cette racine</h2>
        <div class="stack" style="margin-top:1.2rem">
        ${related.map(cl => `<a class="card" href="../../registre/#${cl.id}">
          <span class="stat-chip ${c.ROLES[c.STATUS[cl.status].role].cls}">${c.STATUS[cl.status].glyph} ${c.STATUS[cl.status].label}</span>
          <p class="card-t" style="font-size:var(--step-0);margin-top:.7rem">« ${esc(cl.claim)} »</p>
          <p class="tiny dim" style="margin-top:.6rem;line-height:1.55">${esc(cl.verdict.split(". ").slice(0, 2).join(". ").replace(/\.*$/, ""))}.</p></a>`).join("")}
        </div></div>` : ""}

      <div style="margin-top:2.5rem">
        ${share({ url, title: r.title + " — fiche 227", text: `${ty.label} · ${th.label} · HTTP ${r.http} · créé le ${r.created}` })}
      </div>
    </div>

    <aside class="stack">
      <div class="panel">
        <p class="kicker">Fiche technique</p>
        <dl style="margin-top:1rem;display:grid;grid-template-columns:auto 1fr;gap:.5rem .9rem;font-size:var(--step--1)">
          <dt class="dim">Dépôt</dt><dd class="mono" style="word-break:break-all">${esc(r.repo)}</dd>
          <dt class="dim">Compte</dt><dd class="mono">${esc(r.account)}</dd>
          <dt class="dim">Thème</dt><dd>${esc(th.label)}</dd>
          <dt class="dim">Type</dt><dd>${esc(ty.label)}</dd>
          <dt class="dim">HTTP</dt><dd class="mono" style="color:${dead ? "var(--st-critical)" : "var(--st-good)"}">${r.http}</dd>
          <dt class="dim">Créé le</dt><dd class="mono">${r.created}</dd>
          <dt class="dim">Relevé</dt><dd class="mono">${SITE.observedAt}</dd>
        </dl>
        <div class="chips" style="margin-top:1.2rem">
          <a class="btn btn-g" href="https://github.com/${r.repo}" rel="noopener nofollow" target="_blank" style="padding:.35rem .7rem;font-size:.78rem">Dépôt GitHub ↗</a>
          ${!dead ? `<a class="btn btn-g" href="${r.url}" rel="noopener nofollow" target="_blank" style="padding:.35rem .7rem;font-size:.78rem">Ouvrir la page ↗</a>` : ""}
        </div>
      </div>
      ${siblings.length ? `<div class="panel">
        <p class="kicker">Voisines du même thème</p>
        <ul style="list-style:none;padding:0;margin-top:1rem;display:grid;gap:.6rem;font-size:var(--step--1)">
        ${siblings.map(s => `<li><a href="../${s.slug}/" style="text-decoration:none">${esc(s.title)}</a><br><span class="tiny mono dim">${esc(s.repo)}</span></li>`).join("")}
        </ul>
        <p style="margin-top:1rem"><a class="tiny mono" href="../?theme=${r.theme}">Les ${(D.byTheme[r.theme] || []).length} racines de ce thème →</a></p>
      </div>` : ""}
    </aside>
  </div>
</article>`;

    emit(path, page({
      title: r.title,
      desc: `${r.title} — ${TYPES[r.type].label} du thème « ${THEMES[r.theme].label} », publié par ${r.account} depuis le dépôt ${r.repo}. Statut HTTP ${r.http} au 26 août 2026.`,
      path, depth: 2, active: "atlas", jsonld, og: "og-atlas.png", body, type: "Article"
    }), { priority: dead ? 0.3 : 0.5, changefreq: "yearly" });
  }

  /* ── Une page par thème ──────────────────────────────────────────────── */
  for (const [code, th] of Object.entries(THEMES)) {
    const list = (D.byTheme[code] || []).sort((a, b) => b.created.localeCompare(a.created));
    const path = `theme/${th.slug}/`, url = abs(path);
    const dead = list.filter(x => x.http === 404);
    const typeRows = Object.entries(TYPES).map(([k, v]) => ({ k: v.label, v: list.filter(x => x.type === k).length }))
      .filter(x => x.v > 0).sort((a, b) => b.v - a.v);

    const jsonld = [
      { "@context": "https://schema.org", "@type": "CollectionPage", name: `${th.label} — ${list.length} racines`, url,
        inLanguage: "fr-BE", isPartOf: { "@id": abs("") + "#website" },
        description: `Les ${list.length} publications GitHub Pages du thème « ${th.label} » dans l'archipel Ouaisfieu × Yannkeep.`,
        mainEntity: { "@type": "ItemList", numberOfItems: list.length,
          itemListElement: list.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.title, url: abs(`atlas/${r.slug}/`) })) } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
        { "@type": "ListItem", position: 2, name: "Atlas", item: abs("atlas/") },
        { "@type": "ListItem", position: 3, name: th.label, item: url } ] }
    ];

    const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Atlas", href: "atlas/" }, { label: th.label }], 2)}</div>
<section class="wrap" style="padding-bottom:var(--sp-7)">
  <span class="chip" style="color:${th.color}"><span class="dot"></span>${esc(th.short)}</span>
  <h1 style="margin-top:1rem;font-size:var(--step-3)">${esc(th.label)}</h1>
  <p class="lede" style="margin-top:1rem">${esc(th.note)}</p>
  <div class="chips" style="margin-top:1.5rem">
    <span class="chip">${list.length} racines</span>
    <span class="stat-chip st-good">✔ ${list.length - dead.length} en ligne</span>
    ${dead.length ? `<span class="stat-chip st-critical">✕ ${dead.length} en 404</span>` : ""}
    <span class="chip">${((list.length / roots.length) * 100).toFixed(1)} % du corpus</span>
  </div>
  <div class="grid g-2" style="margin-top:2.5rem;align-items:start">
    ${figure({ title: "Répartition par type", sub: `Ce que ce thème produit réellement.`,
      chart: barsH({ rows: typeRows }),
      table: tableOf(["Type", "Racines"], typeRows.map(t => [esc(t.k), t.v])) })}
    <div class="panel">
      <p class="kicker">Les ${list.length} racines</p>
      <div class="tw" style="border:0;margin-top:1rem;max-height:34rem;overflow:auto">
        <table><thead><tr><th scope="col">Publication</th><th scope="col" class="n">HTTP</th><th scope="col" class="n">Créé</th></tr></thead><tbody>
        ${list.map(r => `<tr${r.http === 404 ? ' class="dead"' : ""}><td><a href="../../atlas/${r.slug}/">${esc(r.title)}</a><br><span class="tiny mono">${esc(r.repo)}</span></td><td class="n">${r.http}</td><td class="n tiny">${r.created}</td></tr>`).join("")}
        </tbody></table>
      </div>
    </div>
  </div>
  <div style="margin-top:2.5rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center">
    <a class="btn" href="../../atlas/?theme=${code}">Filtrer l'atlas sur ce thème</a>
    ${share({ url, title: `${th.label} — ${list.length} racines de l'archipel`, text: th.note })}
  </div>
</section>`;

    emit(path, page({
      title: th.label,
      desc: `Les ${list.length} publications GitHub Pages du thème « ${th.label} » dans l'archipel Ouaisfieu × Yannkeep, avec statut HTTP et date de création.`,
      path, depth: 2, active: "atlas", jsonld, og: "og-atlas.png", body
    }), { priority: 0.6, changefreq: "monthly" });
  }
}
