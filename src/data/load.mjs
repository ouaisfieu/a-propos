import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { THEMES, TYPES } from "./site.mjs";

const here = dirname(fileURLToPath(import.meta.url));

const slugify = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);

export function loadRoots() {
  const raw = readFileSync(join(here, "roots.tsv"), "utf8").trim().split("\n");
  const seen = new Set();
  const roots = raw.map((line, i) => {
    const [repo, title, theme, type, http, created] = line.split("\t");
    if (!repo || !THEMES[theme] || !TYPES[type]) throw new Error(`Ligne ${i + 1} invalide : ${line}`);
    const [account, name] = repo.split("/");
    const isRootRepo = name.toLowerCase() === `${account}.github.io`;
    const url = isRootRepo ? `https://${account}.github.io/` : `https://${account}.github.io/${name}/`;
    let slug = `${account}-${slugify(name)}`;
    while (seen.has(slug)) slug += "-2";
    seen.add(slug);
    return { repo, account, name, title, theme, type, http: +http, created, url, slug, isRootRepo };
  });
  if (roots.length !== 226) throw new Error(`Attendu 226 racines, trouvé ${roots.length}`);
  return roots;
}

export function derive(roots) {
  const byTheme = {}, byType = {}, byMonth = {}, byAccount = {}, titles = {};
  for (const r of roots) {
    (byTheme[r.theme] ??= []).push(r);
    (byType[r.type] ??= []).push(r);
    (byAccount[r.account] ??= []).push(r);
    const m = r.created.slice(0, 7);
    byMonth[m] = (byMonth[m] || 0) + 1;
    const key = r.title.trim();
    (titles[key] ??= []).push(r);
  }
  const dupGroups = Object.entries(titles)
    .filter(([, v]) => v.length > 1)
    .map(([title, v]) => ({
      title, n: v.length, repos: v.map(x => x.repo),
      cross: new Set(v.map(x => x.account)).size > 1
    }))
    .sort((a, b) => b.n - a.n || a.title.localeCompare(b.title, "fr"));
  const months = Object.keys(byMonth).sort();
  const first = months[0], last = months[months.length - 1];
  const series = [];
  let [y, mo] = first.split("-").map(Number);
  const [ly, lm] = last.split("-").map(Number);
  while (y < ly || (y === ly && mo <= lm)) {
    const k = `${y}-${String(mo).padStart(2, "0")}`;
    series.push({ k, v: byMonth[k] || 0,
      short: mo === 1 ? String(y) : String(mo).padStart(2, "0"),
      label: new Date(y, mo - 1, 1).toLocaleDateString("fr-BE", { month: "long", year: "numeric" }) });
    mo++; if (mo > 12) { mo = 1; y++; }
  }
  return {
    byTheme, byType, byMonth, byAccount, months: series,
    dupGroups,
    dupRoots: dupGroups.reduce((a, g) => a + g.n, 0),
    dupCross: dupGroups.filter(g => g.cross).length,
    dead: roots.filter(r => r.http === 404),
    live: roots.filter(r => r.http === 200)
  };
}

export { slugify };
