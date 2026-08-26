import { writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

const CARDS = [
  { f: "og-home", strike: true,   kicker: "BELGIQUE · GITHUB PAGES · 26 AOÛT 2026",
    t: 'La prochaine avancée n’est pas un 227<sup>e</sup> site.', t2: "En voici un quand même.",
    s: "Registre critique de l’archipel Ouaisfieu × Yannkeep",
    st: [["226", "racines"], ["214", "en ligne"], ["26", "affirmations"], ["3", "erronées"]] },
  { f: "og-atlas",    kicker: "ATLAS · INVENTAIRE COMPLET",
    t: "226 racines GitHub Pages,", t2: "filtrables et exportables.",
    s: "Thème, type, statut HTTP, date de création — une fiche par racine",
    st: [["226", "racines"], ["12", "en 404"], ["9", "thèmes"], ["CSV", "+ JSON-LD"]] },
  { f: "og-registre", kicker: "REGISTRE DE CLAIMS · P1 APPLIQUÉE",
    t: "Vingt-six affirmations,", t2: "notées une à une.",
    s: "Valeur · périmètre · date · source · confiance · statut · verdict",
    st: [["11", "établies"], ["3", "contestées"], ["3", "erronées"], ["7", "statuts"]] },
  { f: "og-audit",    kicker: "AUDIT · DIX DIMENSIONS",
    t: "Excellent là où il est faible,", t2: "faible là où il est excellent.",
    s: "Signaux SEO, métadonnées GitHub, doublons, racines mortes",
    st: [["1", "topic / 226"], ["172", "sans licence"], ["68", "images OG"], ["24", "doublons"]] },
  { f: "og-doctrine", kicker: "DOCTRINE · ANALYSE ARGUMENTÉE",
    t: "Le Ratio 120", t2: "n’est pas un ratio.",
    s: "Lead-dexing, viralité modélisée, furtivité revendiquée : ce qui résiste",
    st: [["4", "à conserver"], ["4", "à abandonner"], ["1", "auto-réfutation"], ["0", "fiche relayée"]] },
  { f: "og-chantier", kicker: "CHANTIER · P0 · P1 · P2",
    t: "Vingt-et-un correctifs,", t2: "dont six urgents.",
    s: "Conserver, éditer, désherber — avant d’ajouter quoi que ce soit",
    st: [["6", "P0"], ["9", "P1"], ["6", "P2"], ["3", "déjà appliqués"]] },
  { f: "og-graph",    kicker: "GRAPHE · CROISEMENT DE DONNÉES",
    t: "L’archipel n’est pas un réseau.", t2: "C’est une poussière.",
    s: "282 nœuds, 245 liens démontrables, 78 composantes séparées",
    st: [["52", "racines isolées"], ["78", "composantes"], ["4", "types de liens"], ["0", "parenté devinée"]] },
  { f: "og-methode",  kicker: "MÉTHODE · SOURCES · LIMITES",
    t: "Ce que ce site sait,", t2: "et comment il le sait.",
    s: "Recomptage, écarts signalés, politique d’usage de l’IA, corrections",
    st: [["12", "sources"], ["226", "lignes recomptées"], ["1", "écart signalé"], ["0", "traceur"]] },
  { f: "og-default",  kicker: "227 · ARCHIPEL OUAISFIEU × YANNKEEP",
    t: "Registre critique", t2: "de l’archipel.",
    s: "Il n’ajoute rien : il trie, il date, il source et il contredit",
    st: [["226", "racines"], ["214", "en ligne"], ["26", "affirmations"], ["21", "correctifs"]] }
];

const tpl = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html{width:1200px;height:860px}body{width:1200px;height:630px;overflow:hidden}
body{background:#0a0c10;color:#e9edf4;
 font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
 position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:48px 62px 74px}
.grid{position:absolute;inset:0;
 background-image:linear-gradient(#1c2432 1px,transparent 1px),linear-gradient(90deg,#1c2432 1px,transparent 1px);
 background-size:60px 60px;
 -webkit-mask-image:radial-gradient(120% 80% at 78% 4%,#000 6%,transparent 68%)}
.glow{position:absolute;right:-140px;top:-160px;width:620px;height:620px;border-radius:50%;
 background:radial-gradient(circle,rgba(124,245,192,.20),transparent 62%)}
.row{display:flex;align-items:center;gap:14px;position:relative}
.mk{width:38px;height:38px}
.bn{font:700 26px/1 ui-monospace,"SF Mono",Menlo,monospace;letter-spacing:.05em}
.kick{font:600 15px/1 ui-monospace,"SF Mono",Menlo,monospace;letter-spacing:.22em;color:#7cf5c0;margin-left:auto}
h1{position:relative;font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
 font-size:58px;line-height:1.05;letter-spacing:-.028em;font-weight:600;max-width:21ch}
h1 .a{color:#e9edf4}
h1 .a.st{color:#8792a3;text-decoration:line-through;text-decoration-thickness:3px}
h1 .b{color:#7cf5c0;font-style:italic;display:block}
h1 sup{font-size:.55em}
.sub{position:relative;font-size:20px;color:#b9c2d0;margin-top:18px;max-width:52ch;line-height:1.4}
.stats{position:relative;display:flex;gap:40px;border-top:1px solid #2e3746;padding-top:20px}
.stat b{display:block;font-family:"Iowan Old Style",Palatino,Georgia,serif;font-size:36px;line-height:1;
 letter-spacing:-.03em;font-weight:600;font-variant-numeric:tabular-nums}
.stat span{display:block;font:600 12px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.13em;
 text-transform:uppercase;color:#8792a3;margin-top:9px}
.foot{position:absolute;left:62px;right:62px;bottom:30px;display:flex;justify-content:space-between;align-items:baseline;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#8792a3;letter-spacing:.06em}
</style></head><body>
<div class="grid"></div><div class="glow"></div>
<div class="row">
 <svg class="mk" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="8" fill="none" stroke="#7cf5c0" stroke-width="1.6" opacity=".55"/>
 <circle cx="10" cy="11" r="2.6" fill="#7cf5c0"/><circle cx="22" cy="10" r="1.8" fill="#b7a6ff"/>
 <circle cx="21" cy="21" r="2.9" fill="none" stroke="#7cf5c0" stroke-width="1.5"/><circle cx="10.5" cy="21.5" r="1.5" fill="#b7a6ff"/>
 <path d="M10 11L22 10M10 11l11 10M10.5 21.5L21 21" stroke="#7cf5c0" stroke-width="1" opacity=".6" fill="none"/></svg>
 <span class="bn">227</span><span class="kick">${c.kicker}</span></div>
<div><h1><span class="a${c.strike ? " st" : ""}">${c.t}</span><span class="b">${c.t2}</span></h1><p class="sub">${c.s}</p></div>
<div><div class="stats">${c.st.map(([n, k]) => `<div class="stat"><b>${n}</b><span>${k}</span></div>`).join("")}</div>
<div class="foot"><span>ouaisfieu.github.io/a-propos</span><span>ZÉRO REQUÊTE EXTERNE · CC BY 4.0</span></div></div>
</body></html>`;

mkdirSync("build/og", { recursive: true });
mkdirSync("docs/og", { recursive: true });
for (const c of CARDS) {
  const p = `build/og/${c.f}.html`;
  writeFileSync(p, tpl(c));
  execSync(`/opt/pw-browsers/chromium --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=1200,860 --force-device-scale-factor=1 --virtual-time-budget=2500 --screenshot=build/og/${c.f}.raw.png "file://${process.cwd()}/${p}"`, { stdio: "ignore" });
  execSync(`convert build/og/${c.f}.raw.png -crop 1200x630+0+0 +repage -strip docs/og/${c.f}.png`, { stdio: "ignore" });
}

/* Icônes PWA */
const icon = (size, maskable) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}html{width:${size}px;height:${size + 240}px}body{width:${size}px;height:${size}px;overflow:hidden}
body{background:#0a0c10;display:grid;place-items:center}
svg{width:${maskable ? size * 0.6 : size * 0.82}px;height:${maskable ? size * 0.6 : size * 0.82}px}
</style></head><body><svg viewBox="0 0 32 32">
<circle cx="10" cy="11" r="2.9" fill="#7cf5c0"/><circle cx="22" cy="10" r="2" fill="#b7a6ff"/>
<circle cx="21" cy="21" r="3.2" fill="none" stroke="#7cf5c0" stroke-width="1.8"/><circle cx="10.5" cy="21.5" r="1.7" fill="#b7a6ff"/>
<path d="M10 11L22 10M10 11l11 10M10.5 21.5L21 21" stroke="#7cf5c0" stroke-width="1.1" opacity=".7" fill="none"/>
</svg></body></html>`;
for (const [name, size, mask] of [["icon-192", 192, false], ["icon-512", 512, false], ["icon-maskable", 512, true], ["icon-180", 180, false]]) {
  const p = `build/og/${name}.html`;
  writeFileSync(p, icon(size, mask));
  execSync(`/opt/pw-browsers/chromium --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=${size},${size + 240} --force-device-scale-factor=1 --virtual-time-budget=1500 --screenshot=build/og/${name}.raw.png "file://${process.cwd()}/${p}"`, { stdio: "ignore" });
  execSync(`convert build/og/${name}.raw.png -crop ${size}x${size}+0+0 +repage -strip docs/og/${name}.png`, { stdio: "ignore" });
}
console.log("✓ images de partage et icônes générées");
