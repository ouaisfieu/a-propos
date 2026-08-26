import { page, esc, abs, share } from "../templates/layout.mjs";
import { figure, barsH, funnel, columns, tableOf, stack, fr } from "../templates/viz.mjs";

export default function home(c, emit) {
  const { SITE, THEMES, METRICS: M, THEME_ORDER, CLAIMS, STATUS, ROLES, FAQ, PORTFOLIO, roots, D } = c;
  const url = abs("");
  const errone = CLAIMS.filter(x => x.status === "errone");
  const conteste = CLAIMS.filter(x => x.status === "conteste");

  const jsonld = [
    { "@context": "https://schema.org", "@type": "WebSite", "@id": url + "#website",
      name: `${SITE.name} — ${SITE.tagline}`, alternateName: "227", url, inLanguage: "fr-BE",
      description: SITE.description,
      publisher: { "@id": url + "#org" },
      potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: abs("atlas/") + "?q={search_term_string}" }, "query-input": "required name=search_term_string" }
    },
    { "@context": "https://schema.org", "@type": "Organization", "@id": url + "#org",
      name: SITE.editorial, alternateName: "CCPLC", url: "https://ouaisfieu.github.io/tech/ccplc/",
      areaServed: { "@type": "Country", name: "Belgique" },
      sameAs: ["https://ouaisfieu.github.io/", "https://yannkeep.github.io/", SITE.usba]
    },
    { "@context": "https://schema.org", "@type": "Report", "@id": url + "#report",
      headline: "Archipel Ouaisfieu × Yannkeep : inventaire, audit et registre critique",
      abstract: "226 dépôts GitHub Pages inventoriés, 214 en ligne, 26 affirmations sensibles notées une à une, 21 correctifs priorisés.",
      inLanguage: "fr-BE", datePublished: SITE.observedAt, dateModified: SITE.observedAt,
      author: { "@type": "Person", name: SITE.author }, publisher: { "@id": url + "#org" },
      license: "https://creativecommons.org/licenses/by/4.0/",
      about: [
        { "@type": "Thing", name: "GitHub Pages" }, { "@type": "Thing", name: "Politique belge" },
        { "@type": "Thing", name: "Web sémantique" }, { "@type": "Thing", name: "Éducation permanente" }
      ],
      isBasedOn: { "@type": "Dataset", name: "Inventaire des 226 racines", url: abs("data/roots.json") }
    },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    }
  ];

  const themeRows = THEME_ORDER.map(t => ({ k: THEMES[t].label, v: (D.byTheme[t] || []).length, note: THEMES[t].note }));
  themeRows.sort((a, b) => b.v - a.v);

  const statusParts = Object.entries(STATUS)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([k, s]) => ({ k: s.label, glyph: s.glyph, v: CLAIMS.filter(x => x.status === k).length, color: ROLES[s.role].color }));

  const body = `
<section class="hero">
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <p class="eyebrow">Belgique · GitHub Pages · corpus arrêté au 26 août 2026</p>
    <h1 style="margin-top:1.2rem">
      <span class="strike">La prochaine avancée n'est pas un 227ᵉ site.</span><br>
      <span class="fx">En voici un quand même.</span>
    </h1>
    <p class="lede" style="margin-top:1.6rem">
      L'archipel Ouaisfieu × Yannkeep publie <b>226 sites statiques</b> sur la politique belge, les droits sociaux
      et la justice. Douze sont morts, cinquante-deux portent le titre d'un autre, et trois affirmations
      sont matériellement fausses. Ce site n'ajoute pas un 227ᵉ contenu&nbsp;:
      il <b>trie</b>, il <b>date</b>, il <b>source</b> et il <b>contredit</b>.
    </p>
    <div class="chips" style="margin-top:2rem;gap:.6rem">
      <a class="btn btn-p" href="atlas/">Explorer les 226 racines
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a class="btn" href="registre/">Lire le registre de claims</a>
      <a class="btn btn-g" href="chantier/">Le chantier en 21 correctifs</a>
      <button class="btn btn-g" data-act="cmd">Rechercher <kbd>Ctrl</kbd><kbd>K</kbd></button>
    </div>
    <div class="grid g-4" style="margin-top:3.5rem;gap:1.4rem 2rem">
      ${[["226", "dépôts avec Pages activé", "sur 244 dépôts publics", true],
         ["214", "racines réellement en ligne", "12 renvoient une erreur 404"],
         ["341", "entrées catalogables", "mais certainement pas 341 œuvres"],
         ["26", "affirmations passées au crible", "dont 3 erronées et 3 contestées"]]
        .map(([n, k, d, on]) => `<div class="stat${on ? " on" : ""}">
          <span class="stat-n" data-count="${n}">${n}</span>
          <span class="stat-k">${k}</span><span class="stat-d">${d}</span></div>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§1 — L'écart entre ce qui existe et ce qui fonctionne</p>
    <h2 style="margin-top:1rem;max-width:22ch">Trois nombres différents décrivent le même archipel</h2>
    <div class="grid g-2" style="margin-top:2.5rem;align-items:start">
      ${figure({
        id: "entonnoir",
        title: "De 244 dépôts à 214 pages vivantes",
        sub: "« Pages activé » n'est pas « page en ligne ». L'écart n'est pas une nuance de comptage : ce sont trente portes qui ne s'ouvrent pas.",
        chart: funnel([
          { k: "Dépôts publics sur les deux comptes", v: 244 },
          { k: "GitHub Pages activé", v: 226, why: "dépôts sans publication" },
          { k: "Racines répondant HTTP 200", v: 214, why: "racines en erreur 404, indexables telles quelles" }
        ]),
        table: tableOf(["Palier", "Racines", "Perte"], [
          ["Dépôts publics", "244", "—"], ["Pages activé", "226", "−18"], ["HTTP 200", "214", "−12"]
        ]),
        caption: `Relevé du 26 août 2026. Les douze racines mortes sont nommées et corrigeables en une session : <a href="atlas/?status=ko">voir la liste</a>.`
      })}
      <div class="stack-lg">
        <div class="panel rule-top">
          <p class="kicker">Le partage entre les deux comptes</p>
          <div style="margin-top:1.2rem">
            ${barsH({ rows: [
              { k: "ouaisfieu — en ligne", v: 154, of: 165 },
              { k: "ouaisfieu — en 404", v: 11, of: 165 },
              { k: "yannkeep — en ligne", v: 60, of: 61 },
              { k: "yannkeep — en 404", v: 1, of: 61 }
            ], max: 165 })}
          </div>
          <p class="small" style="margin-top:1.2rem">
            L'écosystème présente <b>yannkeep</b> comme un « fantôme numérique », choix délibéré d'OPSEC.
            Ses 61 dépôts sont pourtant publics, listés par l'API et catalogués par NEXUS.
            Ce n'est pas de la furtivité : c'est un déficit d'indexation.
            <a href="registre/#doc-yannkeep">Le verdict complet →</a>
          </p>
        </div>
        <div class="note">
          <b>Ce que « 341 publications » veut dire.</b> Le nombre est exact comme total d'entrées catalogables
          (226 racines + 115 sous-pages). Il est trompeur comme nombre d'œuvres : une racine de projet,
          une sous-page de dossier, un alias narratif, un miroir et un banc d'essai ne sont pas cinq
          publications équivalentes. <a href="registre/#arch-341">Statut : contesté →</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§2 — Ce que ce site fait, exactement</p>
    <h2 style="margin-top:1rem;max-width:26ch">Quatre instruments, aucun contenu neuf</h2>
    <p class="lede" style="margin-top:1.2rem">
      Le rapport critique adresse à l'archipel une liste de recommandations.
      Ce site en applique quatre à l'archipel lui-même, à titre de démonstration exécutable.
    </p>
    <div class="grid g-2" style="margin-top:2.5rem">
      ${[
        ["atlas/", "Atlas", "226 racines", "Recherche instantanée, six filtres, tri, deux vues, favoris, export CSV et JSON. Chaque état de filtrage est un permalien partageable, et chaque racine a sa fiche.", "Applique : « faire de l'inventaire un registre éditorial »"],
        ["registre/", "Registre de claims", "26 affirmations", "Valeur, périmètre, date, source, confiance, statut et verdict argumenté. Sept statuts, de « établi » à « erroné ».", "Applique : la recommandation P1 mot pour mot"],
        ["audit/", "Audit", "10 dimensions", "Couverture des signaux SEO sur 214 racines, métadonnées GitHub, titres dupliqués, racines mortes, rythme de publication.", "Applique : « séparer données, texte et visualisation »"],
        ["chantier/", "Chantier", "21 correctifs", "Le plan P0/P1/P2 en liste cochable, avec l'estimation d'effort. Votre avancement reste sur votre appareil.", "Applique : « transformer les promesses en preuves »"]
      ].map(([href, t, n, d, apply]) => `<a class="card" href="${href}">
        <div class="card-hd"><div><span class="kicker">${n}</span><div class="card-t" style="margin-top:.4rem">${t}</div></div>
        <span aria-hidden="true" style="color:var(--accent);font-size:1.4rem;line-height:1">→</span></div>
        <p class="small">${d}</p>
        <p class="tiny mono" style="margin-top:1rem;color:var(--fg-4)">${apply}</p>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§3 — Le point le plus coûteux</p>
    <h2 style="margin-top:1rem;max-width:24ch">Trois affirmations ne survivent pas au contrôle</h2>
    <p class="lede" style="margin-top:1.2rem">
      Ce sont les seules du corpus qui peuvent tromper un lecteur, un moteur ou une IA <em>aujourd'hui</em>.
      Deux tiennent en une ligne de correction.
    </p>
    <div class="stack" style="margin-top:2.5rem">
      ${errone.map(cl => `<div class="claim" style="--st:${ROLES[STATUS[cl.status].role].color};--st-ink:${ROLES[STATUS[cl.status].role].ink}" id="h-${cl.id}">
        <div class="chips">
          <span class="stat-chip ${ROLES[STATUS[cl.status].role].cls}">${STATUS[cl.status].glyph} ${STATUS[cl.status].label}</span>
          <span class="chip dim">${esc(cl.theme)}</span>
        </div>
        <p class="claim-q">« ${esc(cl.claim)} »</p>
        <p class="verdict">${esc(cl.verdict)}</p>
        <p style="margin-top:1rem"><a class="btn btn-g" href="registre/#${cl.id}" style="padding:.35rem .7rem;font-size:.78rem">Fiche complète et sources</a></p>
      </div>`).join("")}
    </div>
    <div class="note bad" style="margin-top:1.5rem">
      <b>Et trois autres sont contestées</b> — chiffres exacts, rapprochement invalide.
      Le plus connu est le <b>Ratio 120</b>, qui divise une fraude fiscale <em>estimée</em> par une fraude sociale
      <em>détectée</em>. L'argument politique tient sans ce calcul ; le calcul ne tient pas — et le meilleur dossier
      de l'archipel, « Le prix de la justice », rejette nommément cette arithmétique.
      <a href="registre/#ratio120">Lire le verdict →</a>
    </div>
    <div style="margin-top:2.5rem">
      ${figure({
        title: "Les 26 affirmations, par niveau de preuve",
        sub: "Sept statuts, quatre rôles de fiabilité. Chaque statut porte un glyphe et un libellé : la couleur ne porte jamais l'information seule.",
        chart: stack({ parts: statusParts, total: CLAIMS.length }),
        caption: `Onze affirmations sur vingt-six sont vérifiables sur source primaire. Le reste demande une qualification explicite — c'est précisément ce que l'archipel omet de faire. <a href="registre/">Ouvrir le registre →</a>`
      })}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§4 — Anatomie du corpus</p>
    <h2 style="margin-top:1rem;max-width:26ch">Un atelier de prototypage, pas une bibliothèque</h2>
    <div class="grid g-2" style="margin-top:2.5rem;align-items:start">
      ${figure({
        id: "themes",
        title: "Les 226 racines par thème",
        sub: "La catégorie la plus fournie s'appelle « Autres laboratoires ». Quand le fourre-tout devient le premier poste, la taxonomie a cessé de trier.",
        chart: barsH({ rows: themeRows }),
        table: tableOf(["Thème", "Racines", "Part"], themeRows.map(r => [esc(r.k), r.v, ((r.v / roots.length) * 100).toFixed(1) + " %"])),
        caption: `Recomptage indépendant sur l'appendice du rapport : les neuf totaux concordent au chiffre près avec la classification NEXUS. <a href="atlas/">Filtrer par thème →</a>`
      })}
      ${figure({
        id: "rythme",
        title: "Rythme de création, janvier 2025 → août 2026",
        sub: "70 racines créées en août 2026, 59 en janvier 2026. Deux vagues suffisent à produire 57 % du corpus.",
        chart: columns({ data: D.months, highlight: ["2026-08", "2026-01"] }),
        table: tableOf(["Mois", "Racines créées"], D.months.filter(m => m.v).map(m => [esc(m.label), m.v])),
        caption: `Cette vélocité explique l'impression d'explosion créative. Elle explique aussi les métadonnées manquantes, les miroirs et les projets laissés en l'état : <b>soixante-dix créations en un mois rendent impossible une relecture uniforme</b> sans pipeline explicite.`
      })}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§5 — Le verdict</p>
    <div class="split" style="margin-top:1rem">
      <div>
        <h2 style="max-width:14ch">Ce qui tient, ce qui casse</h2>
        <p class="small" style="margin-top:1.2rem">Dix dimensions, évaluées à partir des deux rapports et d'un contrôle direct des dossiers phares.</p>
        <p style="margin-top:1.5rem"><a class="btn" href="audit/">Voir l'audit détaillé</a></p>
      </div>
      <div class="grid g-2">
        <div class="panel" style="border-top:2px solid var(--st-good)">
          <p class="kicker" style="color:var(--st-good)">✔ Ce qui tient</p>
          <ul class="num-list" style="margin-top:1rem">
            <li><b>Une identité éditoriale rare.</b> Le corpus ne commente pas l'actualité : il fabrique des simulateurs, des cartes, des chronologies et des jeux.</li>
            <li><b>Cinq dossiers de très haut niveau.</b> GRECO, TPE, Non-recours, Éducation permanente et Observation exposent leurs sources, leurs incertitudes et ce que leurs chiffres <em>ne prouvent pas</em>.</li>
            <li><b>Une infrastructure sobre.</b> 171 racines sur 214 ne chargent aucun script externe absolu.</li>
            <li><b>Des données manipulables.</b> 37 racines utilisent le stockage local, 53 déclarent un manifeste : le projet ne reste pas au stade du texte.</li>
          </ul>
        </div>
        <div class="panel" style="border-top:2px solid var(--st-critical)">
          <p class="kicker" style="color:var(--st-critical)">✕ Ce qui casse</p>
          <ul class="num-list" style="margin-top:1rem">
            <li><b>Le volume est devenu une dette.</b> Dossier de référence, maquette laissée sous son titre par défaut, copie, page humoristique et 404 cohabitent sans hiérarchie.</li>
            <li><b>Les miroirs diluent l'autorité.</b> ${D.dupGroups.length} groupes de titres strictement identiques couvrent ${D.dupRoots} racines ; ${D.dupCross} traversent les deux comptes.</li>
            <li><b>Les métadonnées sont vides.</b> Sur 226 dépôts : 11 descriptions, 21 homepages, <b>1 seul topic</b>, 172 sans licence.</li>
            <li><b>La réputation est auto-référentielle.</b> Le maillage interne est dense ; la recherche externe ne trouve aucune reprise indépendante.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§6 — Le portefeuille</p>
    <h2 style="margin-top:1rem;max-width:26ch">Douze vitrines valent mieux que deux cent vingt-six portes</h2>
    <p class="lede" style="margin-top:1.2rem">
      Les autres projets ne doivent pas disparaître. Ils doivent être rattachés à l'un de ces douze,
      marqués « laboratoire » ou « archive », et cesser de se concurrencer comme autant d'entrées équivalentes.
    </p>
    <div class="grid g-3" style="margin-top:2.5rem">
      ${PORTFOLIO.map(p => `<a class="card" href="${p.url}" rel="noopener" target="_blank">
        <div class="card-hd"><span class="mono tiny" style="color:var(--accent)">${String(p.n).padStart(2, "0")}</span>
        <span class="chip tiny">${esc(p.role)}</span></div>
        <div class="card-t" style="font-size:var(--step-0)">${esc(p.t)} <span aria-hidden="true" style="font-size:.75em;color:var(--fg-4)">↗</span></div>
        <p class="tiny" style="margin-top:.6rem;line-height:1.55">${esc(p.why)}</p>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="panel" style="border-left:3px solid var(--accent-2);padding:var(--sp-6)">
      <p class="kicker">Hors GitHub Pages</p>
      <h3 style="margin-top:.8rem;font-size:var(--step-2)">11·60 bis — le versant fichiers de l'archipel</h3>
      <p class="small" style="margin-top:1rem;max-width:60ch">
        L'archipel ne tient pas entièrement sur GitHub. <b>dl.ouaisfi.eu/usba</b> héberge le tableau de bord
        « BROL 2.0 », qui agrège dix-neuf modules HTML autonomes : bases de fichiers, hubs de navigation,
        interfaces d'IA fictives, modèles intranet, méta-guides, univers narratifs et annexes.
        C'est la pièce où l'esthétique rétro-geek de l'écosystème est la plus assumée — et la plus lisible
        comme telle, ce qui la met justement à l'abri de la confusion entre fiction et dossier.
      </p>
      <p style="margin-top:1.5rem"><a class="btn btn-p" href="${SITE.usba}" rel="noopener" target="_blank">
        Ouvrir dl.ouaisfi.eu/usba
        <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></a></p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap wrap-n">
    <p class="eyebrow">Questions fréquentes</p>
    <h2 style="margin-top:1rem">Ce qu'on nous demande</h2>
    <div style="margin-top:2rem">
      ${FAQ.map((f, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><div class="dbody">${esc(f.a).replace(/&lt;b&gt;/g, "<b>")}</div></details>`).join("")}
    </div>
    <div style="margin-top:2.5rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between">
      ${share({ url, title: "227 — Registre critique de l'archipel Ouaisfieu × Yannkeep", text: "226 GitHub Pages inventoriées, 26 affirmations notées une à une, 3 erreurs matérielles identifiées." })}
      <a class="btn btn-g" href="feed.xml">S'abonner au flux RSS</a>
    </div>
  </div>
</section>`;

  emit("", page({
    title: "Accueil", desc: SITE.description, path: "", depth: 0, active: "home",
    jsonld, og: "og-home.png", body
  }), { priority: 1.0, changefreq: "weekly" });
}
