import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";
import { figure, barsH, tableOf } from "../templates/viz.mjs";

export default function doctrine(c, emit) {
  const { SITE, CLAIMS, STATUS, ROLES, METRICS: M } = c;
  const url = abs("doctrine/");
  const byId = Object.fromEntries(CLAIMS.map(x => [x.id, x]));

  const jsonld = [
    { "@context": "https://schema.org", "@type": "Article", headline: "La doctrine de l'archipel, et ce qui en résiste au contrôle",
      url, inLanguage: "fr-BE", datePublished: SITE.observedAt, dateModified: SITE.observedAt,
      author: { "@type": "Person", name: SITE.author }, publisher: { "@id": abs("") + "#org" },
      description: "Lead-dexing, Ratio 120, « Connardovirus », Ping Ultime, JSON-LD comme arme : ce que l'écosystème théorise, et ce qui survit à la vérification.",
      articleSection: "Analyse", license: "https://creativecommons.org/licenses/by/4.0/" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
      { "@type": "ListItem", position: 2, name: "Doctrine", item: url } ] }
  ];

  const verdictBox = (id) => {
    const cl = byId[id]; if (!cl) return "";
    const st = STATUS[cl.status], role = ROLES[st.role];
    return `<div class="claim" style="--st:${role.color};--st-ink:${role.ink};margin-top:1.5rem">
      <div class="chips"><span class="stat-chip ${role.cls}">${st.glyph} ${st.label}</span>
      <a class="chip" href="../registre/#${id}" style="text-decoration:none;color:var(--fg-4)">fiche complète →</a></div>
      <p class="claim-q" style="font-size:var(--step-0)">« ${esc(cl.claim)} »</p>
      <p class="verdict">${esc(cl.verdict)}</p></div>`;
  };

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Doctrine" }], 1)}</div>

<section class="wrap" style="padding-bottom:var(--sp-7)">
  <p class="eyebrow">Analyse · ce texte est une opinion argumentée, pas un dossier factuel</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:22ch">Ce que l'archipel théorise, et ce qui résiste au contrôle</h1>
  <p class="lede" style="margin-top:1.2rem">
    L'écosystème ne se contente pas de publier : il produit une doctrine, avec son vocabulaire, ses
    équations et son calendrier. Certaines de ses intuitions sont justes et sous-estimées.
    D'autres se sont figées en slogans que ses propres meilleurs dossiers réfutent.
  </p>
  <div class="note" style="margin-top:1.5rem;max-width:74ch">
    <b>Étiquetage explicite.</b> Cette page est classée <b>analyse / opinion</b>, conformément à la
    recommandation P0-4 du rapport critique. Elle argumente, elle ne constate pas. Les affirmations
    factuelles qu'elle mobilise sont toutes rattachées à une fiche du
    <a href="../registre/">registre de claims</a>, avec leur statut.
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap wrap-n prose">
    <h2 id="juste">Trois choses que l'archipel a vues avant beaucoup d'autres</h2>
    <p>
      Commençons par ce qui tient, parce que c'est la partie que la critique escamote généralement.
    </p>
    <h3>1. Le champ de bataille s'est déplacé vers l'index</h3>
    <p>
      L'intuition fondatrice est solide : affronter un discours institutionnel sur un plateau de télévision
      est un combat aux règles fixées par l'adversaire, tandis qu'un corpus documentaire bien structuré
      continue de répondre à trois heures du matin, six ans plus tard, à quelqu'un qui n'a jamais entendu
      parler du collectif. Ce n'est pas une métaphore martiale : c'est une description exacte de la façon
      dont l'information politique circule désormais.
    </p>
    <h3>2. Le web sémantique comme infrastructure civique</h3>
    <p>
      Traduire des relations sociopolitiques — causalité, conflit d'intérêts, chaîne de responsabilité —
      en triplets interrogeables plutôt qu'en prose est une idée d'avance. Les moteurs modernes analysent
      l'intention par des relations vectorielles ; leur fournir des relations explicites plutôt que des
      adjectifs est le bon geste technique. Le laboratoire <b>GEO</b>, qui teste ouvertement comment les
      modèles de langage lisent du code statique, est probablement la pièce la plus originale du corpus.
    </p>
    <h3>3. L'architecture statique comme choix politique</h3>
    <p>
      Pas de base de données, donc pas d'injection SQL ; pas de serveur applicatif, donc pas d'asphyxie
      par la facture ; du Markdown, donc une pérennité indépendante de tout éditeur. Cette sobriété
      n'est pas seulement défensive : elle est vérifiable. 171 racines sur 214 ne chargent aucun script
      externe absolu. C'est le seul endroit du projet où la promesse et la preuve se rejoignent presque.
    </p>
  </div>
</section>

<section class="section">
  <div class="wrap wrap-n prose">
    <h2 id="ratio120">Le Ratio 120 : le bon combat, le mauvais calcul</h2>
    <p>
      C'est l'argument le plus diffusé de l'écosystème. Il met en regard une <b>fraude fiscale estimée
      à 30 milliards d'euros</b> et une <b>fraude sociale détectée à 250 millions</b>, et en tire un rapport
      de 120. Le chiffre est frappant, l'indignation qu'il porte est légitime, et l'asymétrie des moyens
      de contrôle qu'il dénonce est réelle et documentée.
    </p>
    <p>
      Le calcul, lui, ne tient pas. On divise une <em>estimation</em> à périmètre large par une
      <em>détection</em> à périmètre étroit. Ce ne sont pas deux mesures du même objet : ce sont deux
      instruments différents, braqués sur deux populations différentes, avec deux définitions
      différentes de ce qui compte. Leur quotient n'a pas d'unité.
    </p>
    <p>
      Le plus révélateur est que l'archipel <b>se réfute lui-même</b>. « Le prix de la justice », publié
      sur yannkeep, est le meilleur dossier du corpus précisément parce qu'il refuse cette
      « arithmétique spectrale » qui additionne écart de TVA, économie souterraine et sanctions.
      Il expose 167 transactions fiscales pour 148,35 millions d'euros recouvrés entre 2017 et 2023,
      avec leur périmètre. Il note que Gand concentre 68 % de ces transactions — ce qui documente
      des priorités de parquet, pas une géographie de la fraude. Et il retourne le sens commun :
      la première cause d'échec d'une négociation est <b>l'incapacité du suspect à payer</b>.
    </p>
    <p>
      Ce dernier point vaut mieux que le Ratio 120. Il transforme « la justice des riches » d'un slogan
      en <b>hypothèse testable</b> sur l'égalité devant la loi. C'est exactement ce que l'écosystème
      sait faire de mieux — et qu'il abandonne dès qu'un chiffre rond devient partageable.
    </p>
    ${verdictBox("ratio120")}
    ${verdictBox("tpe-paiement")}
  </div>
</section>

<section class="section">
  <div class="wrap wrap-n prose">
    <h2 id="lead-dexing">Le lead-dexing : là où la méthode devient un problème</h2>
    <p>
      Le <b>lead-dexing</b> — contraction de <em>lead</em> et <em>indexing</em> — consiste à publier une fiche
      nominative très structurée sur une personne, puis à en forcer l'indexation pour occuper les
      recherches organiques associées à son nom. L'objectif déclaré est de déclencher une alerte chez
      la cible et de mesurer sa « réactivité informationnelle ».
    </p>
    <p>
      L'écosystème qualifie la pratique de « bienveillante, zéro dénigrement », au motif que le ton est
      clinique et les faits sourcés. Cette qualification est celle de ses auteurs ; ce n'est pas un constat.
      Et elle escamote la seule question qui compte : <b>le rapport de force</b>.
    </p>
    <p>
      Sur un∙e président∙e de parti, c'est du commentaire politique ordinaire, et c'est parfaitement
      légitime : une personne qui exerce un pouvoir public accepte que son action soit documentée.
      Sur une chargée de stratégie numérique sans mandat électif, la situation est différente en nature,
      pas en degré. Une organisation qui publie peut absorber une fiche indexée ; une personne seule
      découvre que la première page de résultats sur son nom lui a été retirée par un tiers qu'elle ne
      connaît pas. Le ton clinique ne corrige pas cette asymétrie — il la rend seulement plus difficile
      à contester.
    </p>
    <p>
      Le point de blocage n'est même pas éthique, il est procédural : <b>aucun droit de réponse,
      aucune procédure de retrait, aucun délai de correction ne sont publiés</b>. C'est le prérequis
      minimal de toute publication nominative, et il précède le débat sur l'efficacité de la méthode.
      C'est aussi la raison pour laquelle ce site ne reproduit ni ne relaie ces fiches.
    </p>
    ${verdictBox("doc-leaddexing")}
  </div>
</section>

<section class="section">
  <div class="wrap wrap-n prose">
    <h2 id="modeles">Quand la métaphore se déguise en équation</h2>
    <p>
      L'écosystème formalise la propagation d'une information politique par une formule :
      la viralité serait proportionnelle au produit de l'émotion, de la résonance identitaire et de
      l'efficacité du format, divisé par la résistance cognitive du récepteur.
    </p>
    <p>
      Comme heuristique éditoriale, c'est utile : elle rappelle qu'un fait ne circule pas tout seul.
      Comme équation, elle ne fonctionne pas — aucune des quatre variables n'est définie par un protocole
      de mesure, donc le rapport n'est pas calculable. Le « +287 % d'engagement » qui l'accompagne n'est
      rattaché ni à un corpus, ni à une période, ni à un groupe témoin.
    </p>
    <p>
      Mettre une intuition en notation mathématique lui donne l'autorité du calcul sans en accepter
      les contraintes. Pour un projet dont l'argument central est que <em>l'État maquille des choix
      politiques en nécessités comptables</em>, c'est la contradiction la plus coûteuse du corpus.
    </p>
    ${verdictBox("doc-connardovirus")}
  </div>
</section>

<section class="section">
  <div class="wrap wrap-n prose">
    <h2 id="furtivite">La furtivité qui n'en est pas une</h2>
    <p>
      L'architecture interne présente <b>yannkeep</b> comme un « fantôme numérique », compartimenté par
      choix d'OPSEC face à la vitrine publique <b>ouaisfieu</b>. La réalité observable est plus simple :
      les 61 dépôts sont publics, listés par l'API GitHub, catalogués par NEXUS, et 60 répondent.
    </p>
    <p>
      Ce n'est pas de la furtivité. C'est un déficit d'indexation — absence de sitemap, canonicals
      incomplets, aucun lien entrant externe. Requalifier un problème de découvrabilité en stratégie
      de sécurité a un coût précis : <b>cela empêche de le corriger</b>, puisqu'un symptôme devient
      une intention.
    </p>
    <p>
      Le coût est d'autant plus élevé que yannkeep héberge certaines des meilleures pièces du corpus :
      « Le prix de la justice », le dossier GRECO, le « Dossier zéro » sur l'éducation permanente,
      le laboratoire GEO. Les cacher n'est pas un avantage tactique : c'est une perte sèche.
    </p>
    ${verdictBox("doc-yannkeep")}
    ${verdictBox("doc-ping")}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 id="bilan">Bilan doctrinal</h2>
    <div class="grid g-2" style="margin-top:2rem;align-items:start">
      <div class="panel" style="border-top:2px solid var(--st-good)">
        <p class="kicker" style="color:var(--st-good)">✔ À conserver</p>
        <ul class="num-list" style="margin-top:1rem">
          <li><b>Le déplacement vers l'index.</b> Un corpus structuré travaille en continu ; un plateau télé dure sept minutes.</li>
          <li><b>Le JSON-LD comme infrastructure civique.</b> Déclarer des relations plutôt que des adjectifs.</li>
          <li><b>Le statique comme choix politique.</b> Sobriété défensive, et vérifiable.</li>
          <li><b>Le patron GRECO / TPE / Non-recours.</b> Dire ce que les chiffres ne prouvent pas est ce qui donne du poids à ce qu'ils prouvent.</li>
        </ul>
      </div>
      <div class="panel" style="border-top:2px solid var(--st-critical)">
        <p class="kicker" style="color:var(--st-critical)">✕ À abandonner</p>
        <ul class="num-list" style="margin-top:1rem">
          <li><b>Le Ratio 120 comme ratio.</b> L'argument politique survit sans le calcul ; le calcul ne survit pas à l'examen.</li>
          <li><b>Le lead-dexing sans droit de réponse.</b> La procédure précède la doctrine.</li>
          <li><b>Les équations non mesurables.</b> Une métaphore ne gagne rien à porter une barre de fraction.</li>
          <li><b>La furtivité revendiquée.</b> Elle transforme un défaut réparable en identité.</li>
        </ul>
      </div>
    </div>
    <div class="note ok" style="margin-top:2rem;max-width:80ch">
      <b>Contrepoint, parce qu'il doit être obligatoire.</b> Le meilleur dossier institutionnel de l'archipel,
      « Failles belges », reconnaît explicitement que la Belgique reste une démocratie constitutionnelle
      avant d'en décrire les blocages. Ce geste — poser l'objection la plus forte contre soi-même avant
      de conclure — est ce qui sépare un dossier d'un tract. Il devrait être obligatoire sur chaque
      page du corpus, y compris sur celle-ci.
    </div>
    <div style="margin-top:2.5rem">
      ${share({ url, title: "La doctrine de l'archipel, et ce qui résiste au contrôle", text: "Lead-dexing, Ratio 120, guerre cognitive : ce qui tient et ce qui casse." })}
    </div>
  </div>
</section>`;

  emit("doctrine", page({
    title: "Doctrine",
    desc: "Lead-dexing, Ratio 120, modélisation de la viralité, furtivité revendiquée : ce que l'archipel Ouaisfieu × Yannkeep théorise, et ce qui survit à la vérification. Analyse argumentée, étiquetée comme telle.",
    path: "doctrine/", depth: 1, active: "doctrine", jsonld, og: "og-doctrine.png", body, type: "Article"
  }), { priority: 0.8, changefreq: "monthly" });
}
