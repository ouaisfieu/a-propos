import { page, esc, abs, share, crumbs } from "../templates/layout.mjs";

export default function chantier(c, emit) {
  const { SITE, PLAN } = c;
  const url = abs("chantier/");
  const total = PLAN.reduce((a, g) => a + g.items.length, 0);
  const done = PLAN.reduce((a, g) => a + g.items.filter(i => i.done).length, 0);

  const jsonld = [
    { "@context": "https://schema.org", "@type": "HowTo",
      name: "Consolider l'archipel Ouaisfieu × Yannkeep en 21 correctifs",
      description: "Plan de consolidation priorisé P0 / P1 / P2 : corriger le risque de confiance, faire de NEXUS un registre éditorial, rendre l'ensemble durable et accessible.",
      url, inLanguage: "fr-BE", totalTime: "P30D",
      author: { "@type": "Person", name: SITE.author },
      step: PLAN.map((g, gi) => ({
        "@type": "HowToSection", position: gi + 1, name: `${g.p} — ${g.title}`,
        description: g.why,
        itemListElement: g.items.map((it, i) => ({ "@type": "HowToStep", position: i + 1, name: it.t, text: it.d, url: url + "#" + it.id }))
      })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: abs("") },
      { "@type": "ListItem", position: 2, name: "Chantier", item: url } ] }
  ];

  const TAGCOL = { juridique: "st-critical", technique: "st-warn", éditorial: "st-serious", architecture: "st-good", seo: "st-warn", a11y: "st-good" };

  const body = `
<div class="wrap">${crumbs([{ label: "Accueil", href: "" }, { label: "Chantier" }], 1)}</div>

<section class="wrap" style="padding-bottom:var(--sp-6)">
  <p class="eyebrow">Plan de consolidation · P0 · P1 · P2</p>
  <h1 style="margin-top:1rem;font-size:var(--step-3);max-width:22ch">Vingt-et-un correctifs, dont six urgents</h1>
  <p class="lede" style="margin-top:1.2rem">
    Le rapport critique ne demande pas de tout arrêter. Il demande de <b>conserver, éditer et désherber</b>
    plutôt que d'ajouter. Voici sa liste, transformée en chantier cochable : votre avancement reste
    sur votre appareil et n'est envoyé nulle part.
  </p>
  <div class="panel" style="margin-top:2rem">
    <div class="progress">
      <span class="mono" id="prog-n"><b>${done}</b> / ${total}</span>
      <span class="bar" style="flex:1"><i id="prog-bar" style="width:${((done / total) * 100).toFixed(1)}%"></i></span>
      <span class="mono dim" id="prog-p">${((done / total) * 100).toFixed(0)} %</span>
      <button class="btn btn-g" id="prog-reset" style="padding:.3rem .6rem;font-size:.75rem">Tout décocher</button>
    </div>
    <p class="tiny dim" style="margin-top:.9rem">
      Trois correctifs sont pré-cochés : ce sont ceux que ce site applique déjà, à titre de démonstration
      exécutable. Les dix-huit autres appartiennent à l'archipel.
    </p>
  </div>
</section>

${PLAN.map(g => `
<section class="section" id="${g.p}">
  <div class="wrap">
    <div class="split">
      <div>
        <p class="kicker" style="font-size:var(--step-1);letter-spacing:.02em">${g.p}</p>
        <h2 style="margin-top:.6rem;font-size:var(--step-2);max-width:14ch">${esc(g.title)}</h2>
        <p class="small" style="margin-top:1rem">${esc(g.why)}</p>
        <p class="chip" style="margin-top:1.2rem">Effort : ${esc(g.cost)}</p>
        <p class="tiny dim" style="margin-top:.8rem">${g.items.length} correctifs</p>
      </div>
      <div class="stack">
        ${g.items.map(it => `<div class="task" id="${it.id}">
          <input type="checkbox" id="cb-${it.id}" data-task="${it.id}"${it.done ? " checked" : ""} aria-describedby="d-${it.id}">
          <div style="flex:1;min-width:0">
            <label class="task-t" for="cb-${it.id}">${esc(it.t)}</label>
            <p class="small" id="d-${it.id}" style="margin-top:.45rem">${esc(it.d)}</p>
            <div class="chips" style="margin-top:.8rem">
              <span class="stat-chip ${TAGCOL[it.tag] || "st-good"}">${esc(it.tag)}</span>
              ${it.done ? `<span class="done-flag">✓ appliqué ici — ${esc(it.doneNote)}</span>` : ""}
              <a class="tiny mono dim" href="#${it.id}" style="text-decoration:none">#${esc(it.id)}</a>
            </div>
          </div>
        </div>`).join("")}
      </div>
    </div>
  </div>
</section>`).join("")}

<section class="section">
  <div class="wrap">
    <div class="panel" style="border-left:3px solid var(--accent)">
      <p class="kicker">Ce qui vient après la liste</p>
      <p style="margin-top:1rem;max-width:70ch">
        Aucun de ces vingt-et-un correctifs ne crée de contenu. C'est le point.
        L'archipel possède déjà cinq dossiers d'un niveau que peu de collectifs atteignent —
        GRECO, « Le prix de la justice », le Non-recours, l'Éducation permanente, Observation.
        Ce qui lui manque n'est pas une 227ᵉ publication : c'est un <b>seuil de légitimité externe</b>.
      </p>
      <p style="margin-top:1.2rem;max-width:70ch">
        Ce seuil ne viendra pas d'un nouveau portail. Il viendra de relectures externes, de contributions
        sur les dépôts, de citations par les organismes concernés, et de <b>corrections publiques
        documentées</b> — la seule preuve de sérieux qu'une institution reconnaisse sans discussion.
      </p>
      <p style="margin-top:1.5rem"><a class="btn btn-p" href="../methode/#correction">Voir comment signaler une erreur ici</a></p>
    </div>
    <div style="margin-top:2.5rem">
      ${share({ url, title: "Chantier de consolidation — 21 correctifs pour l'archipel", text: "P0, P1, P2 : ce qu'il faut réparer avant d'ajouter quoi que ce soit." })}
    </div>
  </div>
</section>

<script>
(function(){
  var K='a227.tasks',boxes=document.querySelectorAll('[data-task]'),
      n=document.getElementById('prog-n'),bar=document.getElementById('prog-bar'),
      pc=document.getElementById('prog-p'),rs=document.getElementById('prog-reset');
  function load(){try{return JSON.parse(localStorage.getItem(K)||'null');}catch(e){return null;}}
  function save(o){try{localStorage.setItem(K,JSON.stringify(o));}catch(e){}}
  var st=load();
  if(st){for(var i=0;i<boxes.length;i++){if(st[boxes[i].dataset.task]!==undefined)boxes[i].checked=!!st[boxes[i].dataset.task];}}
  function sync(){
    var o={},d=0;
    for(var i=0;i<boxes.length;i++){o[boxes[i].dataset.task]=boxes[i].checked;if(boxes[i].checked)d++;}
    save(o);
    var p=(d/${total})*100;
    n.innerHTML='<b>'+d+'</b> / ${total}';bar.style.width=p.toFixed(1)+'%';pc.textContent=Math.round(p)+' %';
  }
  for(var i=0;i<boxes.length;i++)boxes[i].addEventListener('change',sync);
  rs.addEventListener('click',function(){for(var i=0;i<boxes.length;i++)boxes[i].checked=false;sync();
    if(window.a227toast)window.a227toast('Chantier réinitialisé');});
  sync();
})();
</script>`;

  emit("chantier", page({
    title: "Chantier de consolidation",
    desc: "Les 21 correctifs P0/P1/P2 du rapport critique de l'archipel Ouaisfieu × Yannkeep, en liste cochable : corriger le risque de confiance, unifier le registre, rendre l'ensemble durable et accessible.",
    path: "chantier/", depth: 1, active: "chantier", jsonld, og: "og-chantier.png", body, type: "Article"
  }), { priority: 0.8, changefreq: "monthly" });
}
