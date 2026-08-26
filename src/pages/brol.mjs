import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";
import { figure, barsH, tableOf, matrix, fr } from "../templates/viz.mjs";
import { buildGraph, EDGE_KINDS } from "../data/graph.mjs";

export default function brol(c, emit) {
  const { SITE, THEMES, TYPES, THEME_ORDER, CLAIMS, STATUS, ROLES, roots, D } = c;
  const G = buildGraph(roots, D);
  const S = G.stats;
  const gurl = abs("brol/graph/");
  const burl = abs("brol/");

  /* ── /brol/ — la porte du laboratoire ────────────────────────────────── */
  emit("brol", page({
    title: "Le brol",
    desc: "Le laboratoire de 227 : les outils qui croisent les données de l'archipel Ouaisfieu × Yannkeep plutôt que de les lister. Premier outil : le graphe des liens démontrables.",
    path: "brol/", depth: 1, active: "brol", og: "og-graph.png",
    jsonld: [
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "Le brol — laboratoire de 227", url: burl,
        inLanguage: "fr-BE", isPartOf: { "@id": abs("") + "#website" },
        description: "Outils de croisement de données sur l'archipel Ouaisfieu × Yannkeep." },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
        { "@type": "ListItem", position: 2, name: "Le brol", item: burl } ] }
    ],
    body: `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Le brol" }], 1)}</div>
<section class="wrap" style="padding-bottom:var(--sp-8)">
  <p class="eyebrow">Laboratoire · outils de croisement</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:20ch">Le brol</h1>
  <p class="lede" style="margin-top:1.2rem">
    L'atlas <b>liste</b> les 226 racines. Le registre les <b>note</b>. Le brol les <b>croise</b> :
    il cherche ce qui relie une racine à une autre, et surtout ce qui ne relie rien du tout.
  </p>
  <div class="grid g-2" style="margin-top:2.5rem">
    <a class="card" href="graph/">
      <div class="card-hd"><span class="kicker">${S.nodes} nœuds · ${S.edges} liens</span>
      <span aria-hidden="true" style="color:var(--accent);font-size:1.4rem;line-height:1">→</span></div>
      <div class="card-t">Graphe des liens démontrables</div>
      <p class="small">Les 226 racines, les ${S.claimNodes} affirmations qui les citent et les ${S.cohortNodes} cohortes
      de production, en un seul réseau explorable. Quatre types de liens, aucune parenté devinée.</p>
      <p class="tiny mono" style="margin-top:1rem;color:var(--st-critical-ink)">Résultat : ${S.isolated} racines n'ont aucun lien</p>
    </a>
    <div class="panel" style="border-left:3px solid var(--accent-2)">
      <p class="kicker">Ailleurs</p>
      <h3 style="margin-top:.7rem;font-size:var(--step-1)">Le brol d'origine</h3>
      <p class="small" style="margin-top:.8rem">
        Le nom n'est pas de moi. <b>BROL 2.0</b> est le tableau de bord que l'archipel héberge hors GitHub,
        sur <code>dl.ouaisfi.eu/usba</code> : dix-neuf modules HTML autonomes, des bases de fichiers aux
        univers narratifs. C'est la pièce où l'esthétique de l'écosystème est la plus assumée.
      </p>
      <p style="margin-top:1.2rem"><a class="btn" href="${SITE.usba}" rel="noopener" target="_blank">Ouvrir dl.ouaisfi.eu/usba
        <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></a></p>
    </div>
  </div>
</section>`
  }), { priority: 0.6, changefreq: "monthly" });

  /* ── Croisements ─────────────────────────────────────────────────────── */
  const themeRows = THEME_ORDER.map(t => ({
    label: THEMES[t].label,
    chip: `<span style="display:inline-block;width:.55rem;height:.55rem;border-radius:50%;background:${THEMES[t].color};margin-right:.5rem;vertical-align:0"></span>`,
    code: t
  }));
  const typeCols = Object.keys(TYPES).map(k => ({ label: TYPES[k].label, code: k }));
  const monthsWith = D.months.filter(m => m.v > 0);
  const statusOrder = Object.entries(STATUS).sort((a, b) => a[1].order - b[1].order);
  const bySlug = new Map(roots.map(r => [r.repo, r]));

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Le brol", href: "brol/" }, { label: "Graphe" }], 2)}</div>

<section class="wrap" style="padding-bottom:var(--sp-6)">
  <p class="eyebrow">Croisement de données · ${S.nodes} nœuds · ${S.edges} liens</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:24ch">L'archipel n'est pas un réseau. C'est une poussière.</h1>
  <p class="lede" style="margin-top:1.2rem">
    Ce graphe ne relie deux racines que lorsqu'un lien est <b>démontrable</b> : un titre identique,
    un nom de dépôt identique, une affirmation commune, ou une date de création partagée.
    Aucune parenté n'est devinée à partir d'un sujet voisin ou d'un style commun.
    Le résultat est net — et il n'est pas flatteur.
  </p>
  <div class="grid g-4" style="margin-top:2.5rem;gap:1.4rem 2rem">
    ${[[String(S.isolated), "racines sans aucun lien", `${((S.isolated / roots.length) * 100).toFixed(0)} % du corpus`, true],
       [String(S.components), "composantes séparées", `la plus grande n'en couvre que ${S.biggest.roots}`],
       [String(S.editorialOnly), "racines à lien éditorial", `sur ${roots.length} — les autres ne partagent qu'une date`],
       [String(S.byKind.cohort), "liens de production", "des racines nées le même jour, rien de plus"]]
      .map(([v, k, d, on]) => `<div class="stat${on ? " on" : ""}">
        <span class="stat-n" data-count="${v}">${v}</span>
        <span class="stat-k">${k}</span><span class="stat-d">${d}</span></div>`).join("")}
  </div>
</section>

<section class="wrap" style="padding-bottom:var(--sp-7)">
  <div class="gbar">
    ${Object.entries(EDGE_KINDS).map(([k, v]) =>
      `<button class="gtog" id="g-${k}" aria-pressed="${k === "cohort" ? "false" : "true"}" style="--gc:${v.color}" title="${esc(v.def)}"><i></i>${esc(v.label)} · ${S.byKind[k]}</button>`).join("")}
    <span class="sep" aria-hidden="true"></span>
    <button class="gtog plain" id="g-iso" aria-pressed="false" title="Masquer les racines sans aucun lien"><i style="--gc:var(--fg-4)"></i>Masquer les ${S.isolated} isolées</button>
    <select class="sel" id="g-theme" aria-label="Filtrer le graphe par thème">
      <option value="">Tous les thèmes</option>
      ${THEME_ORDER.map(t => `<option value="${t}">${esc(THEMES[t].label)}</option>`).join("")}
    </select>
    <select class="sel" id="g-account" aria-label="Filtrer le graphe par compte">
      <option value="">Les deux comptes</option><option value="ouaisfieu">ouaisfieu</option><option value="yannkeep">yannkeep</option>
    </select>
    <label class="search" style="flex:0 1 13rem">
      <span style="position:absolute;left:-9999px">Rechercher dans le graphe</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.6"/><path d="M15.8 15.8L21 21"/></svg>
      <input type="search" id="g-q" placeholder="Surligner…" autocomplete="off">
    </label>
    <span class="tiny mono dim" id="g-qcount" role="status" aria-live="polite"></span>
    <span class="sep" aria-hidden="true"></span>
    <span class="gsl"><label for="g-repel">Répulsion</label><input type="range" id="g-repel" min="0.3" max="2.4" step="0.1" value="1"></span>
    <span class="gsl"><label for="g-dist">Distance</label><input type="range" id="g-dist" min="0.5" max="2.5" step="0.1" value="1"></span>
    <button class="btn btn-g" id="g-pause" aria-pressed="false" style="padding:.42rem .7rem;font-size:.75rem">Figer</button>
    <button class="btn btn-g" id="g-reset" style="padding:.42rem .7rem;font-size:.75rem">Recentrer</button>
    <button class="btn btn-g" id="g-png" style="padding:.42rem .7rem;font-size:.75rem">Exporter en PNG</button>
  </div>

  <div class="gwrap">
    <div>
      <div id="graph">
        <noscript><div style="padding:var(--sp-6)"><p class="note" style="margin:0"><b>JavaScript est désactivé.</b>
          Le graphe interactif ne peut pas s'afficher, mais <b>toutes ses données sont dépliées en tableaux</b>
          plus bas : les ${G.mirrorGroups.length} groupes de titres identiques, les ${G.twinPairs.length} paires de noms jumeaux,
          les ${G.cohorts.length} cohortes de production, les ${S.isolated} racines isolées et le classement des nœuds
          les plus connectés. Rien n'est réservé au canvas.</p></div></noscript>
      </div>
      <p class="tiny dim" style="margin-top:.8rem;max-width:74ch">
        Au départ, seuls les <b>${S.byKind.mirror + S.byKind.twin + S.byKind.claim} liens éditoriaux</b> sont affichés :
        titres identiques, noms jumeaux, affirmations communes. Rallumez
        « <b>Créées le même jour</b> » pour voir les ${S.byKind.cohort} liens de production recouvrir la carte —
        c'est la démonstration la plus directe du diagnostic du rapport.
      </p>
      <div class="glegend">
        <span><b>Nœuds</b></span>
        <span><i class="gshape" style="background:var(--t-POL)"></i>racine (couleur = thème, taille = nombre de liens)</span>
        <span><i class="gshape ring"></i>racine en 404 (anneau creux, teinte du thème)</span>
        <span><i class="gshape" style="background:var(--st-good)"></i>affirmation du registre</span>
        <span><i class="gshape sq" style="background:var(--fg-4)"></i>cohorte de production</span>
      </div>
      <div class="glegend" style="margin-top:.5rem">
        <span><b>Liens</b></span>
        ${Object.entries(EDGE_KINDS).map(([, v]) => `<span><i class="gshape" style="background:${v.color};border-radius:1px;height:.2rem;width:1rem"></i>${esc(v.short)}</span>`).join("")}
      </div>
    </div>
    <aside id="gpanel" aria-live="polite"></aside>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§1 — Ce que le graphe démontre</p>
    <h2 style="margin-top:1rem;max-width:24ch">Quatre liens, et une conclusion qui tient en un chiffre</h2>
    <div class="grid g-2" style="margin-top:2.5rem;align-items:start">
      <div class="stack-lg">
        ${figure({
          title: `D'où viennent les ${S.edges} liens`,
          sub: "Chaque type de lien répond à une question différente. Un seul relève du contenu.",
          chart: barsH({ rows: Object.entries(EDGE_KINDS).map(([k, v]) => ({ k: v.label, v: S.byKind[k], note: v.def })) }),
          table: tableOf(["Type de lien", "Nombre", "Ce qu'il prouve"],
            Object.entries(EDGE_KINDS).map(([k, v]) => [`<b>${esc(v.label)}</b>`, S.byKind[k], `<span class="small">${esc(v.def)}</span>`])),
          caption: `<b>Le lien le plus fréquent n'est pas éditorial : c'est la date.</b> ${S.byKind.cohort} liens sur ${S.edges}
            relient des racines nées le même jour. Retirez-les, et ${roots.length - S.editorialOnly} racines sur ${roots.length}
            se détachent complètement du reste.`
        })}
        <div class="note bad">
          <b>Le chiffre qui résume tout : ${S.isolated}.</b>
          ${S.isolated} racines — ${((S.isolated / roots.length) * 100).toFixed(0)} % du corpus — n'ont
          <em>aucun</em> lien démontrable : ni titre partagé, ni nom de dépôt jumeau, ni affirmation commune,
          ni même une date de création partagée avec deux autres racines. Elles existent, elles répondent,
          et rien dans le relevé ne les rattache à quoi que ce soit.
        </div>
      </div>
      <div class="stack-lg">
        ${figure({
          title: "Les quinze nœuds les plus connectés",
          sub: "Ce sont les points d'ancrage réels de l'archipel — pas les portails, qui n'apparaissent presque pas.",
          chart: barsH({ rows: S.top.map(n => ({ k: n.sub, v: n.deg })) }),
          caption: `Les deux dossiers <b>GRECO</b>, <b>TPE</b> et les quatre <b>DOCTech</b> dominent le classement.
            Autrement dit : ce qui structure l'archipel, ce sont les dossiers de référence et les miroirs —
            pas les hubs conçus pour le structurer.`
        })}
        <div class="panel">
          <p class="kicker">Composantes</p>
          <p class="small" style="margin-top:.9rem">
            Le graphe se découpe en <b>${S.components} composantes séparées</b>. La plus grande rassemble
            ${S.biggest.size} nœuds, dont ${S.biggest.roots} racines — soit ${((S.biggest.roots / roots.length) * 100).toFixed(0)} %
            du corpus. Toutes les autres sont des îlots de deux à quelques nœuds.
          </p>
          <p class="small" style="margin-top:.8rem">
            Un archipel de 226 pages qui ne forme pas un réseau connexe n'est pas une critique de style :
            c'est la traduction structurelle du diagnostic du rapport. <b>Le volume a dépassé la capacité
            à relier.</b>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§2 — Croisements</p>
    <h2 style="margin-top:1rem;max-width:26ch">Ce que dit la même donnée regardée de deux côtés</h2>
    <p class="lede" style="margin-top:1.2rem">
      Un tableau croisé ne découvre rien que le catalogue ne contienne déjà. Il rend visible ce que
      la liste dissimule : les cases vides, les concentrations, et les catégories qui ne trient plus rien.
    </p>

    <div class="stack-lg" style="margin-top:2.5rem">
      ${figure({
        id: "theme-type",
        title: "Thème × type",
        sub: "Neuf thèmes, six types. 54 cases possibles — combien sont réellement occupées ?",
        chart: matrix({
          corner: "Thème \\ Type",
          rows: themeRows, cols: typeCols,
          cell: (r, cc) => (D.byTheme[r.code] || []).filter(x => x.type === cc.code).length
        }),
        caption: `La ligne « Autres laboratoires » se concentre presque entièrement sur une seule colonne :
          c'est une catégorie qui ne croise rien, donc qui ne trie rien. À l'inverse, « Politique &amp; démocratie »
          se répartit sur les six types — c'est la seule famille qui produit à la fois du dossier, de l'outil,
          de la documentation et de l'expérience. <b>Une taxonomie utile est une taxonomie qui se croise.</b>
          <br><br>La ligne de totaux vaut contrôle : 83 laboratoires, 48 documentations, 23 dossiers et 23 expériences —
          exactement les chiffres publiés par NEXUS le 25 août. Les deux seuls écarts (25 hubs au lieu de 24,
          24 outils au lieu de 23) sont les deux racines apparues après son instantané,
          <code>yannkeep/nexus</code> et <code>ouaisfieu/introspection</code>. Le recomptage tombe juste,
          et les écarts s'expliquent.`
      })}

      ${figure({
        id: "compte-theme",
        title: "Compte × thème, et l'état de chaque racine",
        sub: "Où chacun des deux comptes publie, et où se concentrent les racines mortes.",
        chart: matrix({
          corner: "Compte \\ Thème",
          rows: [{ label: "ouaisfieu — en ligne", code: ["ouaisfieu", 200] },
                 { label: "ouaisfieu — en 404", code: ["ouaisfieu", 404] },
                 { label: "yannkeep — en ligne", code: ["yannkeep", 200] },
                 { label: "yannkeep — en 404", code: ["yannkeep", 404] }],
          cols: THEME_ORDER.map(t => ({ label: THEMES[t].short, code: t })),
          cell: (r, cc) => (D.byTheme[cc.code] || []).filter(x => x.account === r.code[0] && x.http === r.code[1]).length
        }),
        caption: `Les onze racines mortes de <code>ouaisfieu</code> se concentrent dans « Autres laboratoires » et
          « ARG &amp; expérimentation » : ce sont des bancs d'essai abandonnés, pas des dossiers perdus.
          C'est une bonne nouvelle éditoriale — et cela ne change rien au fait qu'ils restent explorables
          et indexables tels quels. <a href="../../atlas/?status=ko">Voir les ${D.dead.length} racines →</a>`
      })}

      ${figure({
        id: "mois-theme",
        title: "Mois de création × thème",
        sub: "Les deux vagues de production, thème par thème.",
        chart: matrix({
          corner: "Mois \\ Thème",
          rows: monthsWith.map(m => ({ label: m.label, code: m.k })),
          cols: THEME_ORDER.map(t => ({ label: THEMES[t].short, code: t })),
          cell: (r, cc) => (D.byTheme[cc.code] || []).filter(x => x.created.slice(0, 7) === r.code).length
        }),
        caption: `Deux lignes écrasent toutes les autres : <b>janvier 2026</b> et <b>août 2026</b>.
          Et elles ne produisent pas la même chose — janvier fabrique surtout des laboratoires et des outils,
          août surtout de la politique, de la justice et de la documentation. La bascule est visible à l'œil nu :
          <b>l'archipel est passé du prototype au dossier</b>. C'est l'argument le plus favorable qu'on puisse
          tirer de ce corpus, et il se lit ici plutôt que dans un communiqué.`
      })}

      ${figure({
        id: "statut-domaine",
        title: "Niveau de preuve × domaine",
        sub: "Les 26 affirmations du registre, croisées avec le domaine qu'elles concernent.",
        chart: matrix({
          corner: "Statut \\ Domaine",
          rows: statusOrder.map(([k, s]) => ({ label: `${s.glyph} ${s.label}`, code: k })),
          cols: [...new Set(CLAIMS.map(x => x.theme))].map(t => ({ label: t, code: t })),
          cell: (r, cc) => CLAIMS.filter(x => x.status === r.code && x.theme === cc.code).length
        }),
        caption: `La colonne <b>Doctrine</b> ne contient pas une seule affirmation établie — tout y est allégué,
          projeté, contesté ou non falsifiable. La colonne <b>Justice &amp; intégrité</b>, elle, est la mieux
          sourcée du corpus <em>et</em> porte la seule erreur matérielle. Ce sont deux problèmes opposés :
          l'un manque de preuves, l'autre en manipule beaucoup et en rate une.
          <a href="../../registre/">Ouvrir le registre →</a>`
      })}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">§3 — Le graphe, déplié</p>
    <h2 style="margin-top:1rem;max-width:26ch">Tout ce que le canvas montre, en texte</h2>
    <p class="lede" style="margin-top:1.2rem">
      Une visualisation qui n'existe qu'en pixels n'est pas une donnée : c'est une image.
      Voici les mêmes liens, lisibles au clavier, au lecteur d'écran, à l'impression et sans JavaScript.
    </p>

    <div style="margin-top:2.5rem">
      <details open><summary>Les ${G.mirrorGroups.length} groupes de titres identiques — ${S.coveredByMirror} racines</summary>
        <div class="dbody" style="padding:0">${tableOf(["Titre partagé", "Racines"],
          G.mirrorGroups.slice().sort((a, b) => b.repos.length - a.repos.length).map(g =>
            [`<b>${esc(bySlug.get(g.repos[0]).title)}</b><br><span class="tiny mono dim">${g.repos.map(x => `<a href="../../atlas/${bySlug.get(x).slug}/">${esc(x)}</a>`).join(" · ")}</span>`, g.repos.length]))}</div></details>

      <details><summary>Les ${G.twinPairs.length} paires de noms de dépôt jumeaux — ${S.coveredByTwin} racines</summary>
        <div class="dbody" style="padding:0">${tableOf(["Nom de dépôt", "Sur les deux comptes"],
          G.twinPairs.map(t => [`<code>${esc(t.name)}</code>`,
            `<span class="tiny mono">${t.repos.map(x => `<a href="../../atlas/${bySlug.get(x).slug}/">${esc(x)}</a>`).join(" · ")}</span>`]))}</div></details>

      <details><summary>Les ${G.cohorts.length} cohortes de production — ${S.coveredByCohort} racines créées le même jour</summary>
        <div class="dbody" style="padding:0">${tableOf(["Jour", "Racines", "Dépôts"],
          G.cohorts.slice().sort((a, b) => b.n - a.n).map(co =>
            [`<b>${co.day}</b>`, co.n, `<span class="tiny mono dim">${co.repos.map(esc).join(" · ")}</span>`]))}</div></details>

      <details><summary>Les ${S.isolated} racines sans aucun lien</summary>
        <div class="dbody">
          <p class="small" style="margin-bottom:1rem">Aucun titre partagé, aucun nom jumeau, aucune affirmation,
          aucune cohorte. Ce sont les nœuds que le graphe laisse flotter seuls.</p>
          <div class="chips">${S.isolatedList.map(id => {
            const r = bySlug.get(id);
            return `<a class="chip" href="../../atlas/${r.slug}/" style="text-decoration:none${r.http === 404 ? ";color:var(--st-critical-ink)" : ""}">${esc(id)}</a>`;
          }).join("")}</div>
        </div></details>

      <details><summary>Les ${S.claimNodes} affirmations rattachées à une racine</summary>
        <div class="dbody" style="padding:0">${tableOf(["Affirmation", "Statut", "Racines citées"],
          CLAIMS.filter(cl => (cl.repos || []).length).map(cl =>
            [`<a href="../../registre/#${cl.id}">${esc(cl.claim)}</a>`,
             `<span class="stat-chip ${ROLES[STATUS[cl.status].role].cls}">${STATUS[cl.status].glyph} ${STATUS[cl.status].label}</span>`,
             cl.repos.length]))}</div></details>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap wrap-n prose">
    <h2 id="methode">Comment ce graphe est construit — et ce qu'il refuse de faire</h2>
    <p>
      Un graphe de connaissances est une machine à produire des liens convaincants. C'est précisément
      pour cela qu'il faut dire, avant de le regarder, ce qu'on s'est interdit d'y mettre.
    </p>
    <h3>Les quatre liens retenus</h3>
    <ul>
      ${Object.entries(EDGE_KINDS).map(([, v]) => `<li><b>${esc(v.label)}</b> — ${esc(v.def)}</li>`).join("")}
    </ul>
    <h3>Ce qui a été écarté</h3>
    <ul>
      <li><b>La proximité de sujet.</b> « Kazakhgate » et « Panama Papers » traitent tous deux de finance
      opaque : cela ne prouve pas qu'une page renvoie à l'autre. Un lien de thème aurait relié
      chaque racine à toutes celles de sa famille et produit une pelote illisible où tout se vaut.</li>
      <li><b>La similarité de style ou de vocabulaire.</b> Mesurable, séduisante, et invérifiable
      à partir d'un relevé de titres. Elle aurait fabriqué des parentés que rien ne soutient.</li>
      <li><b>Les liens hypertextes réels entre les pages.</b> Ce serait le meilleur signal — et il manque :
      le relevé porte sur le HTML initial des racines, pas sur leur exploration complète.
      C'est la limite principale de ce graphe, et elle est structurelle, pas accidentelle.</li>
    </ul>
    <div class="note">
      <b>Conséquence à garder en tête.</b> Deux racines non reliées ici <em>peuvent</em> se citer l'une l'autre
      en profondeur. L'absence de lien signifie « aucun lien démontrable dans ce relevé », jamais
      « aucun rapport ». Le graphe mesure ce que l'archipel <b>rend visible de sa propre structure</b> —
      ce qui est exactement le sujet du rapport critique.
    </div>
    <h3>Technique</h3>
    <p>
      Simulation de forces et rendu écrits à la main : répulsion en <i>n²</i> sur ${S.nodes} nœuds,
      ressorts sur ${S.edges} liens, amortissement progressif, disposition initiale par composante.
      Canvas 2D, aucune bibliothèque, aucune requête réseau. La palette est lue dans le CSS : le graphe
      suit le thème clair ou sombre du site, et se fige immédiatement si vous avez demandé la
      réduction des animations. Il s'arrête tout seul au bout de vingt-cinq secondes.
    </p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between">
      ${share({ url: gurl, title: "Le graphe de l'archipel Ouaisfieu × Yannkeep", text: `${S.nodes} nœuds, ${S.edges} liens, et ${S.isolated} racines qui ne sont reliées à rien.` })}
      <a class="btn btn-g" href="../../data/graph.json">Télécharger le graphe (JSON)</a>
    </div>
  </div>
</section>

<script type="application/json" id="graph-data">${JSON.stringify({
    root: "../../",
    themes: Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [k, v.label])),
    kinds: Object.fromEntries(Object.entries(EDGE_KINDS).map(([k, v]) => [k, v.label])),
    nodes: G.nodes.map(n => ({ id: n.id, kind: n.kind, label: n.label, sub: n.sub, theme: n.theme, type: n.type ? TYPES[n.type].label : null, account: n.account, http: n.http, created: n.created, slug: n.slug, deg: n.deg, comp: n.comp, status: n.status, cid: n.cid, n: n.n })),
    edges: G.edges
  }).replace(/</g, "\\u003c")}</script>`;

  emit("brol/graph", page({
    title: "Graphe de l'archipel",
    desc: `Graphe interactif des ${S.nodes} nœuds et ${S.edges} liens démontrables de l'archipel Ouaisfieu × Yannkeep : titres identiques, noms jumeaux, affirmations communes, cohortes de production. ${S.isolated} racines n'ont aucun lien.`,
    path: "brol/graph/", depth: 2, active: "brol", og: "og-graph.png", type: "Article",
    jsonld: [
      { "@context": "https://schema.org", "@type": "Article",
        headline: "L'archipel n'est pas un réseau. C'est une poussière.",
        url: gurl, inLanguage: "fr-BE", datePublished: SITE.observedAt, dateModified: SITE.observedAt,
        author: { "@type": "Person", name: SITE.author }, publisher: { "@id": abs("") + "#org" },
        description: `Analyse en graphe des 226 racines GitHub Pages de l'archipel : ${S.edges} liens démontrables, ${S.components} composantes séparées, ${S.isolated} racines isolées.`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        isBasedOn: { "@type": "Dataset", name: "Graphe de l'archipel", url: abs("data/graph.json") } },
      { "@context": "https://schema.org", "@type": "Dataset",
        name: "Graphe des liens démontrables de l'archipel Ouaisfieu × Yannkeep",
        description: "Nœuds (racines, affirmations, cohortes de production) et arêtes (titre identique, nom de dépôt jumeau, affirmation commune, création le même jour).",
        url: gurl, identifier: abs("data/graph.json"),
        license: "https://opendatacommons.org/licenses/odbl/1-0/",
        dateModified: SITE.observedAt, creator: { "@id": abs("") + "#org" },
        variableMeasured: ["id", "kind", "theme", "degree", "component", "edge kind"],
        distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: abs("data/graph.json") }] },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
        { "@type": "ListItem", position: 2, name: "Le brol", item: burl },
        { "@type": "ListItem", position: 3, name: "Graphe", item: gurl } ] }
    ],
    body, extraJs: `\n<script src="../../assets/graph.js" defer></script>`
  }), { priority: 0.8, changefreq: "monthly" });

  return G;
}
