# 227 — Registre critique de l'archipel Ouaisfieu × Yannkeep

> « La prochaine avancée n'est pas un 227ᵉ site. »
> — Rapport critique de l'archipel, 26 août 2026

En voici un quand même. Il n'ajoute aucun contenu à l'archipel : il le **trie**, le **date**,
le **source** et le **contredit**. C'est un site statique Jamstack qui applique à l'archipel
Ouaisfieu × Yannkeep les recommandations que l'audit adresse à l'archipel.

**En ligne :** https://ouaisfieu.github.io/a-propos/

---

## Ce que contient le site

| Page | Ce qu'elle fait |
|---|---|
| **Accueil** | Le manifeste, l'entonnoir 244 → 226 → 214, les trois affirmations erronées, l'anatomie du corpus |
| **Atlas** | Les **226 racines** GitHub Pages : recherche instantanée, six filtres, tri, deux vues, favoris, export CSV et JSON-LD. Chaque état de filtrage est un permalien. **Une fiche statique par racine.** |
| **Registre** | **26 affirmations sensibles**, chacune avec valeur, périmètre, date, source, confiance, statut et verdict argumenté. Publiées en `ClaimReview` schema.org. |
| **Audit** | Couverture des signaux SEO sur 214 racines, métadonnées GitHub sur 226 dépôts, 24 groupes de titres dupliqués, 12 racines mortes, neuf constellations éditoriales |
| **Graphe** (`/brol/graph/`) | Le réseau des liens **démontrables** : 282 nœuds, 245 liens, 78 composantes. Rendu canvas et simulation de forces écrits à la main. Quatre tableaux croisés. **52 racines n'ont aucun lien.** |
| **Doctrine** | Lead-dexing, Ratio 120, viralité modélisée, furtivité revendiquée : ce qui tient et ce qui casse. Étiquetée « analyse / opinion ». |
| **Chantier** | Les 21 correctifs P0/P1/P2, en liste cochable (avancement conservé en local) |
| **Méthode** | Sources, limites, politique d'usage de l'IA, procédure de correction |

**242 pages HTML** générées, dont 226 fiches de racine et 9 pages de thème.

---

## Chiffres du corpus (arrêté au 26 août 2026)

- **244** dépôts publics · **226** avec GitHub Pages activé · **214** répondent HTTP 200 · **12** en 404
- ouaisfieu : 165 dépôts (154 en ligne) — yannkeep : 61 (60 en ligne)
- NEXUS (25/08/2026) : 224 projets + 115 sous-pages = 339 entrées
- 70 racines créées en août 2026, 59 en janvier 2026 → **57 % du corpus en deux vagues**
- Métadonnées GitHub : 11 descriptions, 21 homepages, **1 seul topic**, 172 dépôts sans licence

Les 226 lignes de l'appendice du rapport ont été **recomptées indépendamment** :
les neuf totaux thématiques, la répartition par compte, les racines mortes et les deux vagues
de création concordent au chiffre près. Un seul écart subsiste — 24 groupes de titres dupliqués
recomptés contre 23 annoncés — il est **signalé plutôt que lissé**, sur la page Méthode.

---

## Fonctionnalités

**Découvrabilité et web sémantique**
- JSON-LD sur chaque page : `WebSite` + `SearchAction`, `Organization`, `Report`, `Article`,
  `Dataset`, `DataCatalog`, `ItemList`, `CollectionPage`, `BreadcrumbList`, `FAQPage`,
  `HowTo`, `AboutPage` et **`ClaimReview`** pour les 26 affirmations notées
- `canonical`, Open Graph et Twitter Card complets sur les 242 pages
- Images de partage 1200×630 générées à la construction, une par section
- `sitemap.xml`, `robots.txt`, `feed.xml` (RSS 2.0), `llms.txt`, `humans.txt`, `security.txt`

**Partage social**
- Web Share API native, plus X, Bluesky, Mastodon, LinkedIn, Facebook, WhatsApp, Telegram, e-mail
- Copie de lien, ancres de section partageables, permaliens de filtrage

**Interface**
- Recherche client instantanée insensible aux accents, six filtres combinables, tri, vues grille/tableau
- Favoris et avancement du chantier conservés en local
- Palette de commandes (<kbd>Ctrl</kbd>+<kbd>K</kbd>), raccourci <kbd>/</kbd> pour la recherche
- Export CSV et JSON-LD du **sous-ensemble filtré**, pas seulement du catalogue entier

**Accessibilité et durabilité**
- Thème clair / sombre / système, contraste renforcé, texte agrandi, animations désactivables
- Lien d'évitement, structure de titres, ancres, cibles au clavier, `aria-live` sur les compteurs
- Palette de visualisation **validée** : bande de clarté, plancher de chroma, séparation en vision
  déficiente des couleurs sur les paires adjacentes, contraste ≥ 3:1 — et aucune information
  portée par la couleur seule
- Amélioration progressive : sans JavaScript, l'inventaire complet reste lisible en tableau
- Feuille d'impression dédiée · Service worker pour la lecture hors-ligne
- **Zéro requête réseau sortante** : aucune police distante, aucun script tiers, aucun traceur,
  aucun cookie. Vérifiable dans l'onglet « Réseau » du navigateur.

---

## Construire

Aucune dépendance npm. Node 18+ suffit pour les pages.

```bash
node build.mjs        # 242 pages, données ouvertes, sitemap, RSS, llms.txt → docs/
node build/og.mjs     # images de partage + icônes PWA (nécessite Chromium et ImageMagick)
node build/check.mjs  # vérification : liens, JSON-LD, balises, poids, ressources externes
```

Ou, d'un coup :

```bash
npm run build && npm run check
npm run serve         # construit puis sert docs/ sur http://localhost:8080
```

### Publier

Deux voies, au choix :

**A. Sans rien configurer.** Le dossier `docs/` est versionné et contient le site construit.
Dans *Settings → Pages*, choisissez **Deploy from a branch → `main` → `/docs`**. C'est en ligne.

**B. Avec GitHub Actions.** Dans *Settings → Pages*, choisissez **GitHub Actions**.
Le workflow `.github/workflows/pages.yml` reconstruit les pages, les images de partage et
lance la vérification à chaque poussée sur `main`. Si la vérification échoue — lien cassé,
JSON-LD invalide, balise manquante, ressource externe — **le site n'est pas publié**.

> Si vous déployez ailleurs qu'à l'adresse `https://ouaisfieu.github.io/a-propos/`,
> changez `baseUrl` dans `src/data/site.mjs` puis reconstruisez : les URL canoniques,
> le sitemap, le flux RSS et les images Open Graph sont absolues et en dépendent.

### Architecture

```
src/data/roots.tsv     226 racines : dépôt, titre, thème, type, HTTP, date de création
src/data/site.mjs      identité, thèmes, types, métriques d'audit, dimensions
src/data/claims.mjs    26 affirmations, 7 statuts, 4 rôles de fiabilité, FAQ
src/data/plan.mjs      21 correctifs P0/P1/P2, portefeuille, constellations
src/data/load.mjs      chargement, validation (échoue si ≠ 226) et agrégats dérivés
src/templates/         layout (head, en-tête, partage, pied) et composants de visualisation
src/pages/             une fonction par famille de pages
build.mjs              orchestrateur : pages + données ouvertes + fichiers SEO
build/og.mjs           images de partage et icônes, rendues par Chromium
build/check.mjs        vérification du site construit
```

Le générateur **échoue à la construction** si l'inventaire ne contient pas exactement
226 racines ou si un thème ou un type est inconnu. Les données ne peuvent pas dériver
silencieusement.

---

## Données ouvertes

| Fichier | Contenu | Licence |
|---|---|---|
| `docs/data/roots.json` | Les 226 racines, en `Dataset` schema.org | ODbL 1.0 |
| `docs/data/claims.json` | Les 26 affirmations, leur statut et leur verdict | CC BY 4.0 |
| `docs/data/graph.json` | Nœuds et arêtes du graphe, avec degrés et composantes | ODbL 1.0 |
| `docs/data/metrics.json` | Métriques d'audit + recomptage indépendant | ODbL 1.0 |
| `docs/data/archipel.csv` | Tableur complet, avec lien vers chaque fiche | ODbL 1.0 |

---

## Ce que ce site ne fait pas

- Il **note des publications, pas des personnes.** Les affaires judiciaires sont citées par
  leurs sources institutionnelles ; la présomption d'innocence s'applique à toute personne
  visée par une procédure.
- Il **ne reproduit ni ne relaie les fiches nominatives** de « lead-dexing ». La pratique est
  discutée comme méthode, sur la page Doctrine.
- Il **n'est pas un audit** d'accessibilité, de sécurité ou de performance de l'archipel.
  Le relevé porte sur le HTML initial des racines, pas sur leur exécution.
- Il **n'est pas rafraîchi automatiquement.** C'est un instantané daté du 26 août 2026.

Une erreur factuelle ? Ouvrez une *issue* en citant l'ancre de la fiche (`#greco-22`, `#cp-576`…)
et la source primaire qui la contredit. La correction est publiée, datée et **conservée** —
jamais effacée silencieusement.

---

## Voir aussi

- [NEXUS — Atlas des GitHub Pages](https://yannkeep.github.io/nexus/) — le catalogue source
- [ouaisfieu.github.io](https://ouaisfieu.github.io/) · [yannkeep.github.io](https://yannkeep.github.io/)
- [**11·60 bis — dl.ouaisfi.eu/usba**](https://dl.ouaisfi.eu/usba/) — le versant fichiers de l'archipel

---

Rédaction, analyse, conception et code : **Claude (Anthropic)**.
Rattachement éditorial : **CCPLC — Collectif Citoyen pour la Participation Libre & Consciente**.
Commanditaire anonyme, à sa demande.

Code MIT · Contenu CC BY 4.0 · Données ODbL — voir [`LICENSE`](LICENSE).
