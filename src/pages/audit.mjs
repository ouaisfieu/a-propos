import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";
import { figure, barsH, tableOf, dots, fr } from "../templates/viz.mjs";

export default function audit(c, emit) {
  const { SITE, METRICS: M, THEMES, roots, D, CONSTELLATIONS } = c;
  const { DIMENSIONS } = c;
  const url = abs("audit/");

  const seoRows = M.seo.map(s => ({ k: s.k, v: +((s.n / s.base) * 100).toFixed(1), of: null, n: s.n }));
  const ghRows = M.ghMeta.filter(g => !/NOASSERTION|Aucune/.test(g.k)).map(g => ({ k: g.k, v: +((g.n / g.base) * 100).toFixed(1), n: g.n }));

  const jsonld = [
    { "@context": "https://schema.org", "@type": "Report", name: "Audit de l'archipel Ouaisfieu × Yannkeep", url,
      inLanguage: "fr-BE", datePublished: SITE.observedAt, author: { "@type": "Person", name: SITE.author },
      about: { "@type": "Thing", name: "Découvrabilité et maintenance de 226 sites statiques" },
      abstract: "Couverture des signaux SEO sur 214 racines accessibles, métadonnées GitHub sur 226 dépôts, titres dupliqués, racines mortes et évaluation en dix dimensions.",
      isBasedOn: { "@type": "Dataset", url: abs("data/metrics.json") } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
      { "@type": "ListItem", position: 2, name: "Audit", item: url } ] }
  ];

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Audit" }], 1)}</div>

<section class="wrap" style="padding-bottom:var(--sp-7)">
  <p class="eyebrow">Dix dimensions · 226 dépôts · 214 racines contrôlées</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:22ch">L'archipel est excellent là où il est faible, et faible là où il est excellent</h1>
  <p class="lede" style="margin-top:1.2rem">
    Le paradoxe tient en une phrase : un écosystème conçu pour <b>reconquérir la légitimité algorithmique</b>
    néglige les fichiers qui rendent un site trouvable, et un projet qui revendique le code ouvert
    laisse <b>172 dépôts sur 226 sans licence détectée</b>.
  </p>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <h2 id="dimensions">Évaluation en dix dimensions</h2>
    <p class="small" style="margin-top:.8rem;max-width:70ch">Notes de 1 à 5, établies à partir des deux rapports critiques et d'un contrôle direct des dossiers phares. L'échelle est ordinale : elle classe, elle ne mesure pas.</p>
    <div class="tw" style="margin-top:2rem">
      <table><thead><tr><th scope="col">Dimension</th><th scope="col">Niveau</th><th scope="col">Note</th><th scope="col">Justification</th></tr></thead><tbody>
      ${DIMENSIONS.map(d => `<tr>
        <td style="font-weight:650;white-space:nowrap">${esc(d.k)}</td>
        <td><span class="tiny mono dim">${esc(d.tag)}</span></td>
        <td>${dots(d.lvl)}</td>
        <td class="small">${esc(d.why)}</td></tr>`).join("")}
      </tbody></table>
    </div>
    <p class="tiny dim" style="margin-top:1rem">Le classement est délibérément descendant : ce qui est fort en haut, ce qui casse en bas. Les quatre dernières lignes sont celles qui menacent tout le reste.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="seo">Ce que les machines voient de l'archipel</h2>
    <p class="lede" style="margin-top:1rem">
      Le titre et la langue sont bons partout. Tout le reste — ce qui décide de l'affichage dans un résultat
      de recherche, du partage sur un réseau social et de la compréhension par un modèle — manque une fois sur deux.
    </p>
    <div class="grid g-2" style="margin-top:2.5rem;align-items:start">
      ${figure({
        title: "Couverture des signaux, sur 214 racines accessibles",
        sub: "Inspection du HTML initial. Une application JavaScript peut injecter ces balises ensuite : ce relevé mesure ce qu'un robot voit sans exécuter le script.",
        chart: barsH({ rows: seoRows, max: 100, pct: true }),
        table: tableOf(["Signal", "Présent", "Couverture"], M.seo.map(s => [esc(s.k), `${s.n} / ${s.base}`, ((s.n / s.base) * 100).toFixed(1) + " %"])),
        caption: `<b>L'image Open Graph est le trou le plus visible : 68 racines sur 214.</b> Un lien partagé sans image perd l'essentiel de son taux de clic — pour un écosystème dont la doctrine repose sur la viralité, c'est une contradiction opérationnelle, pas un détail cosmétique.`
      })}
      <div class="stack-lg">
        ${figure({
          title: "Métadonnées GitHub, sur 226 dépôts",
          sub: "La page d'accueil lisible par les machines d'un dépôt : sa description, ses topics, sa licence, son URL de publication.",
          chart: barsH({ rows: ghRows, max: 100, pct: true }),
          table: tableOf(["Champ", "Renseigné", "Couverture"], M.ghMeta.map(g => [esc(g.k), `${g.n} / ${g.base}`, ((g.n / g.base) * 100).toFixed(1) + " %"])),
          caption: `<b>Un seul dépôt sur 226 expose un topic.</b> 172 n'ont aucune licence détectée, 38 renvoient <code>NOASSERTION</code>. Un écosystème qui revendique la forkabilité rend ses dépôts introuvables par le moteur de recherche de GitHub lui-même. Ce sont 226 formulaires de trois champs.`
        })}
        <div class="note">
          <b>Les données structurées ne compensent pas un contenu insuffisant.</b>
          42 racines n'exposent aucun lien dans leur HTML initial et 44 contiennent moins de cent mots visibles.
          Un JSON-LD riche autour d'une coquille vide ne transforme pas la coquille en publication de référence :
          il annonce simplement une promesse que la page ne tient pas.
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="doublons">Les miroirs diluent l'autorité</h2>
    <div class="grid g-2" style="margin-top:2rem;align-items:start">
      <div class="stack">
        <p>
          Le rapport relève <b>23 groupes de titres dupliqués</b> couvrant 50 racines, dont 7 à cheval sur les
          deux comptes. Le recomptage indépendant, effectué sur les titres normalisés de l'appendice,
          en trouve <b>${D.dupGroups.length} groupes pour ${D.dupRoots} racines</b>, avec le même
          chiffre de ${D.dupCross} groupes inter-comptes. L'écart tient aux titres tronqués dans le tableau source :
          il est signalé plutôt que lissé.
        </p>
        <p>
          La conséquence n'est pas une pénalité automatique, mais une dispersion. Moteurs et lecteurs doivent
          deviner quelle version fait autorité, les signaux de liens se répartissent, les mises à jour divergent,
          et une ancienne copie peut apparaître avant la bonne. Or seules <b>97 racines sur 214</b>
          déclarent une URL canonique — et l'une d'elles, <code>ouaisfieu/party</code>, pointe la sienne vers
          <code>www.example.com</code>.
        </p>
        <div class="note bad"><b>Correctif à une ligne.</b> Choisir une URL canonique par groupe,
        rediriger si possible, sinon poser <code>rel=canonical</code> ou <code>noindex</code> sur les copies.
        <a href="../chantier/#p1-4">Voir le correctif P1-4 →</a></div>
      </div>
      <div class="panel">
        <p class="kicker">Les ${D.dupGroups.length} groupes recomptés</p>
        <div class="tw" style="border:0;margin-top:1rem;max-height:30rem;overflow:auto">
        <table><thead><tr><th scope="col">Titre partagé</th><th scope="col" class="n">Racines</th></tr></thead><tbody>
        ${D.dupGroups.map(g => `<tr><td>${esc(g.title)}${g.cross ? ' <span class="tiny mono" style="color:var(--st-warn)">inter-comptes</span>' : ""}<br><span class="tiny mono dim">${g.repos.map(esc).join(" · ")}</span></td><td class="n">${g.n}</td></tr>`).join("")}
        </tbody></table></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="mortes">Les douze racines mortes</h2>
    <p class="lede" style="margin-top:1rem">
      Elles sont nommées, localisées, et corrigeables en une session. C'est le correctif au meilleur
      rapport effort / bénéfice de tout le chantier.
    </p>
    <div class="grid g-3" style="margin-top:2rem">
      ${D.dead.map(r => `<a class="card" href="../atlas/${r.slug}/" style="border-left:3px solid var(--st-critical)">
        <span class="stat-chip st-critical">✕ 404</span>
        <div class="card-t" style="font-size:var(--step-0);margin-top:.7rem">${esc(r.name)}</div>
        <p class="tiny mono dim" style="margin-top:.3rem">${esc(r.repo)}</p>
        <p class="tiny dim" style="margin-top:.5rem">Créé le ${r.created}</p>
      </a>`).join("")}
    </div>
    <p class="small" style="margin-top:1.5rem;max-width:70ch">
      Onze relèvent de <code>ouaisfieu</code>, une de <code>yannkeep</code>. Réparer la publication ou
      désactiver Pages sur le dépôt : les deux issues sont bonnes. Ne rien faire ne l'est pas —
      une racine morte reste explorée, et affiche une erreur à qui suit un lien.
    </p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="constellations">Les neuf constellations éditoriales</h2>
    <p class="lede" style="margin-top:1rem">
      Sous les 226 racines, neuf ensembles cohérents. C'est à ce niveau, et non au niveau du dépôt,
      que l'archipel devient lisible.
    </p>
    <div style="margin-top:2rem">
      ${CONSTELLATIONS.map(k => `<details><summary><span><span class="mono" style="color:var(--accent);margin-right:.7rem">${k.k}</span>${esc(k.t)}</span></summary>
      <div class="dbody"><p>${esc(k.d)}</p>
      <p style="margin-top:1rem"><span class="stat-chip st-warn">→ ${esc(k.verdict)}</span></p></div></details>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="promesses">Les promesses non auditables</h2>
    <div class="grid g-2" style="margin-top:2rem;align-items:start">
      <div class="stack">
        <p>
          Plusieurs pages déclarent « zéro tracking », « aucune donnée personnelle », « RGPD by design »
          ou « tout reste sur votre appareil ». Sur ce corpus, ces promesses sont <b>plausibles</b> :
          171 racines sur 214 ne chargent aucun script externe absolu. Elles ne sont pas pour autant
          <b>prouvées</b> — une promesse de conformité ne se déduit pas de l'hébergement statique,
          et un script local peut appeler un service tiers après interaction.
        </p>
        <p>
          Ce que devrait fournir chaque outil manipulant contacts, profils, opinions politiques, santé
          ou introspection : les données stockées, leur emplacement, leur durée, l'export, l'effacement,
          les dépendances, les requêtes réseau, le risque sur un appareil partagé, et un avertissement
          sur la sensibilité. Le CRM politique et les outils d'introspection appellent une prudence renforcée.
        </p>
        <div class="note ok">
          <b>Ce site applique sa propre recommandation.</b> Zéro requête réseau sortante, zéro police externe,
          zéro traceur, zéro cookie. Les préférences (thème, contraste, favoris, cases cochées) restent dans
          le stockage local du navigateur. La promesse est vérifiable en trente secondes : ouvrez l'onglet
          « Réseau » de votre navigateur et rechargez.
        </div>
      </div>
      <div class="panel">
        <p class="kicker">Signaux clients détectés</p>
        <div style="margin-top:1.2rem">
          ${barsH({ rows: M.clientSignals.map(([k, v]) => ({ k, v })), max: 226 })}
        </div>
        <p class="tiny dim" style="margin-top:1.2rem">
          Détections dans le HTML initial des 214 racines accessibles. Ce sont des signaux techniques,
          pas une garantie de bon fonctionnement — mais ils montrent que le projet ne reste pas au stade du texte.
        </p>
        <hr>
        <p class="kicker">Accessibilité</p>
        <p class="small" style="margin-top:.8rem">
          Le site « Non-recours » propose taille de texte, contraste renforcé, réduction des animations
          et mode essentiel : c'est la bonne direction. Ailleurs, le HTML initial se réduit parfois à
          « JavaScript est nécessaire ». Une page ne peut être dite conforme que si les technologies
          dont elle dépend sont effectivement prises en charge de manière accessible.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="panel" style="border-left:3px solid var(--accent)">
      <p class="kicker">La conclusion, telle qu'elle est</p>
      <blockquote style="margin-top:1.2rem">
        La quantité brute commence à produire l'effet inverse de celui recherché : au lieu de rendre
        le pouvoir lisible, elle rend parfois sa propre structure illisible.
        <cite>Rapport critique de l'archipel Ouaisfieu × Yannkeep, 26 août 2026</cite>
      </blockquote>
      <p style="margin-top:1.5rem;max-width:68ch">
        L'archipel a désormais davantage besoin de <b>conservation, d'édition et de désherbage</b> que
        de nouvelles racines. La prochaine avancée n'est pas un 227ᵉ site : c'est une politique éditoriale
        de confiance — une URL de référence, une taxonomie stable, un statut visible, une preuve attachée
        à chaque affirmation sensible, une relecture proportionnée au risque et un archivage assumé.
      </p>
      <p style="margin-top:1.5rem"><a class="btn btn-p" href="../chantier/">Passer au chantier — 21 correctifs</a></p>
    </div>
    <div style="margin-top:2.5rem">
      ${share({ url, title: "Audit de l'archipel Ouaisfieu × Yannkeep", text: "1 topic GitHub sur 226 dépôts, 172 sans licence, 68 images Open Graph sur 214 racines. L'audit complet." })}
    </div>
  </div>
</section>`;

  emit("audit", page({
    title: "Audit",
    desc: "Audit de l'archipel Ouaisfieu × Yannkeep : couverture des signaux SEO sur 214 racines, métadonnées GitHub sur 226 dépôts, titres dupliqués, racines mortes, promesses de confidentialité et évaluation en dix dimensions.",
    path: "audit/", depth: 1, active: "audit", jsonld, og: "og-audit.png", body, type: "Article"
  }), { priority: 0.8, changefreq: "monthly" });
}
