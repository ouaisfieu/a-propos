/* Construction du graphe de l'archipel.
   Règle : une arête n'existe que si elle est DÉMONTRABLE à partir du relevé.
   Aucune parenté n'est inférée d'une proximité de sujet ou d'un style commun. */
import { CLAIMS, STATUS } from "./claims.mjs";
import { THEMES } from "./site.mjs";

export const EDGE_KINDS = {
  mirror: { label: "Titre identique", short: "Miroir", color: "var(--st-critical)", w: 2.2,
    def: "Deux racines ou plus publient exactement le même titre. C'est le lien le plus fort du graphe, et le plus problématique : moteurs et lecteurs doivent deviner laquelle fait autorité." },
  twin:   { label: "Même nom de dépôt", short: "Jumeau", color: "var(--st-warn)", w: 1.8,
    def: "Le même nom de dépôt existe sur les deux comptes. Le contenu peut différer — le nom, lui, ne distingue plus rien." },
  claim:  { label: "Affirmation commune", short: "Affirmation", color: "var(--t-POL)", w: 1.4,
    def: "Les racines sont rattachées à la même affirmation du registre. C'est le seul lien de contenu du graphe, et il est explicite : il vient d'une fiche, pas d'une devinette." },
  cohort: { label: "Créées le même jour", short: "Cohorte", color: "var(--t-DOC)", w: 0.9,
    def: "Trois racines ou plus créées le même jour. Ce n'est pas une parenté éditoriale : c'est la trace d'une session de production. C'est ce lien qui révèle le rythme réel de l'archipel." }
};

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

export function buildGraph(roots, D) {
  const nodes = [], edges = [];
  const idx = new Map();
  const add = (n) => { idx.set(n.id, nodes.length); nodes.push(n); return n; };

  for (const r of roots) add({
    id: r.repo, kind: "root", label: r.title, sub: r.repo, theme: r.theme, type: r.type,
    account: r.account, http: r.http, created: r.created, slug: r.slug, url: r.url, deg: 0
  });

  const link = (a, b, kind) => { edges.push({ a, b, kind }); };

  /* 1. Miroirs — titres strictement identiques */
  const byTitle = new Map();
  for (const r of roots) {
    const k = norm(r.title);
    if (!byTitle.has(k)) byTitle.set(k, []);
    byTitle.get(k).push(r.repo);
  }
  const mirrorGroups = [];
  for (const [title, list] of byTitle) {
    if (list.length < 2) continue;
    mirrorGroups.push({ title, repos: list });
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) link(list[i], list[j], "mirror");
  }

  /* 2. Jumeaux — même nom de dépôt sur les deux comptes */
  const byName = new Map();
  for (const r of roots) {
    const k = r.name.toLowerCase();
    if (!byName.has(k)) byName.set(k, []);
    byName.get(k).push(r);
  }
  const twinPairs = [];
  for (const [name, list] of byName) {
    if (list.length < 2) continue;
    twinPairs.push({ name, repos: list.map(x => x.repo) });
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) link(list[i].repo, list[j].repo, "twin");
  }

  /* 3. Affirmations — nœuds concentrateurs, comme les étiquettes d'un carnet */
  for (const c of CLAIMS) {
    if (!(c.repos || []).length) continue;
    const id = "claim:" + c.id;
    add({ id, kind: "claim", label: c.claim, sub: STATUS[c.status].label, status: c.status,
      cid: c.id, theme: null, deg: 0 });
    for (const r of c.repos) if (idx.has(r)) link(r, id, "claim");
  }

  /* 4. Cohortes de production — trois racines ou plus créées le même jour */
  const byDay = new Map();
  for (const r of roots) {
    if (!byDay.has(r.created)) byDay.set(r.created, []);
    byDay.get(r.created).push(r.repo);
  }
  const cohorts = [];
  for (const [day, list] of [...byDay].sort()) {
    if (list.length < 3) continue;
    cohorts.push({ day, n: list.length, repos: list });
    const id = "day:" + day;
    add({ id, kind: "cohort", label: day, sub: `${list.length} racines créées ce jour-là`, n: list.length, deg: 0 });
    for (const r of list) link(r, id, "cohort");
  }

  /* Degrés */
  const deg = new Map();
  for (const e of edges) {
    deg.set(e.a, (deg.get(e.a) || 0) + 1);
    deg.set(e.b, (deg.get(e.b) || 0) + 1);
  }
  for (const n of nodes) n.deg = deg.get(n.id) || 0;

  /* Composantes connexes (sur le graphe complet) */
  const adj = new Map();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) { adj.get(e.a).push(e.b); adj.get(e.b).push(e.a); }
  const comp = new Map(); let ci = 0; const compSizes = [];
  for (const n of nodes) {
    if (comp.has(n.id)) continue;
    const stack = [n.id]; comp.set(n.id, ci); let size = 0, rootsIn = 0;
    while (stack.length) {
      const cur = stack.pop(); size++;
      if (idx.get(cur) < roots.length) rootsIn++;
      for (const nb of adj.get(cur)) if (!comp.has(nb)) { comp.set(nb, ci); stack.push(nb); }
    }
    compSizes.push({ id: ci, size, roots: rootsIn });
    ci++;
  }
  for (const n of nodes) n.comp = comp.get(n.id);
  compSizes.sort((a, b) => b.size - a.size);

  const rootNodes = nodes.filter(n => n.kind === "root");
  const isolated = rootNodes.filter(n => n.deg === 0);

  /* Composantes ne contenant QUE des cohortes + racines (aucun lien éditorial) */
  const kindsPerComp = new Map();
  for (const e of edges) {
    const c = comp.get(e.a);
    if (!kindsPerComp.has(c)) kindsPerComp.set(c, new Set());
    kindsPerComp.get(c).add(e.kind);
  }

  return {
    nodes, edges, mirrorGroups, twinPairs, cohorts,
    stats: {
      nodes: nodes.length, roots: rootNodes.length,
      claimNodes: nodes.filter(n => n.kind === "claim").length,
      cohortNodes: nodes.filter(n => n.kind === "cohort").length,
      edges: edges.length,
      byKind: Object.fromEntries(Object.keys(EDGE_KINDS).map(k => [k, edges.filter(e => e.kind === k).length])),
      isolated: isolated.length, isolatedList: isolated.map(n => n.id),
      components: compSizes.length,
      biggest: compSizes[0],
      top: rootNodes.slice().sort((a, b) => b.deg - a.deg).slice(0, 15),
      coveredByCohort: new Set(cohorts.flatMap(c => c.repos)).size,
      coveredByMirror: new Set(mirrorGroups.flatMap(g => g.repos)).size,
      coveredByTwin: new Set(twinPairs.flatMap(g => g.repos)).size,
      editorialOnly: rootNodes.filter(n => edges.some(e => (e.a === n.id || e.b === n.id) && e.kind !== "cohort")).length
    }
  };
}
