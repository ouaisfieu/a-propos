import { esc } from "./layout.mjs";

const fr = (n, d = 0) => Number(n).toLocaleString("fr-BE", { minimumFractionDigits: d, maximumFractionDigits: d });
const SEQ = ["var(--seq-a)", "var(--seq-b)", "var(--seq-c)", "var(--seq-d)", "var(--seq-e)"];
/* Rampe ordinale à 5 pas : plus la valeur est haute, plus le pas est marqué. */
const seqFor = (v, max) => SEQ[Math.min(4, Math.floor((v / (max || 1)) * 4.999))];

export function figure({ id, title, sub, chart, caption, table }) {
  return `<figure class="fig reveal"${id ? ` id="${id}"` : ""}>
  <div class="fig-hd"><div class="fig-t">${title}</div>${sub ? `<p class="fig-s">${sub}</p>` : ""}</div>
  ${chart}
  ${table ? `<details class="tablefold"><summary>Voir les données en tableau</summary><div class="dbody" style="padding:0">${table}</div></details>` : ""}
  ${caption ? `<figcaption>${caption}</figcaption>` : ""}
</figure>`;
}

/* Barres horizontales — encodage de MAGNITUDE : une seule teinte, rampe ordinale.
   Chaque barre porte son libellé et sa valeur : l'identité n'est jamais portée par la couleur seule. */
export function barsH({ rows, max, unit = "", pct = false, colorBy }) {
  const M = max || Math.max(...rows.map(r => r.v));
  return `<div role="img" aria-label="Graphique en barres : ${esc(rows.map(r => r.k + " " + r.v + unit).join(", "))}">` +
    rows.map(r => {
      const c = colorBy ? colorBy(r) : seqFor(r.v, M);
      const w = (r.v / M) * 100;
      return `<div class="hbar" style="--c:${c}" title="${esc(r.k)} : ${fr(r.v)}${unit}${r.note ? " — " + esc(r.note) : ""}">
      <span class="hl"><i></i>${esc(r.k)}</span>
      <span class="ht"><span style="--w:${w.toFixed(2)}%"></span></span>
      <span class="hv">${pct ? fr(r.v, 1) + " %" : fr(r.v) + unit}${r.of ? `<span class="dim" style="font-weight:400"> / ${fr(r.of)}</span>` : ""}</span>
    </div>`;
    }).join("") + `</div>`;
}

export function tableOf(head, rows) {
  return `<div class="tw" style="border:0;border-radius:0"><table><thead><tr>${head.map((h, i) => `<th scope="col"${i ? ' class="n"' : ""}>${esc(h)}</th>`).join("")}</tr></thead><tbody>` +
    rows.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("") +
    `</tbody></table></div>`;
}

/* Entonnoir — étapes ordonnées, rampe ordinale, perte affichée entre chaque palier.
   Le texte porte les jetons de texte, jamais la couleur de la marque. */
export function funnel(steps) {
  const M = steps[0].v;
  return `<div class="funnel" role="img" aria-label="Entonnoir : ${esc(steps.map(s => s.k + " " + s.v).join(" puis "))}">` +
    steps.map((s, i) => {
      const w = 22 + (s.v / M) * 78;
      const drop = i ? steps[i - 1].v - s.v : 0;
      return (i ? `<div class="fdrop"><span aria-hidden="true">↓</span> −${drop} · ${esc(steps[i].why || "")}</div>` : "") +
        `<div class="fstep">
          <span class="fl">${esc(s.k)}</span>
          <span class="fbar"><i style="width:${w.toFixed(1)}%;background:${SEQ[Math.max(0, 3 - i)]}"></i></span>
          <span class="fn">${fr(s.v)}</span>
        </div>`;
    }).join("") + `</div>`;
}

/* Colonnes temporelles — une seule teinte, magnitude dans le temps. */
export function columns({ data, highlight = [] }) {
  const M = Math.max(...data.map(d => d.v));
  return `<div class="cols" role="img" aria-label="Histogramme mensuel : ${esc(data.map(d => d.k + " " + d.v).join(", "))}">` +
    data.map(d => {
      const on = highlight.includes(d.k);
      return `<div class="col" title="${esc(d.label || d.k)} : ${d.v} racine${d.v > 1 ? "s" : ""} créée${d.v > 1 ? "s" : ""}">
      <b style="--h:${((d.v / M) * 100).toFixed(1)}%;--c:${on ? "var(--seq-e)" : seqFor(d.v, M)}"></b>
      <em>${esc(d.short || d.k)}</em></div>`;
    }).join("") + `</div>`;
}

/* Barre empilée de statuts — palette de STATUTS (rôles fixes), glyphe + libellé obligatoires. */
export function stack({ parts, total }) {
  return `<div class="stackbar" role="img" aria-label="${esc(parts.map(p => p.k + " : " + p.v).join(", "))}">` +
    parts.filter(p => p.v > 0).map(p =>
      `<span style="flex:${p.v};background:${p.color}" title="${esc(p.k)} : ${p.v} sur ${total}">${p.v}</span>`).join("") +
    `</div><div class="legend" style="margin-top:.7rem">` +
    parts.map(p => `<span><i style="background:${p.color}"></i>${esc(p.glyph ? p.glyph + " " : "")}${esc(p.k)} <b class="mono">${p.v}</b></span>`).join("") +
    `</div>`;
}

/* Échelle ordinale 1-5 — points remplis, rampe ordinale, note chiffrée à côté. */
export function dots(n, of = 5) {
  const c = SEQ[Math.min(4, n - 1)];
  return `<span class="dots" role="img" aria-label="Note ${n} sur ${of}" style="--c:${c}">` +
    Array.from({ length: of }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("") + `</span>`;
}

export { fr, SEQ, seqFor };

/* Matrice de croisement — encodage de MAGNITUDE : rampe ordinale d'une seule teinte.
   C'est un vrai tableau : lisible au lecteur d'écran, à l'impression et sans JavaScript. */
export function matrix({ rows, cols, cell, corner = "", rowTotal = true, colTotal = true }) {
  const grid = rows.map(r => cols.map(c => cell(r, c)));
  const max = Math.max(1, ...grid.flat());
  const rTot = grid.map(r => r.reduce((a, b) => a + b, 0));
  const cTot = cols.map((_, j) => grid.reduce((a, r) => a + r[j], 0));
  const total = rTot.reduce((a, b) => a + b, 0);
  const ink = (v) => v / max > .58 ? "#fff" : "var(--fg)";
  return `<div class="tw mtx"><table>
  <thead><tr><th scope="col">${esc(corner)}</th>${cols.map(c => `<th scope="col" class="n">${esc(c.label)}</th>`).join("")}${colTotal ? '<th scope="col" class="n tot">Total</th>' : ""}</tr></thead>
  <tbody>${rows.map((r, i) => `<tr><th scope="row">${r.chip || ""}${esc(r.label)}</th>${
    grid[i].map((v, j) => v === 0
      ? `<td class="n z">·</td>`
      : `<td class="n c" style="--v:${((v / max) * 100).toFixed(1)}%;color:${ink(v)}" title="${esc(r.label)} × ${esc(cols[j].label)} : ${v}">${fr(v)}</td>`).join("")
  }${rowTotal ? `<td class="n tot">${fr(rTot[i])}</td>` : ""}</tr>`).join("")}</tbody>
  ${colTotal ? `<tfoot><tr><th scope="row" class="tot">Total</th>${cTot.map(v => `<td class="n tot">${fr(v)}</td>`).join("")}${rowTotal ? `<td class="n tot">${fr(total)}</td>` : ""}</tr></tfoot>` : ""}
  </table></div>`;
}
