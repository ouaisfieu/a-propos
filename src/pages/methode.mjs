import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";
import { tableOf } from "../templates/viz.mjs";

export default function methode(c, emit) {
  const { SITE, METRICS: M, roots, D, CLAIMS } = c;
  const url = abs("methode/");

  const jsonld = [
    { "@context": "https://schema.org", "@type": "AboutPage", name: "Méthode, sources et limites", url, inLanguage: "fr-BE",
      description: "D'où viennent les chiffres de ce site, comment ils ont été recomptés, ce qu'ils ne prouvent pas, quel rôle l'intelligence artificielle a joué, et comment signaler une erreur.",
      isPartOf: { "@id": abs("") + "#website" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
      { "@type": "ListItem", position: 2, name: "Méthode", item: url } ] }
  ];

  const SOURCES = [
    ["Rapport critique de l'archipel — inventaire des 226 racines", "Document de projet, 26 août 2026", "Inventaire, contrôle HTTP, signaux SEO, métadonnées GitHub, évaluation qualitative", "primaire pour l'inventaire"],
    ["Cartographie et analyse critique de l'écosystème", "Document de projet, 26 août 2026", "Doctrine, constellations éditoriales, contexte historique", "secondaire — à traiter comme analyse, pas comme constat"],
    ["NEXUS — Atlas des GitHub Pages", "yannkeep.github.io/nexus, généré le 25 août 2026", "224 projets + 115 sous-pages = 339 entrées, catalogue JSON", "primaire pour la classification"],
    ["Index Ouaisfieu × Yannkeep (Portail)", "ouaisfieu.github.io/portail", "157 publications, domaines satellites, typologie", "primaire pour les comptages internes"],
    ["GRECO Belgique — dossier citoyen", "ouaisfieu.github.io/greco-belgique, vérifié le 13 août 2026", "Non-conformité, 22 recommandations, formation des parlementaires", "secondaire, citant le GRECO"],
    ["Le non-recours aux droits en Belgique", "ouaisfieu.github.io/non-recours, édition du 24 août 2026", "Fourchettes de non-recours, cinq mécanismes, AROPE 2025", "secondaire, avec périmètres explicites"],
    ["Le prix de la justice (TPE)", "yannkeep.github.io/tpe, mise à jour du 7 août 2026", "167 transactions, 148,35 M€, VAT gap, Cour des comptes 2025", "secondaire, méthodologiquement le plus solide"],
    ["Livre II du nouveau Code pénal belge", "Loi du 29 février 2024, Moniteur belge", "Intitulés des articles 576 à 606", "primaire — contredit le dossier Qatargate"],
    ["Google Search Central", "developers.google.com/search", "Canonical, meta description, données structurées", "primaire, documentation normative"],
    ["Creative Commons — Understanding Free Cultural Works", "creativecommons.org", "BY et BY-SA approuvées, BY-NC non", "primaire, documentation normative"],
    ["W3C WAI — Understanding WCAG conformance", "w3.org/WAI", "Conditions de conformité et amélioration progressive", "primaire, documentation normative"],
    ["dl.ouaisfi.eu/usba — BROL 2.0", "Consulté le 26 août 2026", "19 modules HTML, structure du tableau de bord", "primaire pour la description"]
  ];

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Méthode" }], 1)}</div>

<section class="wrap" style="padding-bottom:var(--sp-6)">
  <p class="eyebrow">Sources, limites, IA, corrections</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:20ch">Ce que ce site sait, et comment il le sait</h1>
  <p class="lede" style="margin-top:1.2rem">
    Un site qui note la fiabilité des autres doit exposer la sienne. Voici d'où viennent les chiffres,
    ce qui a été recompté, ce que le relevé ne mesure pas, quel rôle une intelligence artificielle a joué,
    et comment obtenir une correction.
  </p>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap wrap-n prose">
    <h2 id="methode">Comment l'inventaire a été construit</h2>
    <p>
      Le corpus part de l'appendice du rapport critique du 26 août 2026, qui recense chaque dépôt dont
      GitHub signale « Pages activé », avec son titre, son thème NEXUS, son type, son statut HTTP relevé
      ce jour-là et sa date de création.
    </p>
    <p>
      Ces <b>226 lignes ont été transcrites puis recomptées indépendamment</b>. Les neuf totaux thématiques
      concordent au chiffre près avec la classification NEXUS ; la répartition par compte
      (165 / 61), le nombre de racines mortes (12), les créations d'août 2026 (70) et de janvier 2026 (59)
      concordent également. Cette convergence est la seule raison pour laquelle l'inventaire est publié
      comme jeu de données réutilisable.
    </p>
    <h3>Un écart, signalé plutôt que lissé</h3>
    <p>
      Le rapport annonce <b>23 groupes</b> de titres dupliqués couvrant <b>50 racines</b>. Le recomptage
      sur les titres normalisés en trouve <b>${D.dupGroups.length} groupes</b> pour <b>${D.dupRoots} racines</b>,
      avec le même chiffre de <b>${D.dupCross} groupes inter-comptes</b>. L'écart tient aux titres tronqués
      dans le tableau source : deux libellés coupés au même endroit peuvent fusionner ou se séparer selon
      la normalisation retenue. Les deux chiffres sont publiés côte à côte, et le calcul est reproductible
      depuis <a href="../data/roots.json">le catalogue JSON</a>.
    </p>

    <h2 id="limites">Ce que ce site ne prouve pas</h2>
    <ul>
      <li><b>L'inventaire est un instantané.</b> Il date du 26 août 2026 et n'est pas rafraîchi automatiquement. Une racine réparée depuis apparaîtra toujours comme morte ici.</li>
      <li><b>Le contrôle HTTP ne teste que la racine.</b> Une réponse 200 ne garantit ni le bon fonctionnement des interactions, ni la validité des affirmations de la page.</li>
      <li><b>Ce n'est pas un audit d'accessibilité, de sécurité ni de performance.</b> Les signaux relevés proviennent de l'inspection du HTML initial : une application JavaScript peut injecter ensuite des balises absentes du relevé.</li>
      <li><b>« Aucun script externe » n'est pas « aucune requête réseau ».</b> Un script local peut appeler un service tiers après interaction. Le relevé mesure la sobriété au chargement, pas à l'exécution.</li>
      <li><b>Les verdicts du registre sont des jugements argumentés.</b> Ils engagent leur auteur. Les statuts « contesté » et « erroné » portent sur des méthodes et des énoncés, jamais sur des intentions.</li>
      <li><b>Les chiffres de tiers restent des chiffres de tiers.</b> Lorsqu'une donnée provient d'un dossier de l'archipel citant lui-même une institution, elle est marquée « source secondaire » et sa confiance est abaissée.</li>
    </ul>

    <h2 id="ia">Politique d'usage de l'intelligence artificielle</h2>
    <p>
      Le rapport critique recommande à l'archipel de publier « le modèle utilisé, son rôle, les documents
      fournis, les vérifications humaines, les limites, la date de génération et l'historique des corrections ».
      Voici la version qui s'applique à ce site.
    </p>
    ${tableOf(["Élément", "Déclaration"], [
      ["Modèle", "Claude, développé par Anthropic. Identifiant de session : <code>claude-opus-5</code>."],
      ["Rôle", "Rédaction intégrale, analyse critique, transcription et recomptage de l'inventaire, conception graphique, écriture du générateur statique."],
      ["Documents fournis", "Deux rapports critiques datés du 26 août 2026, transmis par le commanditaire."],
      ["Vérifications indépendantes", "Consultation directe de NEXUS, du Portail, du dossier GRECO, du Non-recours, du dossier TPE et de dl.ouaisfi.eu/usba. Recomptage complet des 226 lignes de l'appendice."],
      ["Non vérifié", "Les 226 racines n'ont pas été rouvertes une à une. Les chiffres de couverture SEO et de métadonnées GitHub sont repris du rapport et n'ont pas été régénérés."],
      ["Date de génération", SITE.observedAt],
      ["Commanditaire", "Anonyme, à sa demande. Rattachement éditorial : " + esc(SITE.editorial) + "."],
      ["Limites assumées", "Une IA peut se tromper avec assurance. C'est précisément pourquoi chaque affirmation sensible porte un statut, une source et une date — pour que le désaccord soit possible sans avoir à tout reprendre."]
    ])}
    <p class="tiny dim" style="margin-top:1rem">
      Cette déclaration n'est pas une clause de style : elle est la condition pour que le registre de claims
      soit lisible. Un site qui note la fiabilité d'autrui sans exposer la sienne demande une confiance
      qu'il refuse d'accorder.
    </p>

    <h2 id="correction">Procédure de correction</h2>
    <p>
      Toute erreur factuelle signalée est corrigée, et la correction est <b>datée et conservée</b> —
      jamais effacée silencieusement. C'est la même exigence que celle adressée à l'archipel.
    </p>
    <ol>
      <li>Ouvrir une <b>issue</b> sur <a href="${SITE.repo}" rel="noopener">${esc(SITE.repo.replace("https://", ""))}</a> en citant l'ancre de la fiche concernée — chaque affirmation porte un identifiant stable de la forme <code>#greco-22</code>.</li>
      <li>Indiquer la source primaire qui contredit l'énoncé. Une source institutionnelle accessible et datée suffit.</li>
      <li>La fiche passe alors au statut <b>corrigé</b>, l'ancienne formulation reste visible, et la date de correction est publiée.</li>
    </ol>
    <p>
      Les désaccords d'interprétation ne sont pas des erreurs : ils sont conservés comme tels, avec la
      position adverse, plutôt que tranchés unilatéralement.
    </p>

    <h2 id="technique">Comment ce site est fait</h2>
    <p>
      Site statique, généré par un script Node maison à partir de fichiers de données. Le tableau
      des 226 racines est un TSV ; les affirmations, le plan et les métriques sont des modules JavaScript.
      Le générateur en produit ${roots.length + 18} pages HTML, un sitemap, un flux RSS, un fichier
      <code>llms.txt</code>, trois jeux de données JSON-LD et un CSV.
    </p>
    <ul>
      <li><b>Aucune dépendance.</b> Pas de framework, pas de bibliothèque de graphiques : les visualisations sont du HTML et du CSS, lisibles sans JavaScript et correctes à l'impression.</li>
      <li><b>Aucune requête réseau sortante.</b> Pas de police distante, pas d'analytique, pas de widget, pas de cookie. Vérifiable dans l'onglet « Réseau » de votre navigateur.</li>
      <li><b>Palette validée.</b> Les couleurs des graphiques ont été contrôlées pour la séparation en vision des couleurs déficiente et le contraste sur les deux thèmes ; aucune information n'est portée par la couleur seule.</li>
      <li><b>Accessibilité.</b> Lien d'évitement, structure de titres, ancres de section, réglages de thème, de contraste, de taille de texte et d'animations, cibles au clavier, feuille d'impression.</li>
      <li><b>Hors-ligne.</b> Un service worker met les pages en cache après la première visite. Il ne contacte aucun serveur tiers.</li>
      <li><b>Réutilisable.</b> ${esc(SITE.license)}.</li>
    </ul>

    <h2 id="sources">Sources</h2>
  </div>
</section>

<section class="wrap" style="padding-bottom:var(--sp-8)">
  ${tableOf(["Source", "Référence et date", "Ce qu'elle fournit", "Statut"],
    SOURCES.map(s => [`<b>${esc(s[0])}</b>`, `<span class="tiny mono">${esc(s[1])}</span>`, `<span class="small">${esc(s[2])}</span>`, `<span class="tiny">${esc(s[3])}</span>`]))}
  <p class="tiny dim" style="margin-top:1rem">
    Les sources marquées « primaire » ont été consultées directement. Les sources « secondaires » sont
    des dossiers de l'archipel citant eux-mêmes une institution : leur contenu est repris avec une
    confiance abaissée et signalée dans <a href="../registre/">le registre</a>.
  </p>
  <div style="margin-top:2.5rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between">
    ${share({ url, title: "Méthode, sources et limites — 227", text: "D'où viennent les chiffres, ce qu'ils ne prouvent pas, et quel rôle l'IA a joué." })}
    <a class="btn btn-g" href="../data/metrics.json">Métriques en JSON</a>
  </div>
</section>`;

  emit("methode", page({
    title: "Méthode, sources et limites",
    desc: "D'où viennent les chiffres de ce site, comment les 226 racines ont été recomptées, ce que le relevé ne mesure pas, quel rôle l'intelligence artificielle a joué et comment signaler une erreur.",
    path: "methode/", depth: 1, active: "methode", jsonld, og: "og-methode.png", body
  }), { priority: 0.7, changefreq: "monthly" });
}
