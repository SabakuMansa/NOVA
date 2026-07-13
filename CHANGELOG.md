# Journal des modifications — NOVA Studio

> Session de travail autonome (nuit). **Tout est strictement local, aucun `git push`.**
> À relire au matin avant toute mise en production.

---

## [NUIT 2026-07-12 · ÉTAPE 0] Bug « images manquantes dans le menu » — diagnostic

**Préalable RTK** — hook **actif et configuré** (`rtk init --show` → Hook OK, RTK.md OK,
settings.json OK). Rien à signaler, le travail continue normalement.

**Constat : aucun bug d'images à corriger.** Investigation complète menée *avant* toute
modification :
- Le site ne contient **aucune image raster** ni `next/image`. `git ls-files` → un seul
  fichier image versionné : `app/icon.svg` (le favicon). Pas de dossier `public/`. Aucun
  chemin d'image dans `content/site.ts` (relu intégralement).
- Toutes les « images » sont des **SVG inline** (24 dans le DOM) : illustrations
  `Motifs.tsx` (plate / bag / tools / heart) de l'Aperçu + icônes. Un SVG inline ne peut
  pas avoir de « chemin cassé ».
- « La Carte » est **100 % typographique** (un menu de texte, aucune photo) — par design.
- `git log --diff-filter=D` → **aucun fichier image supprimé**. Historique de
  `content/site.ts` : 4 commits cohérents, aucun chemin corrompu.
- Build **propre** : `GET / → 200`, aucune erreur serveur ni console.

**Pourquoi ça « semblait » cassé (et pourquoi ce n'est PAS un bug utilisateur)**
Dans l'outil de preview, les sections animées par Framer Motion (`Reveal` / `ScaleReveal`,
`whileInView`) apparaissent **blanches**. Cause identifiée : l'onglet preview est **en
arrière-plan** (`document.visibilityState === "hidden"`), ce qui met `requestAnimationFrame`
en pause → les animations framer restent **figées à `opacity:0`** (mesuré : reveals bloqués
à opacity 0.11 / 0, transform figé, plusieurs secondes après entrée dans le viewport).
Preuve : le **hero** (migré en animations **CSS** au Chantier 2 pour la robustesse)
s'affiche **parfaitement** dans la même capture, tandis que les sections framer sont vides.
En navigateur réel/visible — comme vérifié dans l'entrée [ÉTAPE 0] précédente « dans Chrome
réel » — tout le contenu et les motifs s'affichent normalement.

**Décision : rien modifié.** Corriger un bug inexistant aurait introduit une régression sur
un site qui fonctionne (règle « aucune régression tolérée »).
⚠️ Fragilité réelle, déjà connue (cf. entrée précédente) : le contenu framer est livré à
`opacity:0` et dépend du JS pour apparaître. Durcissement possible **à valider** : dégrader
`Reveal` pour laisser le contenu visible si l'animation ne se lance pas (comme le hero).
**Non appliqué cette nuit** — voir le blocage de vérification ci-dessous.

**Vérifications de conformité (fiables, indépendantes du preview)**
- Règle « jamais *Uber* dans le contenu visible » : **respectée** — la marque n'apparaît
  que dans le technique non-visible (`lib/delivery/uber-direct-client.ts`, `types.ts`,
  `index.ts`, route `app/api/webhooks/uber-direct/`). `content/site.ts` + composants :
  0 occurrence.
- 5 phrases interdites : toutes **absentes**.
- SEO structurel : **1 seul `<h1>`**, **1 bloc JSON-LD**, `<title>` + meta description
  présents, hiérarchie h1→h2→h3 cohérente. Rien d'urgent.
- Module « Commande & Livraison » (Étape 1) : **déjà construit** (git log + `lib/delivery/`,
  `app/api/delivery/`, `components/delivery/`, pages `/demo/*`). À vérifier/affiner, **pas**
  à reconstruire.

**⚠️ Blocage de vérification à connaître**
La règle « vérifier visuellement chaque changement » est **compromise dans ce harnais** :
l'onglet preview étant en arrière-plan, toute section animée par framer rend **blanc** à la
capture (les vérifs *de code* restent fiables, pas les vérifs *visuelles* des sections
animées). J'ai préféré m'arrêter là et te le signaler plutôt qu'enchaîner des changements
design non vérifiables sur un site déjà validé. Options pour la suite dans mon message.

---

## [ÉTAPE 0] Correction de la page blanche + robustesse

**Cause exacte**
Le symptôme « seul le fond s'affiche » n'était **pas** un composant sans `"use client"` :
vérification faite, tous les composants utilisant Framer Motion (`Reveal`, `ScaleReveal`,
`Hero`, `Nav`, `Process`, `Configurator`, `Contact`) ont bien la directive.
La page blanche venait d'un **état de build/HMR corrompu** hérité des erreurs de
compilation transitoires survenues pendant l'édition des animations (SWC « Unexpected
token section » quand une balise JSX était momentanément déséquilibrée entre deux
sauvegardes). Le contenu était rendu côté serveur à `opacity:0` (état initial des
animations), et le bundle client cassé ne relançait jamais les animations → tout restait
invisible.

**Correction**
- Rebuild propre (`rm -rf .next`) + redémarrage du serveur → le contenu s'affiche et
  toutes les animations fonctionnent (vérifié dans Chrome réel : stagger du hero, reveals
  au scroll, barre de progression moutarde, lien de nav actif, timeline du process).
- Suppression du warning Framer « container has a non-static position » : ajout de
  `relative` sur la `<section>` du Process (le `useScroll` a besoin d'un contexte positionné
  pour calculer l'offset correctement).
- **Ajout d'une frontière d'erreur** `app/error.tsx` (suggérée par le brief) : si un
  composant client lève une erreur à l'avenir, l'utilisateur voit une page sobre aux
  couleurs du site (« Réessayer » / « Retour à l'accueil ») au lieu d'un écran blanc.

**Vérification effectuée**
- Rendu complet vérifié dans Chrome réel (hero + toutes sections + animations).
- Console : plus aucune erreur ni warning Framer (restent seulement les logs debug de
  Vercel Analytics, normaux en développement).
- `npx tsc --noEmit` : aucune erreur de type.

---

## [Chantier 1] Référencement (SEO technique)

**Ce qui a été fait**
- `<title>` enrichi et local : « NOVA Studio — Création de sites internet pour
  commerçants, Île-de-France ».
- `<meta description>` réécrite avec les cibles locales (restaurants, boutiques,
  artisans ; Saint-Maur-des-Fossés, Suresnes, Val-de-Marne, Hauts-de-Seine).
- `keywords` étendus aux deux départements et aux types de commerce.
- JSON-LD `ProfessionalService` : `areaServed` détaillé (Île-de-France + Val-de-Marne
  + Hauts-de-Seine + Saint-Maur-des-Fossés + Suresnes).
- Vérifié : Open Graph + Twitter Card, `sitemap.xml`, `robots.txt`, `opengraph-image`
  (image de partage générée), `favicon` (icon.svg) — tous en HTTP 200.
- Hiérarchie des titres : **un seul `<h1>`** (hero), 8 `<h2>` (un par section), 15 `<h3>`.
- Illustrations : 24 SVG, toutes décoratives et correctement marquées `aria-hidden`
  (aucune balise `<img>`, donc pas d'`alt` manquant — approche a11y correcte pour du
  décoratif ; le sens est porté par le texte).

**Pourquoi**
Cibler les requêtes locales « création site internet commerçants + villes/départements »,
et donner aux moteurs/réseaux sociaux des métadonnées propres et structurées.

**Vérification effectuée**
- `<head>` inspecté via fetch : title, description, canonical, JSON-LD (5 zones) corrects.
- Routes SEO testées : sitemap/robots/OG/favicon → 200.
- `npx tsc --noEmit` OK.

> ⚠️ **À faire au matin** : `seo.siteUrl` (`content/site.ts`) pointe encore sur le
> domaine placeholder `https://nova-studio.fr`. Il alimente canonical, OG, sitemap et
> JSON-LD → à remplacer par le vrai domaine (ou l'URL Vercel actuelle) avant indexation.

---

## [Chantier 2] Performance (en cours)

**Mesure Lighthouse (build de production, `next start`)**
Performance **91** · Accessibilité **95** · Bonnes pratiques **96** · SEO **100**.
Métriques : FCP 1,0 s · **LCP 3,5 s** (point faible) · TBT 20 ms · CLS 0.

**Ce qui a été fait**
- **Hero converti d'animations JS (Framer) → animations CSS** (`.hero-rise` /
  `.hero-slate` dans `globals.css`) et repassé en **composant serveur** (plus de
  `"use client"`). Le contenu above-the-fold est désormais rendu côté serveur et animé
  dès le parsing CSS.
  - *Pourquoi* : le hero était en `opacity:0` jusqu'au chargement de Framer Motion →
    LCP lent **et** cause racine du risque d'écran blanc. En CSS, il s'affiche
    immédiatement, sans dépendre du JS. Bonus : un peu moins de JS client.
- Audit des animations : **aucune** n'anime `width`/`height`/`top` — uniquement
  `transform` et `opacity` (bon pour la perf).
- Polices : `font-display: swap` sur les 3 (Instrument Serif, Work Sans, IBM Plex Mono),
  auto-hébergées et préchargées par `next/font`.
- Images : aucune balise `<img>` (tout en SVG inline) → rien à lazy-loader ni à
  compresser.

**Vérification effectuée**
- `npx tsc --noEmit` OK · rendu hero vérifié dans Chrome réel (affichage instantané).

**Reste à faire (Chantier 2)**
- Ajouter `app/favicon.ico` (le navigateur requête `/favicon.ico` → 404 en console,
  seul point qui plombe « bonnes pratiques »).
- Re-mesurer Lighthouse après le passage CSS du hero (LCP attendu en forte baisse).

---

## [Module] Commande & Livraison

### A. Module technique (sandbox)
Bloc **isolé et optionnel** — le cœur du site n'en dépend pas ; le site fonctionne
normalement même si `DELIVERY_MODE` n'est pas configuré (fallback `demo`).

- `lib/delivery/` : `types.ts` (interface `DeliveryProvider`), `mock-provider.ts`
  (mode démo, statut qui évolue tout seul Préparation → Coursier → Livré en ~20 s,
  **sans aucun appel réseau**, stateless via l'horodatage encodé dans l'id),
  `uber-direct-client.ts` (mode live, OAuth2 + quote/create/status — credentials lues
  UNIQUEMENT depuis l'environnement, jamais en dur), `index.ts` (sélection du
  fournisseur selon `DELIVERY_MODE`).
- Routes API : `POST /api/delivery/quote`, `POST /api/delivery/create`,
  `GET /api/delivery/status`, `POST /api/webhooks/uber-direct` (inactif en démo).
- Composants : `DeliveryOptionSelector` (retrait/livraison + devis),
  `DeliveryTracker` (timeline + ETA, polling 2 s).
- Page sandbox `/demo/livraison` (non reliée à la nav).
- `README-delivery.md` (dont : le passage en `live` exige l'onboarding Uber Direct
  fait par le commerçant lui-même) + `.env.example` (gabarit sans valeurs réelles).

**Vérification** : build OK (4 routes API + page démo). Flux testé en mode démo via
l'API : quote (4,64 € / 34 min) → create (preparing) → status auto-évolue en
« courier_en_route » après 7 s → webhook démo renvoie `processed:false`. Aucune
credential en dur.

### B. Contenu marketing (site public)
- **Section « Le problème »** : 5ᵉ carte « La commission » (pleine largeur car nombre
  impair) — « Chaque commande livrée via une plateforme… c'est celui de la plateforme. »
- **« La Carte »** : bloc add-on « Commande directe » **sous** le carton menu (jamais
  dans le menu, pour ne pas le fragmenter), présenté comme add-on de Croissance
  Digitale. Accroche + description + ligne de comparaison **prudente sans chiffre
  inventé**.
- **Configurateur** : 3ᵉ option facultative « Avec commande directe » (case à cocher
  discrète) → ajoute un bandeau « Livraison sans commission » + bouton « Commander »
  dans l'aperçu, aux couleurs de la maquette.

**Contrainte respectée** : le mot **« Uber » n'apparaît NULLE PART** dans le texte
visible (0 occurrence dans `content/`, `components/` et le HTML rendu). Réservé au
code/README/API. Aucun chiffre de commission non vérifié affiché.

### C. Tarif « Suppléments à la carte » (dans La Carte)
- Remplacement de l'ancien bloc add-on sauge par une **section « Suppléments à la
  carte »** intégrée **dans le carton menu**, sous les 3 formules (inchangées).
- Ligne au style menu (Plex Mono, points de suite, prix aligné à droite),
  **visiblement plus discrète** que les 3 offres (titre + prix en plus petit) :
  « Commande & Livraison directe … 450€ à l'activation + 25€/mois ».
- Description courte + mention de disponibilité (Site Autonome / Croissance Digitale)
  + note précisant que **le coût de chaque livraison est payé séparément** au
  prestataire, non inclus dans ce tarif.
- Aucune nouvelle couleur, aucun CTA séparé (le CTA existant couvre la question),
  aucune mention « Uber ». Prix des 3 formules vérifiés inchangés (690€/1490€/dès 1990€).

### D. Démo interactive du supplément (dans La Carte)
- Sous le bloc supplément, bouton discret **« Essayer la démo »** (fermé par défaut) qui
  déploie un widget `components/delivery/DeliveryDemo.tsx` — **branché sur le
  `mock-provider` existant** (`createDelivery`), aucune logique de simulation recréée,
  aucun appel réseau réel.
- Parcours simulé en 3 temps déclenché par le visiteur : **panier fictif** (La Table du
  Marché, 2 plats, 25,50 €) → **« Commande reçue »** (n° de commande + ETA) →
  **suivi automatique** « Commande en préparation » → « Livreur en route » (petit
  livreur qui avance le long d'une piste, `transform`/`opacity`, easing
  `[0.22,1,0.36,1]`, ~2,5 s/étape) → « Livré ». Bouton **« Revoir la démo »** pour
  rejouer (jamais d'état figé).
- Mention discrète sous le widget : « Démonstration simplifiée à titre d'exemple… ».
- Palette NOVA uniquement, **aucune mention « Uber »/« livreur » du prestataire**.

**Vérification** : cycle complet testé dans Chrome (déclenchement → progression auto →
« Livré » → relance), layout OK en mobile 390px (aucun débordement), 0 erreur console,
build de prod OK.

### E. Page de commande simulée complète (`/demo/commande`)
- **Lien cliquable** depuis La Carte (« Ouvrir un exemple de commande complet ↗ »,
  nouvel onglet) → page dédiée qui simule le **parcours client réel** d'un restaurant
  fictif (La Table du Marché) : **menu** (ajout/quantités, panier fixe) → **checkout**
  (récap + adresse + devis de livraison) → **confirmation** (n° de commande + ETA) →
  **suivi en direct** (timeline Préparation → Coursier en route → Livré + ETA).
- Réutilise `mock-provider` via les **routes API** (`/api/delivery/quote`, `/create`,
  `/status`) et les composants `DeliveryOptionSelector` + `DeliveryTracker` déjà faits.
- La course n'est créée qu'à l'ouverture du suivi → le visiteur **voit toujours la
  progression en direct** (l'horloge de démo démarre à ce moment-là).
- 100 % sandbox : aucune vraie commande, aucun paiement, aucun appel externe. Palette
  NOVA. On parle d'« un livreur »/« coursier », **jamais** du prestataire technique.

**Vérification** : parcours complet testé dans Chrome (menu → panier → devis 5,54 € →
commande → suivi qui progresse « En préparation » → « Coursier en route » → « Livré »),
mobile 390px OK (barre panier fixe sans débordement), 0 erreur console, build de prod OK,
0 mention « Uber » dans le texte visible.

---

## [Refonte v3] Direction « geek coloré » (niveau soumission Awwwards)

### Réponses obtenues en phase de questions (13/07/2026)
- **Direction** : référence donnée par le client — **appsignal.com** (« plein de
  couleur, un peu geek, c'est plus mon univers »). Les 3 pistes proposées
  (journée du commerçant / éditorial local / clarté B2B) n'ont pas été retenues.
- **Technique** : équilibré — 1 seul moment WebGL, cible Lighthouse 85+.
- **Contenu** : **carte blanche totale** (copy réécrit, « La Carte » remplacée).
- **Portée** : tout d'un coup, **mobile = desktop**.

### Recherche (INSPIRATION.md)
Exploration réelle d'awwwards.com (Sites of the Day) + analyse des 6 sites
fournis par le client (Longbow, Vectr, Julien Calot, Depo Luxe, Lula Oil,
LunaSol) + références vérifiées en session (By-Kin, Mat Voyce, Minh Pham).
Documenté dans `INSPIRATION.md`, avec la direction validée.

### Ce qui a été construit — espace isolé `/v3` (noindex)
- **Nouvelle identité** : fond lait `#FBF7EF`, encre `#211D16`, accents vifs
  corail/violet/teal/jaune/rose, cartes « sticker » (bordure 2px + ombre franche),
  fenêtres façon app (barre de titre à pastilles), labels monospace. Palette
  ajoutée en additif dans Tailwind (aucun impact sur l'existant).
- **Nouveau copy** (`content/v3.ts`) : ton direct et joueur, vouvoiement,
  faits inchangés (prix 690/1490/dès 1990 € + mensuels, add-on livraison
  450 € + 25 €/mois avec sa note légale, villes, process 6 étapes, légitimité
  restaurateur). Aucune phrase interdite, aucun « Uber » visible.
- **Nouvelle signature** (remplace le menu de resto) : **« Pendant que vous êtes
  en plein service, votre site bosse »** — fenêtre « live » dans le hero avec un
  flux de notifications simulé (résa, avis, commande, admin) qui défile.
- **Sections** : hero aurora + ticker (villes/cibles) + constat (4 cartes
  sticker) + « trois moteurs » (bento) + plans (fenêtres de pricing, plan
  Autonome mis en avant, add-on livraison + lien démo /demo/commande) +
  process sur encre + fondateur (3 situations vécues) + contact (formulaire
  en fenêtre) + footer.
- **Le moment WebGL** : shader « aurora » (blobs violet/corail/teal/jaune sur
  lait, lueur qui suit le curseur) — même architecture perf que le hero /v2
  vérifié : chargement différé après `load`+idle, pause hors écran
  (IntersectionObserver → frameloop never), **fallback CSS animé sur
  mobile/tactile** (aucun canvas en 390px), statique en reduced-motion.
- `prefers-reduced-motion` : ticker, notifs, blobs et hover stoppés ; contenu
  100 % lisible sans JS (texte dans le DOM, animations à `fill-mode: both`).

### Vérification
- `tsc --noEmit` ✅ · build prod ✅ (21 routes, `/v3` statique 9,66 kB).
- Visuel vérifié section par section (preview) : **desktop** (hero, ticker,
  constat, moteurs, plans, process, contact) et **mobile 390px** (hero, plans —
  `scrollWidth` = 390, zéro débordement).
- 0 erreur console. Ancien one-page `/` revérifié : **inchangé**.
- **Lighthouse (build prod, /v3)** : **Perf 91 · Accessibilité 95 · Bonnes
  pratiques 96 · SEO 92** — TBT 0 ms, CLS 0, LCP 3,5 s (borné par le swap de
  webfont sous throttling, comme mesuré précédemment sur les autres pages).
  Cible 85+ atteinte.

> Espace en évaluation : `/v3` est noindex et n'est PAS poussé. L'ancien site
> et /v2 restent accessibles pour comparaison.

---

## [Promotion v3] La refonte devient LE site (racine `/`)

**Commit de sécurité préalable** : l'état complet (toutes versions) était déjà
committé en local (`341ad19`) avant restructuration — tout est récupérable.

### Déplacements (aucun fichier supprimé — uniquement des `git mv`)
- `app/v3/page.tsx` → **`app/page.tsx`** : la v3 « geek coloré » est désormais
  la page d'accueil. Ses métadonnées (title/description/OG/Twitter, indexables)
  ont été fusionnées dans `app/layout.tsx` ; slogan JSON-LD mis à jour.
- Anciennes versions **archivées hors routing public** dans `app/_archive/`
  (dossier privé Next.js, préfixe `_` = jamais routé) :
  - `app/_archive/v1-onepage.tsx` (ex-`app/page.tsx`, le one-page bistrot)
  - `app/_archive/v2/` (l'essai multi-pages complet)
  - `app/_archive/signature/` (la pièce WebGL isolée)
  - `app/_archive/v3-layout.tsx` (layout v3, fusionné dans la racine)
- Les composants et contenus (`components/*`, `content/site.ts`, `content/v3.ts`)
  restent en place — les archives compilent toujours (rien de cassé, rien de perdu).

### Routes publiques
- `/` → la v3, indexable (noindex retiré avec la promotion).
- `/v2`, `/v2/*`, `/v3`, `/v3/*`, `/signature` → **redirection 307 vers `/`**
  (via `next.config.mjs` — plus simple à maintenir qu'une 404 dédiée).
- `/demo/commande` et `/demo/livraison` conservés (liés depuis les plans),
  exclus du crawl via `robots.txt` (`Disallow: /demo`).
- `sitemap.xml` → ancres v3 (`#constat #moteur #plans #process #fondateur
  #contact`) ; règle robots obsolète `/v2` retirée.
- **Favicon** et **image Open Graph** refaits à l'identité v3 (badge N jaune,
  surligneur, blobs colorés).

### Vérification
- `tsc` ✅ · `npm run build` ✅ — 14 routes (contre 21), plus aucune route
  `/v2`/`/v3`/`/signature` générée.
- Runtime (build de prod) : `/` = 200 avec le contenu v3 · les 4 anciennes URLs
  testées → 307 vers `/` · démos 200 · sitemap/robots/OG/favicon 200.
- Visuel : racine identique à l'ancienne `/v3` (hero aurora + fenêtre LIVE,
  notifs qui tournent), 0 erreur console.

---

## [Cohérence DA v3] Ticker retiré + toutes les pages publiques passées en v3

- **Ticker (bandeau déroulant) supprimé** de la page d'accueil, à la demande du client.
- **`/demo/commande` et `/demo/livraison` refaits en DA v3** (lait/encre, cartes
  sticker, boutons corail/jaune, labels mono) — la logique sandbox est inchangée ;
  composants `DeliveryOptionSelector` et `DeliveryTracker` restylés (fenêtre v3-window).
- **Page d'erreur** (`error.tsx`) passée en v3 + **404 personnalisée** ajoutée
  (`not-found.tsx`, « Cette page n'est pas à la carte »).
- Focus clavier global passé du lie-de-vin au violet v3.
- Balayage complet anti-ancienne-DA sur les fichiers publics : les seuls restes
  (`font-display` italique dans Sections.tsx) sont des touches volontaires ;
  `DeliveryDemo` (ancienne DA) n'est importé que par l'archive.
- Vérifié : tsc ✅, build 14 routes ✅, ticker absent du DOM, /demo/* rendus v3,
  404 en 404 réel avec la page custom, 0 mention « Uber » visible.

---

## [Copywriting v3] Réécriture complète du texte pour coller au ton visuel

**Contexte** : le design v3 « geek coloré » est validé, mais les textes dataient
de la DA précédente (« chaleureux restaurateur »). Objectif : un copy accrocheur,
direct, avec de la personnalité, sans jargon — et recentré sur **tous les
commerçants locaux** (boutiques, artisans, restaurants, assos), pas seulement les
restaurateurs.

**Références consultées (WebSearch/WebFetch, pas de Chrome)**
- **Linear** — phrases < 20 mots, énoncés qui vont droit au bénéfice, jargon
  vulgarisé (« structural diffs » expliqué, pas asséné).
- **Raycast** — le plus proche du ton visé : questions rhétoriques (« Tired of
  typing the same thing? »), problèmes relatables, bénéfice-action plutôt que
  specs (« keyboard first » et non « input optimization »). 5–12 mots/phrase.
- **Stripe (FR)** — vulgariser sans infantiliser : bénéfice d'abord, preuve par
  les chiffres concrets plutôt que par les adjectifs.
- **Qonto (FR)** — modèle de ton FR moderne pour non-tech : fragments nominaux
  (« Fini la paperasse »), impératif/infinitif dans les CTA, zéro jargon bancaire.

**Mécanique de ton retenue** (forme, pas vocabulaire — la cible NOVA n'est pas dev)
- Une idée par phrase, phrases courtes, fragments nominaux autorisés
  (« Des prix affichés. Oui, vraiment. »).
- Personnalité par la question rhétorique + le problème vécu, pas par le gag gratuit.
- Bénéfice/résultat d'abord, jamais la spec (« vous changez tout en deux minutes »,
  jamais « CMS »/« responsive »).
- Confiance par le fait concret : 15 min, 48h, 0 %, prix affichés.

**Recentrage cible (dé-restaurantisation)**
- Hero, sous-titre, flux de notifs, constat, moteur, plans : tous les exemples
  trop « resto » (couverts, réservation de table, « en salle », menu) remplacés
  par des exemples génériques (horaires, photos, avis Google, prise de contact,
  rendez-vous, commande) qui parlent à n'importe quel commerce.
- **Conservé volontairement** : la section « Qui suis-je » (crédibilité) reste
  celle d'un restaurateur en activité — c'est un fait vécu, pas une promesse de
  ciblage. Le sous-titre du hero garde « Je gère des restaurants » comme ancrage
  de légitimité, puis élargit à « les commerçants du coin ».

**Titre du hero — 2 variantes proposées**
- **B (retenue par le client, en ligne)** : « Votre site devrait *bosser* autant
  que vous. » — même idée que A, ton plus mordant. Highlight jaune sur « bosser ».
- **A (alternative, écartée)** : « Vous faites votre métier. Votre site fait *le
  reste*. » — universelle et parallèle. Basculable en 3 champs dans `content/v3.ts`.

**Structure** : ordre des sections inchangé (Hero → Constat → Moteur → Plans/La
Carte → Process → Fondateur → Contact). Le concept « menu/La Carte » des offres
est conservé tel quel.

**Vérifications** : `tsc` ✅, build 14 routes ✅, 0 phrase interdite, 0 « Uber »
visible, 6 titres de section cohérents en ton, rendu hero + notifs vérifié en
preview. **Aucun push** — en attente du choix de variante hero par le client.

---

## [Repositionnement stratégique] Fini « on vend un site », place au déclic

**Contexte** : le titre hero variante B (« Votre site devrait bosser autant que
vous. ») a été validé et mis en ligne. Ce chantier va plus loin : changer la
nature du message central du site. Objectif : ne plus convaincre le commerçant
qu'il « a besoin d'un site », mais lui faire réaliser que **son commerce est
meilleur que ce qu'on en voit en ligne** — le déclic qui amène naturellement
vers l'audit gratuit.

### 1. Nouveau positionnement

- **Reformulation clé appliquée** : plus jamais « création de site » comme
  accroche — remplacé par **« une vitrine numérique à la hauteur de votre
  commerce »**, intégrée directement dans le titre de la section « Ce que ça
  fait » (`v3moteur.title` : *« Pas juste un site. Une vitrine à la hauteur de
  votre commerce. »*) et dans le sous-titre du Hero.
- **« Opportunités » remplace « clients perdus »** partout où l'idée de perte
  apparaissait (sous-titre du Constat, carte « Il dort ») — même constat, ton
  moins agressif, plus juste.
- **Les 3 phrases fournies, placées chacune à un endroit différent** (pas
  toutes au même endroit, pour ne pas surcharger) :
  - *« Vos futurs clients vous cherchent déjà. Assurez-vous qu'ils vous
    trouvent. »* → **titre du Hero**, remplace la variante B précédente.
    Repositionne l'angle de « le site bosse » vers « vous êtes déjà cherché,
    encore faut-il qu'on vous trouve ».
  - *« Que voit un nouveau client lorsqu'il découvre votre commerce sur
    internet ? »* → **titre de la section Constat** (`v3constat.title`).
    Ouvre directement sur le miroir tendu au commerçant.
  - *« Votre site actuel, il fait quoi, là, tout de suite ? »* → **ligne
    isolée** (`v3constat.rupture`), affichée seule entre la grille de 4 cartes
    du Constat et la section Moteur. Marque une rupture de rythme au lieu de
    rester un titre de section comme avant.
- Hero et section Problème réécrits en cohérence (`content/v3.ts` :
  `v3hero.subtitle`, `v3constat.title/subtitle/rupture/cards[0]`).

### 2. Épuration du contenu

- **Section Moteur** : passée de 4 cartes bento à **3**, layout simplifié en
  grille égale (plus de carte large asymétrique orpheline). La suppression de
  la 4ᵉ carte (Commande directe) sert à la fois l'épuration et le point 3
  ci-dessous.
- **Section Plans** : le bloc add-on « Module Commande & Livraison directe »
  (icône 🛵, prix, lien démo) entièrement retiré de l'affichage — ne reste que
  la note de bas de section (`v3plans.footnote`). Section nettement plus
  courte.
- **Section Fondateur (homepage)** : les 3 cartes `>_` + la citation de
  clôture ont été retirées de la page d'accueil, remplacées par un **teaser
  d'une phrase** + un lien « Voir mon parcours → » vers la nouvelle page
  dédiée (point 4). Le contenu complet n'est pas perdu : il vit maintenant sur
  `/qui-je-suis`.

### 3. Module Commande & Livraison masqué de l'affichage public

**Aucun fichier ni code supprimé** — uniquement désactivé de l'affichage,
même logique que l'archivage v1/v2 :
- `content/v3.ts` : l'entrée « Commande directe » du bento (`v3moteur.bento`)
  a désormais `hidden: true` ; `v3plans.addon` reste défini tel quel, simplement
  plus rendu par le composant.
- `components/v3/Sections.tsx` : `V3Moteur` filtre `bento.filter(b =>
  !b.hidden)` ; `V3Plans` ne rend plus le bloc addon.
- Les pages `/demo/commande` et `/demo/livraison`, ainsi que les composants
  `components/delivery/*` et les routes `app/api/delivery/*`, restent
  **intacts et fonctionnels** — juste non liés depuis la nav ou la homepage
  (vérifié : les deux répondent toujours en 200 en accès direct).
- Ce module reviendra en avant plus tard ; il suffira de repasser `hidden` à
  `false` et de rétablir le bloc addon dans `V3Plans`.

### 4. Nouvelle page « Qui je suis »

- **`app/qui-je-suis/page.tsx`** créée : présente le fondateur en détail
  (gérant de plusieurs restaurants en Île-de-France, à l'origine de NOVA
  Studio suite à ce constat vécu). Reste factuel — aucune date ni détail
  inventé au-delà de ce qui était déjà établi ailleurs sur le site.
  Contenu piloté par de nouveaux champs sur `v3fondateur`
  (`pageIntro`, réutilise `points`/`closing`/`badges`) dans `content/v3.ts`.
  Métadonnées SEO dédiées (title/description).
- **Navigation mise à jour** : le lien « Qui suis-je » (`v3nav.links`) pointe
  désormais vers `/qui-je-suis` au lieu de l'ancre `#fondateur`. Tous les
  autres liens de nav (ancres) sont passés en chemins absolus (`/#constat`,
  `/#moteur`, etc.) pour fonctionner correctement depuis n'importe quelle page
  du site, pas seulement l'accueil — nécessaire dès qu'une deuxième page
  existe. Logo de la nav : `#top` → `/`.
- **`app/sitemap.ts`** : ajout de l'URL `/qui-je-suis` (priorité 0.7), retrait
  de l'ancre `#fondateur` obsolète.
- **`components/JsonLd.tsx`** : `slogan` mis à jour pour matcher le nouveau
  titre du Hero (était encore l'ancienne accroche « Pendant que vous êtes en
  plein service »).

### Vérifications effectuées

- `tsc --noEmit` ✅ aucune erreur.
- Build production : **15 routes** générées proprement (`/qui-je-suis` inclus).
- Balayage : 0 phrase interdite, 0 « clients perdus », 0 « Uber » visible,
  0 mention du module livraison hors data/démo.
- Preview vérifiée en direct : Hero (nouveau titre + highlight), Constat
  (nouveau titre + ligne de rupture), Moteur (3 cartes égales, sans livraison),
  Plans (sans bloc addon), Fondateur (teaser condensé + lien), page
  `/qui-je-suis` complète (intro, points, citation, CTA, footer) accessible en
  navigation directe, `sitemap.xml` à jour, `/demo/commande` et
  `/demo/livraison` toujours répondent en 200 (code intact, juste non liés).
  Aucune erreur console.
- **Aucun push** — en attente de relecture avant mise en ligne.
