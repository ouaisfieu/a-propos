export const SITE = {
  name: "227",
  tagline: "Registre critique de l'archipel Ouaisfieu × Yannkeep",
  baseUrl: "https://ouaisfieu.github.io/a-propos",
  lang: "fr-BE",
  locale: "fr_BE",
  observedAt: "2026-08-26",
  builtAt: new Date().toISOString(),
  author: "Claude (Anthropic)",
  editorial: "CCPLC — Collectif Citoyen pour la Participation Libre & Consciente",
  license: "CC BY 4.0 (contenu) · MIT (code) · ODbL (données)",
  usba: "https://dl.ouaisfi.eu/usba/",
  repo: "https://github.com/ouaisfieu/a-propos",
  description:
    "227 trie, date et note les 226 GitHub Pages de l'archipel Ouaisfieu × Yannkeep : atlas filtrable, registre de claims vérifiées, audit SEO et plan de consolidation. Aucun script externe, aucun traceur."
};

export const THEMES = {
  LAB: { slug: "laboratoires", label: "Autres laboratoires", short: "Laboratoires", color: "var(--t-LAB)",
    note: "Catégorie résiduelle trop large : le signe que la taxonomie ne suffit plus." },
  POL: { slug: "politique-democratie", label: "Politique & démocratie", short: "Politique", color: "var(--t-POL)",
    note: "Cœur éditorial le plus cohérent et le plus différenciant de l'archipel." },
  DOC: { slug: "documentation-archives", label: "Documentation & archives", short: "Documentation", color: "var(--t-DOC)",
    note: "Utile pour la mémoire, mais mélange hubs, copies et dépôts techniques." },
  JUS: { slug: "justice-scandales", label: "Justice & scandales", short: "Justice", color: "var(--t-JUS)",
    note: "Fort potentiel public ; niveau de prudence juridique très variable." },
  OUT: { slug: "outils-numeriques", label: "Outils numériques", short: "Outils", color: "var(--t-OUT)",
    note: "Nombreux prototypes local-first réellement réutilisables." },
  SOC: { slug: "droits-sociaux", label: "Droits sociaux", short: "Droits sociaux", color: "var(--t-SOC)",
    note: "Ligne éditoriale forte : Arizona, BIM, CPAS, non-recours." },
  ARG: { slug: "arg-experimentation", label: "ARG & expérimentation", short: "ARG", color: "var(--t-ARG)",
    note: "Signature esthétique originale, mais doit être séparée du factuel sans ambiguïté." },
  EDU: { slug: "education-culture", label: "Éducation & culture", short: "Éducation", color: "var(--t-EDU)",
    note: "Cohérent avec l'éducation permanente et le pouvoir d'agir." },
  BXL: { slug: "bruxelles-territoires", label: "Bruxelles & territoires", short: "Bruxelles", color: "var(--t-BXL)",
    note: "Moins volumineux mais stratégiquement identifiable." }
};

export const THEME_ORDER = ["POL","JUS","SOC","EDU","ARG","BXL","DOC","OUT","LAB"];

export const TYPES = {
  laboratoire:  { label: "Laboratoire",  icon: "▚", note: "Prototype ou banc d'essai. Ne pas citer comme source." },
  documentation:{ label: "Documentation",icon: "▤", note: "Corpus documentaire destiné à durer." },
  hub:          { label: "Hub",          icon: "◈", note: "Porte d'entrée / index. Redondant avec d'autres hubs." },
  dossier:      { label: "Dossier",      icon: "▣", note: "Enquête éditorialisée sur un sujet borné." },
  expérience:   { label: "Expérience",   icon: "◆", note: "Simulation, jeu ou fiction jouable." },
  outil:        { label: "Outil",        icon: "⬢", note: "Application utilisable, souvent local-first." }
};

/* ── Chiffres du relevé du 26 août 2026 (rapport critique, appendice) ── */
export const METRICS = {
  repos: 244, pagesEnabled: 226, http200: 214, http404: 12,
  ouaisfieu: { enabled: 165, ok: 154, ko: 11 },
  yannkeep:  { enabled: 61,  ok: 60,  ko: 1 },
  nexus: { projects: 224, observed: 211, declared: 1, errors: 12, subpages: 115, entries: 339, generated: "2026-08-25" },
  catalogable: 341,
  createdAug2026: 70, pushedAug2026: 75, createdJan2026: 59, twoWaves: 129, twoWavesPct: 57,
  hub: { pages: 158, published: 79, todo: 79, labs: 26, total: 184 },
  portail: { pages: 157 },
  nexusTypes: [
    ["Laboratoires", 83], ["Documentations", 48], ["Hubs", 24],
    ["Dossiers", 23], ["Expériences", 23], ["Outils", 23]
  ],
  subpagesByTheme: [
    ["JUS", 33], ["DOC", 26], ["ARG", 14], ["OUT", 12], ["LAB", 10],
    ["POL", 8], ["EDU", 8], ["BXL", 2], ["SOC", 2]
  ],
  seo: [
    { k: "<title>",            n: 214, base: 214, good: true },
    { k: "attribut lang",      n: 212, base: 214, good: true },
    { k: "meta viewport",      n: 213, base: 214, good: true },
    { k: "H1 détecté",         n: 170, base: 214 },
    { k: "meta description",   n: 135, base: 214 },
    { k: "Open Graph title",   n: 109, base: 214 },
    { k: "JSON-LD",            n: 98,  base: 214 },
    { k: "rel=canonical",      n: 97,  base: 214 },
    { k: "Twitter card",       n: 97,  base: 214 },
    { k: "Open Graph image",   n: 68,  base: 214, bad: true }
  ],
  fallback: { noLinks: 42, thinContent: 44, noExternalScript: 171 },
  clientSignals: [
    ["Bibliothèque de graphiques", 29], ["localStorage", 37], ["IndexedDB", 5], ["Manifeste PWA", 53]
  ],
  ghMeta: [
    { k: "Description non vide", n: 11,  base: 226 },
    { k: "Homepage renseignée",  n: 21,  base: 226 },
    { k: "Au moins un topic",    n: 1,   base: 226 },
    { k: "Licence MIT reconnue", n: 16,  base: 226 },
    { k: "Licence NOASSERTION",  n: 38,  base: 226 },
    { k: "Aucune licence",       n: 172, base: 226, bad: true }
  ],
  duplicates: { groups: 23, roots: 50, crossAccount: 7 }
};

export const DIMENSIONS = [
  { k: "Originalité & design",     lvl: 5, tag: "Fort",  why: "Identité visuelle, jeux, cartes, graphes, simulateurs et interfaces local-first." },
  { k: "Cohérence thématique",     lvl: 5, tag: "Fort",  why: "Belgique, pouvoir d'agir, éducation permanente, droits sociaux, transparence : un axe clair." },
  { k: "Qualité des meilleurs dossiers", lvl: 5, tag: "Fort", why: "GRECO, TPE, Non-recours, Éducation permanente, Observation : méthode mature." },
  { k: "Réutilisabilité",          lvl: 4, tag: "Potentiellement forte", why: "Code statique et données locales, mais licences et statut des versions flous." },
  { k: "Navigation globale",       lvl: 3, tag: "Moyen, en progrès", why: "Trois portails concurrents ; NEXUS améliore nettement la situation." },
  { k: "Transparence IA",          lvl: 3, tag: "Inégale", why: "Excellente sur GRECO et Failles ; non systématique sur le corpus." },
  { k: "Découvrabilité machine",   lvl: 2, tag: "Moyenne-faible", why: "Titres et langue solides ; canonicals, descriptions, OG, JSON-LD et fallback incomplets." },
  { k: "Homogénéité du sourçage",  lvl: 2, tag: "Fragile", why: "Écart considérable entre dossiers ; une erreur juridique matérielle est confirmée." },
  { k: "Maintenance",              lvl: 2, tag: "Fragile", why: "226 racines, 70 créations en un mois, 12 erreurs 404 et de nombreux miroirs." },
  { k: "Métadonnées GitHub",       lvl: 1, tag: "Très faible", why: "Descriptions, topics, homepages et licences quasi jamais renseignés." }
];
