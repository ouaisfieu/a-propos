/* Vérification du site construit : liens internes, JSON-LD, fichiers requis,
   balises essentielles, poids, doublons d'identifiants. */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";

const OUT = "docs";
const SELF = "https://ouaisfieu.github.io/a-propos";
let errors = 0, warns = 0;
const err = (m) => { console.log("  ✗ " + m); errors++; };
const warn = (m) => { console.log("  ! " + m); warns++; };

function walk(d, acc = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, acc) : acc.push(p);
  }
  return acc;
}
const files = walk(OUT);
const htmls = files.filter(f => f.endsWith(".html"));
const rel = new Set(files.map(f => relative(OUT, f).replace(/\\/g, "/")));

console.log(`\n── 1. Fichiers requis`);
for (const f of ["index.html", "404.html", "robots.txt", "sitemap.xml", "feed.xml", "llms.txt",
  "humans.txt", "manifest.webmanifest", "sw.js", "favicon.svg", ".nojekyll",
  "data/roots.json", "data/claims.json", "data/metrics.json", "data/archipel.csv",
  "assets/style.css", "assets/app.js", "assets/atlas.js",
  "og/og-home.png", "og/icon-192.png", "og/icon-512.png", "og/icon-maskable.png", "og/icon-180.png",
  ".well-known/security.txt"]) {
  if (!rel.has(f)) err(`manquant : ${f}`);
}
console.log(`  → ${files.length} fichiers, ${htmls.length} pages HTML`);

console.log(`\n── 2. Balises essentielles`);
let noOg = 0, noCanon = 0, noDesc = 0, noH1 = 0, noLd = 0, big = [];
for (const f of htmls) {
  const h = readFileSync(f, "utf8");
  const p = relative(OUT, f);
  if (!/<meta property="og:image" content="http/.test(h)) noOg++;
  if (!/<link rel="canonical" href="http/.test(h)) noCanon++;
  if (!/<meta name="description" content="[^"]{40,}"/.test(h)) noDesc++;
  if (!/<h1[ >]/.test(h)) noH1++;
  if (!/application\/ld\+json/.test(h) && !p.startsWith("404")) noLd++;
  const kb = Buffer.byteLength(h) / 1024;
  if (kb > 400) big.push(`${p} (${kb.toFixed(0)} Ko)`);
  // identifiants dupliqués
  const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) err(`identifiants dupliqués dans ${p} : ${[...new Set(dup)].join(", ")}`);
  // langue
  if (!/<html lang="fr"/.test(h)) err(`attribut lang manquant : ${p}`);
}
const N = htmls.length;
noOg ? err(`${noOg} pages sans og:image absolue`) : console.log(`  ✓ og:image absolue sur ${N}/${N}`);
noCanon ? err(`${noCanon} pages sans canonical absolue`) : console.log(`  ✓ canonical absolue sur ${N}/${N}`);
noDesc ? err(`${noDesc} pages sans meta description ≥ 40 caractères`) : console.log(`  ✓ meta description sur ${N}/${N}`);
noH1 ? err(`${noH1} pages sans <h1>`) : console.log(`  ✓ un <h1> sur ${N}/${N}`);
noLd ? err(`${noLd} pages sans JSON-LD`) : console.log("  ✓ JSON-LD sur toutes les pages indexables");
big.length ? warn(`pages > 400 Ko : ${big.join(", ")}`) : console.log("  ✓ aucune page > 400 Ko");

console.log(`\n── 3. JSON-LD analysable`);
let blocks = 0;
for (const f of htmls) {
  const h = readFileSync(f, "utf8");
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    blocks++;
    try {
      const o = JSON.parse(m[1]);
      if (!o["@context"] || !o["@type"]) err(`JSON-LD sans @context/@type dans ${relative(OUT, f)}`);
    } catch (e) { err(`JSON-LD invalide dans ${relative(OUT, f)} : ${e.message}`); }
  }
}
console.log(`  ✓ ${blocks} blocs JSON-LD analysés`);

console.log(`\n── 4. Fichiers de données`);
for (const f of ["data/roots.json", "data/claims.json", "data/metrics.json", "manifest.webmanifest"]) {
  try { JSON.parse(readFileSync(join(OUT, f), "utf8")); console.log(`  ✓ ${f}`); }
  catch (e) { err(`${f} invalide : ${e.message}`); }
}
const roots = JSON.parse(readFileSync(join(OUT, "data/roots.json"), "utf8"));
if (roots.hasPart.length !== 226) err(`roots.json : ${roots.hasPart.length} entrées au lieu de 226`);
else console.log("  ✓ roots.json contient bien 226 racines");

console.log(`\n── 5. Liens internes`);
let checked = 0, broken = 0;
for (const f of htmls) {
  const h = readFileSync(f, "utf8");
  const dir = dirname(f);
  for (const m of h.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(u)) continue;
    u = u.split("#")[0].split("?")[0];
    if (!u) continue;
    checked++;
    let target = resolve(dir, u);
    if (u.endsWith("/") || !u.split("/").pop().includes(".")) target = join(target, "index.html");
    if (!existsSync(target)) { err(`lien cassé dans ${relative(OUT, f)} → ${m[1]}`); broken++; }
  }
}
console.log(`  ✓ ${checked} liens internes vérifiés, ${broken} cassés`);

console.log(`\n── 6. Sitemap`);
const sm = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(`  ✓ ${locs.length} URL déclarées`);
if (locs.length !== htmls.length - 1) warn(`sitemap : ${locs.length} URL pour ${htmls.length - 1} pages indexables (le 404 est exclu)`);
if (sm.includes("__404")) err("le sitemap contient l'entrée technique __404");

console.log(`\n── 7. Aucune ressource externe`);
let ext = 0;
for (const f of htmls) {
  const h = readFileSync(f, "utf8");
  for (const m of h.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) {
    if (m[1].startsWith(SELF)) continue;   // même origine : le 404 doit être absolu
    if (/\.(css|js|woff2?|png|jpg|svg|gif)(\?|$)/.test(m[1])) { err(`ressource externe chargée : ${m[1]} (${relative(OUT, f)})`); ext++; }
  }
}
if (!ext) console.log("  ✓ aucune feuille de style, police, script ou image distante");

console.log(`\n── 8. Accessibilité (contrôles statiques)`);
let noAlt = 0, emptyLink = 0;
for (const f of htmls) {
  const h = readFileSync(f, "utf8");
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) noAlt++;
  for (const m of h.matchAll(/<a\b[^>]*>\s*<\/a>/g)) emptyLink++;
}
noAlt ? err(`${noAlt} images sans attribut alt`) : console.log("  ✓ toutes les images ont un attribut alt");
emptyLink ? err(`${emptyLink} liens sans contenu`) : console.log("  ✓ aucun lien vide");

const total = files.reduce((a, f) => a + statSync(f).size, 0);
console.log(`\n── Poids total : ${(total / 1048576).toFixed(2)} Mo`);
console.log(`\n${errors ? "✗" : "✓"} ${errors} erreur(s), ${warns} avertissement(s)\n`);
process.exit(errors ? 1 : 0);
