import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";
import { figure, stack, tableOf } from "../templates/viz.mjs";

export default function registre(c, emit) {
  const { SITE, CLAIMS, STATUS, ROLES } = c;
  const url = abs("registre/");
  const themes = [...new Set(CLAIMS.map(x => x.theme))];
  const ordered = [...CLAIMS].sort((a, b) => STATUS[b.status].order - STATUS[a.status].order || a.id.localeCompare(b.id));

  const jsonld = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Registre de claims", url, inLanguage: "fr-BE",
      description: "26 affirmations sensibles de l'archipel Ouaisfieu × Yannkeep, chacune assortie d'une valeur, d'un périmètre, d'une date, d'une source, d'un niveau de confiance, d'un statut et d'un verdict argumenté.",
      isPartOf: { "@id": abs("") + "#website" },
      mainEntity: { "@type": "Dataset", name: "Registre de claims", url: abs("data/claims.json"), license: "https://creativecommons.org/licenses/by/4.0/" } },
    ...CLAIMS.map(cl => ({
      "@context": "https://schema.org", "@type": "ClaimReview", url: url + "#" + cl.id,
      claimReviewed: cl.claim, datePublished: SITE.observedAt, inLanguage: "fr-BE",
      author: { "@type": "Person", name: SITE.author },
      reviewRating: {
        "@type": "Rating", ratingValue: STATUS[cl.status].rating, bestRating: 5, worstRating: 0,
        alternateName: STATUS[cl.status].label,
        ratingExplanation: cl.verdict.slice(0, 280)
      },
      itemReviewed: {
        "@type": "Claim", name: cl.claim, appearance: cl.src.filter(s => s[1]).map(([name, u]) => ({ "@type": "CreativeWork", name, url: u })),
        firstAppearance: cl.src[0] && cl.src[0][1] ? { "@type": "CreativeWork", name: cl.src[0][0], url: cl.src[0][1] } : undefined
      }
    })),
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
      { "@type": "ListItem", position: 2, name: "Registre", item: url } ] }
  ];

  const parts = Object.entries(STATUS).sort((a, b) => a[1].order - b[1].order)
    .map(([k, s]) => ({ k: s.label, glyph: s.glyph, v: CLAIMS.filter(x => x.status === k).length, color: ROLES[s.role].color }));

  const claimCard = (cl) => {
    const st = STATUS[cl.status], role = ROLES[st.role];
    return `<article class="claim" id="${cl.id}" data-status="${cl.status}" data-theme="${esc(cl.theme)}" style="--st:${role.color};--st-ink:${role.ink}">
  <div class="chips">
    <span class="stat-chip ${role.cls}">${st.glyph} ${st.label}</span>
    <span class="chip dim">${esc(cl.theme)}</span>
    <span class="chip dim">confiance ${esc(cl.conf)}</span>
    <a class="chip" href="#${cl.id}" style="text-decoration:none;color:var(--fg-4)">#${esc(cl.id)}</a>
  </div>
  <p class="claim-q">« ${esc(cl.claim)} »</p>
  <p class="verdict">${esc(cl.verdict)}</p>
  <div class="claim-meta">
    <span><b>Valeur</b> <span class="claim-v">${esc(cl.value)}</span></span>
    <span><b>Périmètre</b> ${esc(cl.scope)}</span>
    <span><b>Date d'arrêt</b> ${esc(cl.date)}</span>
    <span><b>Source${cl.src.length > 1 ? "s" : ""}</b> ${cl.src.map(([n, u]) => u ? `<a href="${u}" rel="noopener nofollow" target="_blank">${esc(n)} ↗</a>` : esc(n)).join(" · ")}</span>
  </div>
</article>`;
  };

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Registre de claims" }], 1)}</div>

<section class="wrap" style="padding-bottom:var(--sp-6)">
  <p class="eyebrow">Recommandation P1, appliquée</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:20ch">Vingt-six affirmations, notées une à une</h1>
  <p class="lede" style="margin-top:1.2rem">
    Le rapport critique demande à l'archipel de publier, « pour chaque affirmation sensible : valeur, date,
    source, juridiction, confiance et statut ». Le voici — appliqué à l'archipel lui-même.
    Onze affirmations tiennent sur source primaire. Trois sont matériellement fausses.
  </p>
  <div class="note ok" style="margin-top:1.5rem;max-width:74ch">
    <b>Ce registre note des publications, pas des personnes.</b> Les affaires judiciaires citées le sont
    par leurs sources institutionnelles, et la présomption d'innocence s'applique à toute personne visée
    par une procédure. Un verdict engage son auteur : la <a href="../methode/#correction">procédure de correction</a>
    est ouverte et documentée.
  </div>
</section>

<section class="wrap" style="padding-bottom:var(--sp-6)">
  ${figure({
    title: "Répartition par niveau de preuve",
    sub: "Sept statuts, quatre rôles de fiabilité. Chaque statut porte un glyphe et un libellé : la couleur ne porte jamais l'information seule.",
    chart: stack({ parts, total: CLAIMS.length }),
    table: tableOf(["Statut", "Définition", "Nombre"],
      Object.entries(STATUS).sort((a, b) => a[1].order - b[1].order)
        .map(([k, s]) => [`${s.glyph} <b>${esc(s.label)}</b><br><span class="tiny dim">${esc(s.def)}</span>`, "", CLAIMS.filter(x => x.status === k).length])),
    caption: `Le déséquilibre n'est pas un défaut d'écriture : c'est la conséquence directe d'un rythme de publication qui rend la relecture impossible. Corpus arrêté au ${SITE.observedAt}.`
  })}
</section>

<div class="filters">
  <div class="wrap">
    <div class="fbar">
      <span class="tiny mono dim" style="padding:.5rem .2rem">Filtrer</span>
      <select class="sel" id="c-status" aria-label="Filtrer par statut">
        <option value="">Tous les statuts</option>
        ${Object.entries(STATUS).sort((a, b) => a[1].order - b[1].order)
          .map(([k, s]) => `<option value="${k}">${s.glyph} ${esc(s.label)} (${CLAIMS.filter(x => x.status === k).length})</option>`).join("")}
      </select>
      <select class="sel" id="c-theme" aria-label="Filtrer par domaine">
        <option value="">Tous les domaines</option>
        ${themes.map(t => `<option value="${esc(t)}">${esc(t)} (${CLAIMS.filter(x => x.theme === t).length})</option>`).join("")}
      </select>
      <a class="btn btn-g" href="#errone" style="padding:.55rem .8rem">Aller aux 3 erreurs</a>
      <a class="btn btn-g" href="../data/claims.json" style="padding:.55rem .8rem">JSON</a>
      <span class="count" id="c-count" role="status" aria-live="polite">${CLAIMS.length} affirmations</span>
    </div>
  </div>
</div>

<section class="wrap" style="padding-block:var(--sp-6) var(--sp-8)">
  <h2 id="errone" style="font-size:var(--step-2)">Le registre, du plus défaillant au plus solide</h2>
  <p class="small" style="margin-top:.8rem;max-width:70ch">Trié par statut décroissant de gravité. Chaque fiche est ancrable et partageable individuellement.</p>
  <div class="stack" id="claim-list" style="margin-top:2rem">
    ${ordered.map(claimCard).join("\n")}
  </div>
  <p class="empty" id="c-empty" hidden>Aucune affirmation ne correspond à ces filtres.</p>

  <div class="panel" style="margin-top:3rem">
    <p class="kicker">Vocabulaire des statuts</p>
    <dl style="margin-top:1.2rem;display:grid;gap:.9rem">
      ${Object.entries(STATUS).sort((a, b) => a[1].order - b[1].order).map(([k, s]) => `
      <div style="display:grid;grid-template-columns:auto 1fr;gap:.9rem;align-items:baseline">
        <dt><span class="stat-chip ${ROLES[s.role].cls}">${s.glyph} ${esc(s.label)}</span></dt>
        <dd class="small">${esc(s.def)}</dd>
      </div>`).join("")}
    </dl>
    <p class="tiny dim" style="margin-top:1.2rem">
      Chaque fiche est publiée en <code>ClaimReview</code> schema.org, avec une note de 0 à 5 et son explication.
      Les moteurs et les modèles de langage peuvent donc lire le verdict sans passer par la mise en page.
    </p>
  </div>

  <div style="margin-top:2.5rem">
    ${share({ url, title: "Registre de claims — archipel Ouaisfieu × Yannkeep", text: "26 affirmations passées au crible : 11 établies, 3 contestées, 3 erronées." })}
  </div>
</section>

<script>
(function(){
  var list=document.getElementById('claim-list'),cnt=document.getElementById('c-count'),
      em=document.getElementById('c-empty'),
      s=document.getElementById('c-status'),t=document.getElementById('c-theme');
  function apply(){
    var n=0,items=list.querySelectorAll('.claim');
    for(var i=0;i<items.length;i++){
      var ok=(!s.value||items[i].dataset.status===s.value)&&(!t.value||items[i].dataset.theme===t.value);
      items[i].hidden=!ok; if(ok)n++;
    }
    cnt.innerHTML='<b>'+n+'</b> / ${CLAIMS.length} affirmations';
    em.hidden=n>0;
    var p=new URLSearchParams();
    if(s.value)p.set('status',s.value); if(t.value)p.set('theme',t.value);
    history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:'')+location.hash);
  }
  var q=new URLSearchParams(location.search);
  if(q.get('status'))s.value=q.get('status');
  if(q.get('theme'))t.value=q.get('theme');
  s.addEventListener('change',apply); t.addEventListener('change',apply);
  if(q.get('status')||q.get('theme'))apply();
})();
</script>`;

  emit("registre", page({
    title: "Registre de claims",
    desc: "26 affirmations sensibles de l'archipel Ouaisfieu × Yannkeep, notées une à une : valeur, périmètre, date, source, confiance, statut et verdict argumenté. Trois sont matériellement fausses.",
    path: "registre/", depth: 1, active: "registre", jsonld, og: "og-registre.png", body, type: "Article"
  }), { priority: 0.9, changefreq: "weekly" });
}
