/* Registre de claims — met en œuvre la recommandation P1 du rapport critique :
   « Pour chaque affirmation sensible : valeur, date, source, juridiction,
     confiance, statut (établi, allégué, estimé, hypothèse, corrigé). » */

export const STATUS = {
  etabli:    { label: "Établi",    role: "good",     glyph: "✔", rating: 5, order: 1,
               def: "Vérifié sur source primaire ou institutionnelle accessible et datée." },
  estime:    { label: "Estimé",    role: "good",     glyph: "≈", rating: 4, order: 2, hollow: true,
               def: "Ordre de grandeur méthodologiquement assumé, avec fourchette et périmètre affichés." },
  projete:   { label: "Projeté",   role: "warn",     glyph: "→", rating: 3, order: 3,
               def: "Projection ou scénario. Ne décrit pas un fait constaté." },
  allegue:   { label: "Allégué",   role: "warn",     glyph: "?", rating: 2, order: 4, hollow: true,
               def: "Affirmé par l'écosystème sans source primaire publiquement vérifiable." },
  hypothese: { label: "Hypothèse", role: "serious",  glyph: "∿", rating: 2, order: 5, hollow: true,
               def: "Modèle ou intuition non falsifiable en l'état : variables non définies, protocole absent." },
  conteste:  { label: "Contesté",  role: "serious",  glyph: "≠", rating: 1, order: 6,
               def: "Chiffres exacts, mais rapprochement méthodologiquement invalide." },
  errone:    { label: "Erroné",    role: "critical", glyph: "✕", rating: 0, order: 7,
               def: "Contredit par la source officielle. Correction prioritaire (P0)." }
};

export const ROLES = {
  good:     { color: "var(--st-good)",     ink: "var(--st-good-ink)",     cls: "st-good",     label: "Fiable" },
  warn:     { color: "var(--st-warn)",     ink: "var(--st-warn-ink)",     cls: "st-warn",     label: "À qualifier" },
  serious:  { color: "var(--st-serious)",  ink: "var(--st-serious-ink)",  cls: "st-serious",  label: "Fragile" },
  critical: { color: "var(--st-critical)", ink: "var(--st-critical-ink)", cls: "st-critical", label: "Défaillant" }
};

export const CLAIMS = [
  // ── L'archipel lui-même ────────────────────────────────────────────
  { id: "arch-226", repos: ["yannkeep/nexus"], theme: "Archipel", status: "etabli", conf: "haute",
    claim: "226 dépôts des comptes ouaisfieu et yannkeep ont GitHub Pages activé.",
    value: "226", scope: "GitHub · comptes ouaisfieu + yannkeep", date: "2026-08-26",
    verdict: "Recompté ligne à ligne sur l'appendice du rapport : 226 racines, dont 165 ouaisfieu et 61 yannkeep. Les neuf totaux thématiques concordent au chiffre près.",
    src: [["Rapport critique, appendice — inventaire des 226 racines", null]] },

  { id: "arch-214", repos: ["ouaisfieu/1test1", "ouaisfieu/aegis", "ouaisfieu/alice", "ouaisfieu/biologia", "ouaisfieu/ciaoword", "ouaisfieu/duckface-detector", "ouaisfieu/gandalf", "ouaisfieu/nixo", "ouaisfieu/oxo", "ouaisfieu/pages", "ouaisfieu/zip", "yannkeep/vrac"], theme: "Archipel", status: "etabli", conf: "haute",
    claim: "214 racines répondent HTTP 200 ; 12 renvoient une erreur 404.",
    value: "214 / 12", scope: "Contrôle HTTP des racines", date: "2026-08-26",
    verdict: "« Pages activé » n'est pas « page en ligne ». Les 12 racines mortes sont nommées et corrigeables en une session : 1test1, aegis, alice, biologia, ciaoword, duckface-detector, gandalf, nixo, oxo, pages, zip (ouaisfieu) et vrac (yannkeep).",
    src: [["Rapport critique — §3.1 et recommandation P0-2", null]] },

  { id: "arch-341", repos: ["yannkeep/nexus", "ouaisfieu/portail", "ouaisfieu/hub"], theme: "Archipel", status: "conteste", conf: "haute",
    claim: "L'archipel compterait 341 publications.",
    value: "341 entrées catalogables", scope: "NEXUS + relevé du 26/08", date: "2026-08-26",
    verdict: "Le nombre est exact comme total d'entrées catalogables (226 racines + 115 sous-pages). Il est trompeur comme nombre d'œuvres : une racine de projet, une sous-page de dossier, un alias narratif, un miroir et un banc d'essai ne sont pas cinq publications équivalentes. 24 groupes de titres strictement identiques couvrent à eux seuls 52 racines.",
    src: [["Rapport critique — « Réponse directe » et §5.2", null]] },

  { id: "arch-canonical", repos: ["ouaisfieu/party"], theme: "Archipel", status: "errone", conf: "haute",
    claim: "Les racines de l'archipel déclarent des URL canoniques exploitables.",
    value: "canonical → https://www.example.com/", scope: "HTML de la racine", date: "2026-08-26",
    verdict: "97 racines sur 214 seulement déclarent un rel=canonical — et l'une d'elles, ouaisfieu/party, pointe le sien vers le domaine de démonstration www.example.com. Tout moteur qui respecte la directive est donc invité à créditer un autre site. Sur un corpus qui compte 24 groupes de titres identiques, l'absence de canonique n'est pas un détail : c'est ce qui décide quelle version fait autorité. Correction P0, coût : une ligne.",
    src: [["Rapport critique — §5.2", null], ["Google Search Central — Consolider les URL dupliquées", "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"]] },

  { id: "arch-licence", repos: ["ouaisfieu/ccplc", "ouaisfieu/tech"], theme: "Archipel", status: "errone", conf: "haute",
    claim: "CC BY-NC 4.0 est une « licence libre ».",
    value: "BY-NC ≠ libre", scope: "Charte CCPLC", date: "2026-08-26",
    verdict: "Creative Commons est explicite : seules CC BY et CC BY-SA sont approuvées pour les œuvres culturelles libres ; la clause NC en exclut BY-NC, précisément parce qu'elle interdit certains usages selon leur finalité. Choisir NC est légitime ; l'appeler « libre » ne l'est pas. Formulation correcte : « licence Creative Commons avec restriction non commerciale ».",
    src: [["Creative Commons — Understanding Free Cultural Works", "https://creativecommons.org/public-domain/freeworks/"]] },

  { id: "arch-meta", theme: "Archipel", status: "etabli", conf: "haute",
    claim: "1 seul dépôt sur 226 expose au moins un topic GitHub ; 172 n'ont aucune licence détectée.",
    value: "1 topic · 11 descriptions · 21 homepages · 172 sans licence", scope: "API GitHub", date: "2026-08-26",
    verdict: "Paradoxe le plus coûteux de l'archipel : un écosystème qui revendique le code ouvert et la forkabilité rend ses dépôts invisibles au moteur de recherche de GitHub lui-même. Ce sont 226 formulaires de trois champs.",
    src: [["Rapport critique — §5.3", null]] },

  { id: "arch-scripts", theme: "Archipel", status: "estime", conf: "moyenne",
    claim: "80 % des racines accessibles ne chargent aucun script externe absolu.",
    value: "171 / 214", scope: "Inspection du HTML initial", date: "2026-08-26",
    verdict: "Signal réel de sobriété, mais ce n'est pas un audit d'exécution : un script local peut appeler un service tiers après interaction. La promesse « zéro tracking » reste donc plausible et non prouvée tant qu'aucun inventaire réseau n'est publié.",
    src: [["Rapport critique — §4.3 et §5.7", null]] },

  // ── Justice & intégrité ────────────────────────────────────────────
  { id: "greco-nc", repos: ["ouaisfieu/greco-belgique", "yannkeep/greco-belgique"], theme: "Justice & intégrité", status: "etabli", conf: "haute",
    claim: "La Belgique est en procédure de non-conformité au 5ᵉ cycle d'évaluation du GRECO.",
    value: "Non-conformité", scope: "Conseil de l'Europe · Belgique", date: "2025-11-21",
    verdict: "Constat posé à la 101ᵉ plénière du GRECO le 21 novembre 2025 : la Belgique « ne se conforme pas suffisamment » aux normes anticorruption. Échéance de rapport de progrès fixée au 30 novembre 2026.",
    src: [["GRECO Belgique — dossier citoyen (vérifié le 13/08/2026)", "https://ouaisfieu.github.io/greco-belgique/"], ["GRECO — Conseil de l'Europe", "https://www.coe.int/en/web/greco"]] },

  { id: "greco-22", repos: ["ouaisfieu/greco-belgique", "yannkeep/greco-belgique"], theme: "Justice & intégrité", status: "etabli", conf: "haute",
    claim: "8 des 22 recommandations du GRECO sont mises en œuvre ; 10 partiellement, 4 pas du tout.",
    value: "8 / 10 / 4 sur 22", scope: "5ᵉ cycle · Belgique", date: "2026-08-13",
    verdict: "L'asymétrie est le vrai résultat : l'État a su réformer l'intégrité de la police fédérale et de la magistrature, mais pas la déontologie de l'exécutif — cabinets ministériels, déclarations de patrimoine, pantouflage, lobbying. Les 4 recommandations ignorées portent sur la consultation publique et les déclarations de patrimoine.",
    src: [["GRECO Belgique — dossier citoyen", "https://ouaisfieu.github.io/greco-belgique/"]] },

  { id: "greco-5150", repos: ["ouaisfieu/greco-belgique", "yannkeep/greco-belgique"], theme: "Justice & intégrité", status: "etabli", conf: "moyenne",
    claim: "En 2026, 5 parlementaires fédéraux sur 150 ont suivi la formation aux conflits d'intérêts.",
    value: "5 / 150", scope: "Chambre des représentants", date: "2026-08-13",
    verdict: "Chiffre relayé par le dossier citoyen d'après la Commission fédérale de déontologie. Source secondaire : à recontrôler sur le rapport d'activité primaire avant toute reprise. S'il tient, c'est l'indicateur comportemental le plus parlant du dossier.",
    src: [["GRECO Belgique — dossier citoyen", "https://ouaisfieu.github.io/greco-belgique/"]] },

  { id: "cp-576", repos: ["ouaisfieu/qatargate"], theme: "Justice & intégrité", status: "errone", conf: "haute",
    claim: "Le nouveau Code pénal crée une incrimination spécifique d'ingérence étrangère aux articles 576 à 606.",
    value: "art. 576-606", scope: "Livre II du nouveau Code pénal belge", date: "2026-08-26",
    verdict: "Matériellement faux. Le Livre II officiel intitule les articles 576 à 596 « infractions concernant les secrets d'État », les articles 597 à 600 « dénonciation à l'ennemi » et les articles 601 à 606 « recel d'ennemis ou d'auteurs d'infractions contre la défense nationale ». L'erreur figure dans un dossier qui nomme des personnes et interprète une procédure pénale en cours : c'est la correction P0 numéro un de l'archipel.",
    src: [["Livre II du nouveau Code pénal — loi du 29 février 2024, Moniteur belge", "https://www.ejustice.just.fgov.be/"], ["Rapport critique — §5.5", null]] },

  { id: "cp-vigueur", repos: ["ouaisfieu/qatargate", "ouaisfieu/droit"], theme: "Justice & intégrité", status: "etabli", conf: "haute",
    claim: "Le nouveau Code pénal belge entre en vigueur le 1ᵉʳ septembre 2026.",
    value: "01/09/2026", scope: "SPF Justice", date: "2026-03-20",
    verdict: "Report confirmé par le SPF Justice le 20 mars 2026. C'est le seul élément de la page Qatargate qui résiste au contrôle sur ce point précis.",
    src: [["SPF Justice — entrée en vigueur reportée", "https://justice.belgium.be/"]] },

  { id: "tpe-167", repos: ["yannkeep/tpe", "ouaisfieu/transaction-penale"], theme: "Justice & intégrité", status: "etabli", conf: "haute",
    claim: "167 transactions fiscales ont été enregistrées entre 2017 et 2023, pour 148,35 M€ recouvrés.",
    value: "167 · 148,35 M€", scope: "Belgique · 2017-2023", date: "2026-08-07",
    verdict: "Chiffres exposés avec leur périmètre par « Le prix de la justice », le dossier le plus rigoureux de l'archipel. Répartition territoriale très concentrée : Gand 68 %, Anvers 14 %, Bruxelles 12 %, Liège 6 % — ce qui documente des priorités de parquet, pas une géographie de la fraude.",
    src: [["Le prix de la justice — yannkeep", "https://yannkeep.github.io/tpe/"]] },

  { id: "tpe-vat", repos: ["yannkeep/tpe"], theme: "Justice & intégrité", status: "estime", conf: "haute",
    claim: "Le VAT gap belge est estimé à 12,3 % en 2023.",
    value: "12,3 %", scope: "TVA · Belgique · 2023", date: "2026-08-07",
    verdict: "Indicateur d'écart de conformité TVA. Il mesure l'écart entre recettes théoriques et perçues — pas la fraude intentionnelle. Le confondre avec « la fraude » est l'erreur que le dossier refuse explicitement de commettre.",
    src: [["Le prix de la justice — yannkeep", "https://yannkeep.github.io/tpe/"]] },

  { id: "tpe-paiement", repos: ["yannkeep/tpe", "ouaisfieu/justices"], theme: "Justice & intégrité", status: "etabli", conf: "moyenne",
    claim: "La première cause d'échec d'une négociation de transaction pénale est l'incapacité du suspect à payer.",
    value: "cause n°1", scope: "Cour des comptes, 2025", date: "2026-08-07",
    verdict: "Retournement décisif : la transaction pénale n'est pas d'abord un privilège offert, c'est un dispositif dont l'accès est conditionné par la solvabilité. C'est une hypothèse testable sur l'égalité devant la loi, pas un slogan.",
    src: [["Le prix de la justice — yannkeep", "https://yannkeep.github.io/tpe/"]] },

  { id: "ratio120", repos: ["yannkeep/tpe", "ouaisfieu/fraude", "ouaisfieu/justice"], theme: "Droits sociaux", status: "conteste", conf: "haute",
    claim: "La fraude fiscale est 120 fois supérieure à la fraude sociale (30 Md€ contre 250 M€).",
    value: "ratio 120", scope: "Belgique", date: "2026-08-26",
    verdict: "Le rapprochement met en regard un montant ESTIMÉ à périmètre large (fraude fiscale) et un montant DÉTECTÉ à périmètre étroit (fraude sociale). Diviser l'un par l'autre ne produit pas un ratio, mais une comparaison de deux instruments de mesure différents. L'argument politique — l'asymétrie des moyens de contrôle — tient sans ce calcul ; le calcul, lui, ne tient pas. L'écosystème se contredit d'ailleurs lui-même : « Le prix de la justice » rejette nommément cette « arithmétique spectrale » qui additionne tax gap, économie souterraine et sanctions.",
    src: [["Le prix de la justice — yannkeep (contre-exemple interne)", "https://yannkeep.github.io/tpe/"], ["Rapport critique — §5.5", null]] },

  // ── Droits sociaux ─────────────────────────────────────────────────
  { id: "nr-fourchettes", repos: ["ouaisfieu/non-recours"], theme: "Droits sociaux", status: "estime", conf: "haute",
    claim: "Le non-recours au revenu d'intégration est estimé entre 37 % et 51 % (2019).",
    value: "37-51 %", scope: "Revenu d'intégration · Belgique · 2019", date: "2026-08-24",
    verdict: "Modèle de discipline méthodologique : l'observatoire refuse le « taux national magique », sépare les périmètres et affiche les fourchettes. Deux autres ordres de grandeur y sont distingués — 2 à 8 % pour les droits dérivés automatiques, 58 à 68 % pour les droits exigeant une démarche active. C'est le patron que le reste de l'archipel devrait copier.",
    src: [["Le non-recours aux droits en Belgique", "https://ouaisfieu.github.io/non-recours/"]] },

  { id: "nr-165", repos: ["ouaisfieu/non-recours"], theme: "Droits sociaux", status: "etabli", conf: "haute",
    claim: "16,5 % de la population belge est en risque de pauvreté ou d'exclusion sociale (2025).",
    value: "16,5 %", scope: "Belgique · indicateur AROPE", date: "2026-08-24",
    verdict: "Indicateur statistique officiel, cité avec son millésime. À ne pas confondre avec le taux de non-recours, qui mesure autre chose : l'écart entre droit ouvert et droit reçu.",
    src: [["Le non-recours aux droits en Belgique", "https://ouaisfieu.github.io/non-recours/"]] },

  { id: "nr-cinq", repos: ["ouaisfieu/non-recours"], theme: "Droits sociaux", status: "etabli", conf: "haute",
    claim: "Le non-recours se décompose en cinq mécanismes distincts.",
    value: "5 catégories", scope: "Cadre d'analyse", date: "2026-08-24",
    verdict: "Non-connaissance, non-demande, non-réception, non-proposition, exclusion du droit. L'apport réel n'est pas un chiffre : c'est le déplacement de la cause, de l'échec individuel vers la friction institutionnelle.",
    src: [["Le non-recours aux droits en Belgique", "https://ouaisfieu.github.io/non-recours/"]] },

  { id: "soc-184463", repos: ["ouaisfieu/arizona", "yannkeep/arizona", "ouaisfieu/trap"], theme: "Droits sociaux", status: "projete", conf: "moyenne",
    claim: "184 463 personnes seraient exclues du chômage d'ici 2027.",
    value: "184 463", scope: "Réforme du chômage · Belgique", date: "2026-08-26",
    verdict: "Projection, pas constat. Sa précision à l'unité près lui donne l'apparence d'un dénombrement administratif alors qu'elle dépend d'hypothèses de comportement, de calendrier et de recours. À publier avec sa fourchette, son modèle et sa date de gel — ou à arrondir.",
    src: [["Ontologie sémantique de l'écosystème, via le rapport critique", null]] },

  { id: "soc-975243", repos: ["ouaisfieu/app", "ouaisfieu/constellation", "ouaisfieu/ecp", "yannkeep/cpas-belgique"], theme: "Droits sociaux", status: "allegue", conf: "basse",
    claim: "975 243 personnes seraient « piégées » par la réforme Arizona.",
    value: "975 243", scope: "Belgique", date: "2026-08-26",
    verdict: "Chiffre affiché en titre de deux racines (ouaisfieu/app et ouaisfieu/constellation) sans méthode publiée ni définition du « piège ». Un nombre à six chiffres significatifs sans dénominateur ni source est une affirmation, pas une mesure.",
    src: [["ouaisfieu/app et ouaisfieu/constellation — titres relevés", null]] },

  // ── Doctrine ───────────────────────────────────────────────────────
  { id: "doc-ping", repos: ["ouaisfieu/ping"], theme: "Doctrine", status: "projete", conf: "basse",
    claim: "Le « Ping Ultime » du 15 février 2026 devait saturer l'espace algorithmique national.",
    value: "15/02/2026", scope: "Opération annoncée", date: "2026-08-26",
    verdict: "Six mois après la date annoncée, le relevé externe ne trouve aucune reprise académique, journalistique ou associative de l'archipel. L'opération est documentée comme intention ; aucun effet mesurable n'est établi. Un objectif daté qui passe sans bilan public devrait être clos par un bilan public.",
    src: [["Rapport critique — §5.9 et §1.3", null]] },

  { id: "doc-leaddexing", repos: ["ouaisfieu/bxl2030"], theme: "Doctrine", status: "allegue", conf: "moyenne",
    claim: "Le « lead-dexing » est une tactique bienveillante, « zéro dénigrement ».",
    value: "auto-qualification", scope: "Doctrine CCPLC", date: "2026-08-26",
    verdict: "La qualification est celle de ses auteurs, pas un constat. La méthode consiste à publier une fiche nominative pour parasiter les recherches organiques liées à une personne. Sur un∙e président∙e de parti, c'est du commentaire politique ordinaire. Sur une chargée de stratégie numérique sans mandat électif, le rapport de force est asymétrique et le ton clinique ne le corrige pas. Aucun droit de réponse ni procédure de retrait n'est publié : c'est le prérequis minimal, avant même le débat sur l'efficacité.",
    src: [["Rapport critique — §6, chapitre lead-dexing", null]] },

  { id: "doc-connardovirus", repos: ["ouaisfieu/tona"], theme: "Doctrine", status: "hypothese", conf: "basse",
    claim: "La viralité obéit à V = (E × I × F) / R et un thread ultra-documenté génère +287 % d'engagement.",
    value: "+287 %", scope: "Modèle interne", date: "2026-08-26",
    verdict: "La formule est une métaphore mise en équation : aucune de ses quatre variables n'est définie par un protocole de mesure, donc le rapport n'est pas calculable. Le +287 % n'est rattaché ni à un corpus, ni à une période, ni à un groupe témoin. Utile comme heuristique éditoriale, inutilisable comme résultat.",
    src: [["Rapport critique — §6", null]] },

  { id: "doc-batman", repos: ["ouaisfieu/biologia"], theme: "Doctrine", status: "allegue", conf: "basse",
    claim: "Un mot de passe de coffre de recherche aurait été publié en clair sur un blog public.",
    value: "non vérifiable", scope: "Audit interne TANGO", date: "2026-08-26",
    verdict: "Affirmation issue de l'audit interne. La racine concernée (ouaisfieu/biologia) répond aujourd'hui 404 : la vérification indépendante est impossible en l'état. Deux conséquences, quelle que soit l'issue : la rotation du secret est à traiter comme faite ou à faire, et un secret ne se documente pas dans un rapport public.",
    src: [["Audit TANGO, via le rapport critique — §8", null]] },

  { id: "doc-yannkeep", repos: ["yannkeep/nexus", "yannkeep/github.io", "yannkeep/yannkeep.github.io", "yannkeep/geo"], theme: "Doctrine", status: "conteste", conf: "moyenne",
    claim: "yannkeep est un « fantôme numérique » invisible, choix d'OPSEC délibéré.",
    value: "61 dépôts publics", scope: "GitHub", date: "2026-08-26",
    verdict: "Les 61 dépôts sont publics, listés par l'API, catalogués par NEXUS et accessibles à 60/61. Ce n'est pas de la furtivité, c'est un déficit d'indexation — l'absence de sitemap, de canonicals et de liens entrants. Requalifier un problème de découvrabilité en stratégie de sécurité empêche de le corriger. Et yannkeep héberge quelques-uns des meilleurs dossiers du corpus (TPE, GRECO, dossier zéro) : les cacher n'est pas un avantage tactique, c'est une perte sèche.",
    src: [["Rapport critique — §3.1 et §5.9", null]] }
];

export const FAQ = [
  { q: "Qu'est-ce que l'archipel Ouaisfieu × Yannkeep ?",
    a: "Un ensemble de 226 sites statiques publiés sur GitHub Pages par deux comptes liés, consacrés à la politique belge, aux droits sociaux, à la justice et à l'éducation permanente. 214 racines répondaient au 26 août 2026. C'est moins une collection de sites qu'un atelier de prototypage citoyen : NEXUS y classe 83 laboratoires pour 48 corpus documentaires." },
  { q: "Pourquoi ce site s'appelle-t-il 227 ?",
    a: "Parce que le rapport critique conclut que « la prochaine avancée n'est pas un 227ᵉ site ». En voici un quand même — mais il n'ajoute aucun contenu à l'archipel : il le trie, le date, le note et le contredit. Il applique à l'archipel les recommandations que l'audit adresse à l'archipel." },
  { q: "Le site accuse-t-il quelqu'un ?",
    a: "Non. 227 évalue des publications, pas des personnes. Les affaires judiciaires citées le sont via des sources institutionnelles, avec la présomption d'innocence pour toute personne visée par une procédure. Les fiches nominatives de « lead-dexing » ne sont ni reproduites ni relayées ici, et la pratique est discutée comme méthode." },
  { q: "D'où viennent les chiffres ?",
    a: "De deux rapports critiques datés du 26 août 2026 (inventaire GitHub, contrôle HTTP des 226 racines, catalogue NEXUS du 25 août), recoupés par consultation directe des dossiers GRECO, Non-recours et TPE. Chaque affirmation sensible porte un statut dans le registre de claims." },
  { q: "Le site collecte-t-il des données ?",
    a: "Aucune. Zéro requête réseau sortante, zéro police externe, zéro traceur, zéro cookie. Les préférences (thème, contraste, favoris, cases cochées) restent dans le localStorage du navigateur et ne sortent jamais de l'appareil. La promesse est vérifiable : ouvrez l'onglet Réseau de votre navigateur." },
  { q: "Peut-on réutiliser ces données ?",
    a: "Oui. Le catalogue des 226 racines et le registre de claims sont téléchargeables en JSON et en CSV depuis l'atlas. Contenu en CC BY 4.0, code en MIT, données en ODbL — trois licences distinctes, conformément à la recommandation P2 du rapport." }
];
