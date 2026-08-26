import { page, abs } from "../templates/layout.mjs";

export default function notfound(c, emit) {
  const { D, SITE } = c;
  const B = SITE.baseUrl.replace(/\/$/, "") + "/";
  const body = `
<section class="hero" style="padding-block:var(--sp-9)">
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <p class="eyebrow">Erreur 404</p>
    <h1 style="margin-top:1.2rem;font-size:var(--step-4)">Cette page n'existe pas.<br><span class="fx">Douze autres non plus.</span></h1>
    <p class="lede" style="margin-top:1.5rem">
      Vous venez de vivre, en petit, ce que vivent les visiteurs de ${D.dead.length} racines de l'archipel :
      GitHub annonce une publication, la page renvoie une erreur. C'est le correctif
      au meilleur rapport effort / bénéfice de tout le chantier.
    </p>
    <div class="chips" style="margin-top:2rem;gap:.6rem">
      <a class="btn btn-p" href="${B}">Retour à l'accueil</a>
      <a class="btn" href="${B}atlas/">Explorer les 226 racines</a>
      <a class="btn btn-g" href="${B}atlas/?status=ko">Voir les ${D.dead.length} racines mortes</a>
      <button class="btn btn-g" data-act="cmd">Rechercher <kbd>Ctrl</kbd><kbd>K</kbd></button>
    </div>
  </div>
</section>`;
  const html = page({
    title: "Page introuvable", desc: "Cette page n'existe pas. Retour à l'atlas des 226 racines de l'archipel Ouaisfieu × Yannkeep.",
    path: "404.html", depth: 0, active: "", jsonld: [], og: "og-home.png", body
  })
    .replace(/(href|src)="(?!https?:|mailto:|#)([^"]*)"/g, (m, a, v) => `${a}="${B}${v.replace(/^\.\//, "")}"`).replace('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">', '<meta name="robots" content="noindex,follow">');
  c.__notfound = html;
  emit("__404", html, { priority: 0.1 });
}
