export const PLAN = [
  { p: "P0", title: "Corriger le risque de confiance", why: "Ce qui peut tromper un lecteur, un moteur ou une IA aujourd'hui.", cost: "Quelques heures", items: [
    { id: "p0-1", t: "Corriger et republier Qatargate", d: "Retirer la qualification erronée des articles 576-606, vérifier chaque article cité, ajouter sources primaires, méthode, date d'arrêt du corpus, statuts judiciaires et présomption d'innocence.", tag: "juridique" },
    { id: "p0-2", t: "Réparer ou désactiver les 12 racines 404", d: "ouaisfieu : 1test1, aegis, alice, biologia, ciaoword, duckface-detector, gandalf, nixo, oxo, pages, zip — yannkeep : vrac. Désactiver Pages vaut mieux qu'une 404 indexée.", tag: "technique" },
    { id: "p0-3", t: "Corriger le canonical de ouaisfieu/party", d: "Il pointe vers https://www.example.com/. Une ligne de HTML.", tag: "technique" },
    { id: "p0-4", t: "Étiqueter tous les contenus", d: "Un champ obligatoire par page : dossier vérifié, analyse/opinion, prospective, simulation, fiction, satire, prototype, archive, miroir. Lisible par un humain ET par une machine.", tag: "éditorial" },
    { id: "p0-5", t: "Clarifier CCPLC", d: "Trois CCPLC coexistent : la marque avec ses tarifs, la doctrine civique et la fiction organisationnelle. Séparer l'offre réelle, la structure de fait, la fiction et les démos ; nommer l'entité responsable.", tag: "éditorial" },
    { id: "p0-6", t: "Publier un droit de réponse et une procédure de retrait", d: "Toute page nommant une personne doit exposer un contact, un délai de réponse et une politique de correction datée.", tag: "juridique" }
  ]},
  { p: "P1", title: "Faire de NEXUS un registre éditorial", why: "Une seule porte d'entrée qui fait autorité, au lieu de trois qui se concurrencent.", cost: "Quelques jours", items: [
    { id: "p1-1", t: "Désigner NEXUS comme source canonique unique", d: "Hub et Portail deviennent des archives, avec lien visible vers NEXUS et rel=canonical.", tag: "architecture" },
    { id: "p1-2", t: "Automatiser l'inventaire chaque nuit", d: "API GitHub + test HTTP + titre + canonical + date de revue + statut éditorial, avec historique public des changements. Une GitHub Action suffit.", tag: "technique" },
    { id: "p1-3", t: "Créer trois anneaux", d: "Références (8 à 12 dossiers maintenus) · Laboratoire (prototypes) · Archives (versions anciennes et miroirs). Un projet appartient à un seul anneau.", tag: "architecture" },
    { id: "p1-4", t: "Dédupliquer les 23 groupes de titres", d: "Une URL canonique par groupe ; redirection si possible, sinon rel=canonical ou noindex sur les copies. 50 racines concernées, dont 7 groupes à cheval sur les deux comptes.", tag: "seo" },
    { id: "p1-5", t: "Compléter les métadonnées GitHub", d: "Description, homepage, topics, licence, README, statut, date de dernière revue et lien NEXUS sur chacun des 226 dépôts. Aujourd'hui : 11 descriptions et 1 topic.", tag: "seo" },
    { id: "p1-6", t: "Adopter le patron GRECO / TPE / Non-recours", d: "Toute publication à enjeu contient : réponse courte, faits, interprétation, objections, sources primaires, limites, date, auteur humain/IA, procédure de correction.", tag: "éditorial" },
    { id: "p1-7", t: "Publier un registre de claims", d: "Pour chaque affirmation sensible : valeur, date, source, juridiction, confiance et statut (établi, allégué, estimé, hypothèse, corrigé).", tag: "éditorial", done: true, doneNote: "Prototype fonctionnel : le registre de ce site." },
    { id: "p1-8", t: "Séparer données, texte et visualisation", d: "JSON/CSV versionné, page Sources, transformations documentées, visualisation reproductible.", tag: "architecture", done: true, doneNote: "Démontré ici : catalogue JSON + CSV exportables." },
    { id: "p1-9", t: "Créer une politique d'usage de l'IA", d: "Modèle utilisé, rôle, documents fournis, vérifications humaines, limites, date de génération, historique des corrections.", tag: "éditorial", done: true, doneNote: "Voir la page Méthode." }
  ]},
  { p: "P2", title: "Rendre l'ensemble durable et accessible", why: "Ce qui transforme une accumulation en infrastructure.", cost: "Quelques semaines", items: [
    { id: "p2-1", t: "Généraliser un head commun", d: "Titre spécifique, description, canonical, image OG, données structurées pertinentes, sitemap. llms.txt en complément, jamais en substitut du HTML.", tag: "seo" },
    { id: "p2-2", t: "Prévoir un contenu de secours", d: "Chaque application doit offrir une page HTML lisible sans JavaScript : objectif, données, méthode, mode d'emploi, confidentialité. 42 racines n'exposent aucun lien dans leur HTML initial, 44 moins de cent mots.", tag: "a11y" },
    { id: "p2-3", t: "Auditer l'accessibilité de dix projets phares", d: "Clavier, focus, lecteur d'écran, contraste, animations, erreurs, mobile, impression. Publier les résultats ET le plan de correction.", tag: "a11y" },
    { id: "p2-4", t: "Transformer les promesses de confidentialité en preuves", d: "Inventaire réseau, dépendances, stockage, effacement, export, politique de version. « Fonctionne localement » n'équivaut pas à « RGPD by design ».", tag: "a11y" },
    { id: "p2-5", t: "Harmoniser les licences", d: "Contenu en CC BY ou BY-SA si « libre » est revendiqué ; BY-NC décrite comme licence avec restriction ; code en MIT ou AGPL ; données sous licence explicite.", tag: "juridique" },
    { id: "p2-6", t: "Chercher une relecture externe", d: "Une personne du secteur, une juriste, une chercheuse ou un organisme concerné par dossier phare. Publier le nom avec accord, et conserver les désaccords.", tag: "éditorial" }
  ]}
];

export const PORTFOLIO = [
  { n: 1,  t: "NEXUS", url: "https://yannkeep.github.io/nexus/", role: "Catalogue canonique", why: "Publie sa méthode, son catalogue JSON, ses filtres, et sépare projets et sous-pages. La brique la plus solide de l'archipel." },
  { n: 2,  t: "DOCTech", url: "https://ouaisfieu.github.io/tech/", role: "Base de connaissances", why: "Pilarisation, particratie, complexité fédérale : le socle conceptuel long terme, indexable et compilé." },
  { n: 3,  t: "Le non-recours aux droits", url: "https://ouaisfieu.github.io/non-recours/", role: "Modèle droits sociaux", why: "Refuse le taux national unique, sépare les périmètres, affiche les fourchettes, renvoie vers les portes officielles." },
  { n: 4,  t: "GRECO Belgique", url: "https://ouaisfieu.github.io/greco-belgique/", role: "Modèle sources & limites", why: "Hiérarchise les sources, signale les traductions et les incertitudes, écarte un chiffre faute de preuve, déclare l'intervention de l'IA." },
  { n: 5,  t: "Le prix de la justice (TPE)", url: "https://yannkeep.github.io/tpe/", role: "Modèle réflexif", why: "Refuse d'additionner des indicateurs incompatibles et démonte trois raisonnements séduisants mais faux — dont un que l'archipel utilise ailleurs." },
  { n: 6,  t: "Éducation permanente", url: "https://ouaisfieu.github.io/education-permanente/", role: "Dossier sectoriel", why: "Relie textes officiels FWB, acteurs et enjeux récents dans une architecture à chapitres." },
  { n: 7,  t: "Observation", url: "https://yannkeep.github.io/observation/", role: "Veille & scénarios", why: "Élections anticipées et probité politique, tenues ensemble sans confondre constat et projection." },
  { n: 8,  t: "Le Conclave", url: "https://ouaisfieu.github.io/conclave/", role: "Jeu documenté trilingue", why: "Simulateur budgétaire fédéral FR/NL/EN : la seule pièce de l'archipel qui franchit la frontière linguistique." },
  { n: 9,  t: "Failles belges", url: "https://ouaisfieu.github.io/failles-belgique/", role: "Synthèse institutionnelle", why: "Présente ses objections et reconnaît que la Belgique reste une démocratie constitutionnelle. Ce contrepoint devrait être obligatoire partout." },
  { n: 10, t: "Toolkit", url: "https://ouaisfieu.github.io/toolkit/", role: "Poste de travail du plaidoyer", why: "Local-first et réellement utilisable — à condition de lui ajouter un contenu de secours sans JavaScript." },
  { n: 11, t: "Braise", url: "https://yannkeep.github.io/flashcards/", role: "Outil grand public", why: "Flashcards local-first pour entretenir la mémoire collective : la porte d'entrée la plus basse en exigence." },
  { n: 12, t: "AAARG", url: "https://yannkeep.github.io/aaarg/", role: "Porte narrative unique", why: "Une seule fiction principale, explicitement étiquetée comme telle, plutôt que quinze ARG concurrents." }
];

export const CONSTELLATIONS = [
  { k: "A", t: "Infrastructure & portes d'entrée", d: "Racines de compte, DOCTech, CCPLC, Hub, Portail, NEXUS. Des rôles de navigation qui se chevauchent — NEXUS est le seul à publier sa méthode.", verdict: "À réduire à une porte." },
  { k: "B", t: "Démocratie & institutions belges", d: "Failles belges, Le Grand Soir, Melting Pot, Belgique sur mesure, Le Conclave, les simulateurs électoraux. Thèse constante : la démocratie belge tient formellement, la particratie et l'opacité usent le pouvoir d'agir.", verdict: "Identité forte, monoculture interprétative." },
  { k: "C", t: "Coalition Arizona & droits sociaux", d: "arizona, alertes-sociales, ecp, trap, fable, cpas-belgique, non-recours. Chômage, incapacité de travail, transferts vers les CPAS, moratoire FWB.", verdict: "Ligne la plus utile socialement." },
  { k: "D", t: "Justice, intégrité & scandales", d: "TPE, GRECO, transaction-penale, les-deux-belgiques, qatargate, kazakhgate, panama-papers, affaire-reynders. Personnes nommées, procédures en cours, notions juridiques.", verdict: "Niveau de preuve à homogénéiser d'urgence." },
  { k: "E", t: "Éducation permanente & pauvreté", d: "Éducation permanente, dossier-zero, atd, cpcp, ateliers, laGarde. Traduit un cadre institutionnel abstrait en interfaces grand public.", verdict: "Risque d'appropriation symbolique : afficher la non-affiliation." },
  { k: "F", t: "Outils local-first", d: "Toolkit, plaidoyer, flashcards, pwa, decks, introspection, valeurs, mySPOT, metaFox, Markdown Workstations. Fonctionnent dans le navigateur, sans compte, avec import/export.", verdict: "Promesses à convertir en preuves auditables." },
  { k: "G", t: "Bruxelles, territoires & santé mentale", d: "bxl2030, bxl2042, 1160, 1007bxl, mySPOT, nyxo-brussels, onyx. Logique de zones, graphes et entités reliées.", verdict: "Prometteur mais répliqué à l'identique." },
  { k: "H", t: "ARG, fiction, satire & faux OS", d: "AAARG, Reaven, PéTAL, arg-engine, wopr, politika, boot, kern, saloon, ghostnet. L'esthétique rétro-geek qui fait la signature visuelle.", verdict: "Danger : même ton, mêmes chiffres que le factuel." },
  { k: "I", t: "Archives, miroirs & bancs d'essai", d: "archipel, catalogue, magasin, pages, showroom, github.io, tech, doctech, base, wire, s. Utiles en interne.", verdict: "À exclure de l'indexation." }
];
