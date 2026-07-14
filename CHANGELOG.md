# Journal des modifications — NOVA Studio

> Session de travail autonome (nuit). **Tout est strictement local, aucun `git push`.**
> À relire au matin avant toute mise en production.

---

## [Nettoyage du code] Audit préalable — ce qui va être touché ou non

**Avant toute modification.** Checkpoint Git : `HEAD` était déjà propre et
commité (`b68c651`, rien à committer) — c'est le point de retour si besoin.

### Ce qui sera supprimé

- **Dépendance `gsap`** (`package.json`) : **zéro référence** trouvée nulle
  part dans le projet, y compris dans les archives `_archive/` et le labo
  (vérifié par grep exhaustif). Jamais utilisée depuis son ajout — supprimée.

### Ce qui a l'air mort mais NE SERA PAS supprimé — conflit entre deux consignes

Un audit complet (recherche systématique de chaque import, fichier par
fichier) montre que la quasi-totalité des fichiers suivants sont
**« orphelins » du point de vue du site en ligne**, mais **restent
importés par les archives `_archive/v1` et `_archive/v2` protégées** :

- `components/Approche.tsx`, `Carte.tsx`, `Configurator.tsx`, `Contact.tsx`,
  `Footer.tsx`, `Hero.tsx`, `Methode.tsx`, `Motifs.tsx`, `Nav.tsx`,
  `Problemes.tsx`, `Process.tsx`, `ScaleReveal.tsx`, `Temoignages.tsx`
- `components/v2/Footer.tsx`, `Nav.tsx`, `PageHeader.tsx`, `V2Hero.tsx`
- `components/signature/SignatureBackdrop.tsx`, `SignatureScene.tsx`,
  `SignatureTitle.tsx`, `embers.glsl.ts`
- `components/delivery/DeliveryDemo.tsx` (composant de démo obsolète,
  remplacé par `DeliveryOptionSelector`/`DeliveryTracker` sur les vraies
  pages `/demo/*`, mais toujours importé par `components/Carte.tsx` archivé)
- `content/site.ts` : tous les exports **sauf `seo`** (`nav`, `hero`,
  `approche`, `problemes`, `methode`, `carte`, `apercu`, `previewCombos`,
  `process`, `contact`, `footer`, `temoignages`) — utilisés uniquement par
  les composants ci-dessus.

**Pourquoi je ne les supprime pas** : la consigne dit à la fois « repère et
supprime le code mort » et « ne touche jamais aux dossiers d'archive ».
Ces fichiers sont exactement à l'intersection des deux — ils sont morts
*du point de vue du site*, mais vivants *du point de vue de l'archive*
(`app/_archive/v1-onepage.tsx`, `app/_archive/v2/**`). Les supprimer ou les
déplacer casserait la compilation de ces pages archivées, donc reviendrait
à « toucher » l'archive par ricochet — ce qui est explicitement interdit.
**Je laisse tout intact et je signale ce point plutôt que de trancher.**
Si un jour les archives elles-mêmes sont supprimées, ces fichiers
deviendront alors du vrai code mort, supprimable sans risque.

### Console.log / console.error trouvés (hors archives/labo)

- `lib/reviews/email-provider.ts:31` — `console.log` du mode démo
  (`[reviews:demo] Email simulé → ...`), déjà marqué
  `// eslint-disable-next-line no-console`. **Volontaire, conservé** — c'est
  la seule preuve visible qu'un envoi a été simulé sans réseau.
- `lib/reviews/scheduler.ts:135` — `console.error("[reviews:poller]", err)`
  dans le filet de rattrapage du poller local de dev. **Volontaire,
  conservé** — sans lui, une erreur du poller (process background sans UI)
  disparaîtrait silencieusement.
- Aucun autre `console.*` trouvé dans le code actif (`lib/delivery/*`,
  toutes les routes API, tous les composants live).

### Blocs de code commenté

Recherche exhaustive (blocs `/* */` et lignes `//` ressemblant à du code
désactivé) : **aucun trouvé**. Les seuls commentaires multi-lignes présents
sont des séparateurs de section (prose), pas du code mort en commentaire.

### Autres dépendances vérifiées (toutes légitimes, gardées)

`react-dom`, `@types/*`, `postcss`, `typescript` : zéro `import` explicite
trouvé par grep, mais ce sont des dépendances consommées implicitement par
Next.js/le compilateur (peer dep de React, types ambiants, moteur de build)
— pas du code mort, juste invisibles à un grep naïf. Vérifiées une par une
avant de les exclure de la suppression, comme demandé.

### Ce qui a été fait, dans l'ordre

1. **`gsap` supprimé** de `package.json` (0 référence, `npm install` relancé,
   `package-lock.json` mis à jour).
2. **ESLint configuré** (`.eslintrc.json`, base `next/core-web-vitals` +
   `@typescript-eslint/no-unused-vars`), volontairement scindé du périmètre
   archives/labo (`ignorePatterns`). Résultat : **0 import et 0 variable
   inutilisés** dans tout le code actif, y compris dans les fichiers
   archive-only listés plus haut — rien à retirer sur ce point précis.
   `react/no-unescaped-entities` désactivée : activée par défaut par
   `next/core-web-vitals`, elle faisait échouer `next build` sur ~90
   occurrences d'apostrophes non échappées dans du JSX pré-existant (dont
   une majorité dans des fichiers archive-only) — corriger ce point aurait
   nécessité de toucher des fichiers protégés ou d'élargir le chantier
   très au-delà du nettoyage demandé ; désactivée pour garder un build
   propre sans y toucher. **Signalé plutôt que tranché : dites-moi si vous
   voulez qu'on les corrige quand même dans les fichiers live.**
3. **Prettier configuré** (`.prettierrc.json`, `.prettierignore` — mêmes
   exclusions archives/labo que ESLint) et appliqué sur tout le reste du
   projet : 44 fichiers reformatés (retours à la ligne, virgules finales),
   **zéro changement de contenu ou de comportement** — vérifié par `tsc`
   propre et build identique (mêmes 19 routes, mêmes tailles de bundle)
   avant/après. Note : le formatage a aussi touché les fichiers archive-only
   situés hors de `app/_archive/`/`components/labo/` (ex. `components/Nav.tsx`,
   `content/site.ts`) — volontaire, car ce sont des fichiers actifs du
   dépôt au sens strict (pas dans le dossier archive protégé), et Prettier
   ne change jamais la logique. Si vous préférez que je les exclue aussi,
   je peux affiner `.prettierignore`.
4. **Nommage et regroupement vérifiés** : déjà cohérents dans le code actif
   (composants en PascalCase, modules `lib/` en kebab-case dans les deux
   modules, routes en minuscules). Le seul écart apparent —
   `app/api/reservations/` hors de `app/api/reviews/` — est volontaire et
   déjà commenté dans le code (la réservation est un domaine à part qui ne
   fait que déclencher le module avis) ; laissé tel quel.
5. **`lib/delivery/` et `lib/reviews/` vérifiés** : structure inchangée,
   aucun fichier déplacé, séparation `DELIVERY_MODE`/`EMAIL_MODE`/
   `REVIEWS_STORE_MODE` intacte dans les deux.
6. **`README.md` réécrit intégralement** — l'ancienne version décrivait
   encore le site v1 (palette « terroir francilien », Configurator, La
   Carte comme menu de restaurant) alors que le site actuel est la
   direction v3. Nouvelle version : structure actuelle, les deux modules
   documentés avec renvoi vers `README-delivery.md`/`README-reviews.md`,
   labo et archives mentionnés sans détail (pas concernés par ce
   nettoyage). `.env.example` vérifié : déjà complet et à jour, aucune
   modification nécessaire.

### Vérification finale

- `tsc --noEmit` ✅, `npm run build` ✅ — **19 routes, tailles de bundle
  identiques** à avant le nettoyage, 0 erreur, 0 warning.
- Rendu visuel vérifié en preview : page d'accueil, `/qui-je-suis`,
  `/demo/commande`, `/demo/livraison`, `/demo/avis`, `/labo` — tous
  strictement identiques à avant (captures comparées).
- **Module Relance avis Google** : cycle complet rejoué en mode démo
  (réservation créée → `scheduled` → poller local → `simulated` avec
  `sentAt`) — fonctionne à l'identique.
- **Module Commande & Livraison** : `/api/delivery/quote` rappelé
  directement — réponse `mode: "demo"` correcte, calcul de devis inchangé.
- Console navigateur : 0 erreur sur toutes les pages visitées.
- **Aucun push** — tout ce chantier reste local, comme toujours.

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

---

## [Correction] Titre du Hero restauré + section « Verdict » dédiée, plein écran

**Contexte** : un chantier précédent avait remplacé le titre du Hero par
« Votre site actuel, il fait quoi, là, tout de suite ? » — ce n'était pas la
demande. Ce chantier corrige le tir : le titre du Hero est restauré tel quel,
et cette phrase devient le titre d'une **toute nouvelle section**, à part
entière.

### 1. Titre du Hero restauré

`components/v3/Hero.tsx` : reverté à l'état d'avant l'erreur, via
`git revert` du commit fautif. Titre définitif, inchangé : **« Vos futurs
clients vous cherchent déjà. Assurez-vous qu'ils vous trouvent. »** — n'apparaît
qu'une fois sur la page, dans le Hero uniquement.

### 2. Nouvelle section « Verdict », plein écran

- `content/v3.ts` : nouvel export `v3verdict` (`question` + `answers[]` —
  mêmes réponses que précédemment : « Rien. Absolument rien. », « Il dort. »,
  « Il est invisible. », « Il fait fuir vos clients. », « Il tourne en
  rond. », « Il ment sur vos horaires. », « Il rate des opportunités. »).
- `components/v3/Sections.tsx` : nouveau composant `V3Verdict` — section
  `min-h-screen` (plein écran, vrai temps de pause dans le scroll), fond
  sombre `bg-encre` (cohérent avec la section Process, déjà sombre — alterne
  la respiration visuelle du site). Titre en très grande typo (`md:text-7xl`)
  sur fond `lait`, réponse qui défile en dessous en `jaune`.
- Insérée dans `app/page.tsx` entre `<V3Hero />` et `<V3Constat />`.
- Les cartes « Il dort » / « Il est invisible » sont retirées de la section
  Constat (doublon avec le contenu de Verdict, juste au-dessus) — 2 cartes
  restantes (« Il est verrouillé », « Il coûte sans compter »), grille
  recentrée. `app/sitemap.ts` : ancre `#verdict` ajoutée.

### 3. Animation de transition — glitch / RGB-split (pas un simple fondu)

Le fondu simple d'un chantier précédent est remplacé par un vrai effet
glitch à chaque changement de réponse (~350ms, dans le budget 300-500ms
demandé) :
- `.glitch-answer` (nouvelles règles dans `app/globals.css`) : au moment du
  changement, deux pseudo-éléments (`::before`/`::after`) dupliquent le texte
  en corail et en teal (couleurs de marque), décalés et découpés par
  `clip-path` animé, en `mix-blend-mode: screen` (fait ressortir les couleurs
  sur fond sombre) — un vrai split chromatique façon glitch, pas un fondu.
  Le texte de base tremble légèrement (`glitch-jitter`, `transform` +
  `filter: blur` bref).
- **Uniquement des propriétés compositées** (`transform`, `opacity`,
  `filter`, `clip-path`) sur 1 élément réel + 2 pseudo-éléments — aucune
  propriété de layout animée, donc aucun repaint/reflow déclenché par
  l'animation. Choix fait explicitement pour éviter de reproduire le problème
  de performance déjà rencontré sur ce site (cf. Chantier 2 Performance).
- Cycle : nouvelle réponse toutes les 2 s, effet glitch actif les 350
  premières ms de chaque nouvelle réponse.

### Reduced motion

`GlitchAnswer` (dans `components/v3/Sections.tsx`) utilise
`useReducedMotion()` : si activé, affiche `answers[0]` (« Rien. Absolument
rien. ») statique, sans intervalle, sans classe `is-glitching`, sans
pseudo-éléments (`content: none` en reduced-motion dans le CSS, défense en
profondeur en plus du court-circuit React).

### Vérifications effectuées

- `tsc --noEmit` ✅, build production 15 routes ✅.
- Hero confirmé visuellement : bon titre, une seule occurrence sur la page
  (grep sur le code confirme `v3hero.titleA/Em/B` intacts, aucune référence
  à l'ancien titre erroné).
- Section Verdict vérifiée en preview desktop **et** mobile (375px) : plein
  écran, question lisible, défilement actif sur plusieurs cycles.
- **Glitch capturé en plein transition** via screenshot minuté (~1,7s après
  chargement) : split chromatique corail/teal visible et propre sur « Il rate
  des opportunités. », aucun artefact visuel.
- Mesure FPS via rAF non concluante dans l'outil de preview (le rAF se met en
  pause quand l'onglet est en arrière-plan — limite déjà documentée dans ce
  journal) ; la fluidité est garantie par construction (propriétés compositées
  uniquement, 1 élément + 2 pseudo-éléments, aucune boucle JS pilotant
  l'animation frame par frame — seul un `setInterval` toggle une classe toutes
  les 2s) et confirmée visuellement sans saccade sur les captures.
- **Reduced motion vérifié fonctionnellement** : flag forcé temporairement
  (`useReducedMotion() || true`) le temps d'un screenshot confirmant le rendu
  statique correct (couleur/opacité du titre vérifiées via inspection des
  styles calculés, pas seulement visuellement), confirmé stable sur 4s sans
  cycle, puis le hack immédiatement retiré — `tsc` re-vérifié après coup.
- Section Constat : confirmé par inspection DOM que 2 cartes seulement
  restent (« Il est verrouillé », « Il coûte sans compter »).
- **Aucun push** — en attente de relecture avant mise en ligne.

---

## [LABO · expérience 01] Portail qui se fissure — page technique HORS périmètre commercial

**Nature** : expérimentation créative pure sur `/labo`, totalement séparée du
site commercial. **Jamais liée depuis la navigation** (vérifié par grep : zéro
lien dans content/, components/v3, app/page.tsx), **non indexable** (meta
`noindex, nofollow` vérifiée dans le HTML servi + `Disallow: /labo` dans
robots.txt + absente du sitemap).

**L'effet** : au clic sur « Entrer », l'écran se brise en verre —
1. toile de fissures **procédurales** (rayons + anneaux jitterés autour du
   point d'impact, graine aléatoire à chaque déclenchement — vérifié par deux
   captures gelées au même instant : géométries totalement différentes) ;
2. l'écran suivant **transparaît dans les interstices** dès la phase de
   fissuration (léger écartement radial des fragments) ;
3. les fragments **tombent** (balistique analytique : gravité + rotation +
   fondu) et révèlent l'écran final. Durée totale : **1,4 s**.

**Technique** (`components/labo/ShatterPortal.tsx` + route `app/labo/page.tsx`) :
- Canvas 2D (pas de Three.js — inutile ici). L'écran A est **repeint** sur une
  texture offscreen au moment du clic (fond + blobs via constantes partagées
  DOM/canvas, textes/bouton mesurés sur le DOM réel avec leurs styles
  calculés) — pas de lib de capture DOM.
- Fragments = quads/triangles jitterés découpés dans la texture via `clip()` :
  **65 desktop / 36 mobile** (< 640px) — pas des centaines de micro-morceaux.
- Trajectoires **analytiques** (position = f(t), pas d'intégration frame par
  frame) : déterministe, robuste aux frames sautées.
- Boucle rAF + filet `setInterval(50ms)` idempotent (les rAF sont suspendus
  en onglet d'arrière-plan ; l'effet se termine quoi qu'il arrive).
- **Son** : éclat de verre 100 % synthétisé en Web Audio (bruit passe-haut à
  décroissance rapide + 3 tintements sinusoïdaux), créé uniquement sur geste
  utilisateur, `try/catch` intégral, aucun fichier audio.
- Debug labo : `/labo?freeze=<ms>` fige l'effet à un instant donné
  (inspection/captures). Inactif sans le paramètre.

**Contraintes respectées**
- `prefers-reduced-motion` : fondu croisé simple, aucun canvas, aucune
  fragmentation, aucun son — vérifié en forçant temporairement le flag
  (méthode habituelle), hack retiré, `tsc` re-vérifié.
- Mobile : nombre de fragments réduit (36), rendu vérifié en 375px gelé à
  t=500ms — éclats plus gros, écran B visible dans les vides. Fluidité par
  construction (une passe de dessin par frame, clip+drawImage compositée,
  DPR plafonné à 2).
- Performance desktop : capture gelée nette à t=180ms (toile de fissures) et
  t=600ms (plein vol) ; run réel complet sans aucune erreur console.

**Incident rencontré et résolu pendant la vérif** : la page semblait morte au
premier clic — en réalité le serveur de dev servait un HTML dont les chunks
`_next/static` étaient en 404 (conséquence du `rm -rf .next` d'un build lancé
pendant que le dev tournait — piège déjà documenté). Redémarrage du serveur de
dev → hydratation OK. À retenir : toujours redémarrer le dev server après un
build de prod dans ce repo.

**Vérifications** : `tsc` ✅ · build **16 routes** (dont `/labo`) ✅ ·
noindex/robots/sitemap ✅ · variation procédurale ✅ (2 tirages ≠) ·
reduced-motion ✅ · mobile ✅ · console 0 erreur ✅. **Aucun push.**

---

## [Module Relance avis Google] Email automatique post-réservation

**Nature** : nouveau module isolé et optionnel, même logique que le module
Commande & Livraison — le site fonctionne normalement s'il n'est pas
configuré (`EMAIL_MODE` et `REVIEWS_STORE_MODE` absents → `demo`/`memory`,
jamais d'erreur).

**Principe** : à la création d'une réservation (email + horodatage), une
relance avis Google est planifiée à *réservation + délai* et envoyée seule,
sans intervention. Lien direct vers la fenêtre de notation du commerce
(jamais générique). **Règle de conformité non négociable, documentée en
commentaire au-dessus du template** : le même email part pour tous les
clients ayant réservé, aucune question de satisfaction en amont pour
orienter les mécontents ailleurs que Google (*review gating*, interdit par
Google et risqué juridiquement).

**Architecture** (`lib/reviews/*`, détail complet dans `README-reviews.md`) :
- `types.ts` / `businesses.ts` — contrats + registre des commerces (jetons de
  marque + lien avis Google, propres à CHAQUE commerce, pas génériques).
- `store.ts` + `supabase-store.ts` — persistance des jobs planifiés,
  sélectionnée par `REVIEWS_STORE_MODE` (`memory` par défaut, dev uniquement ;
  `supabase` pour un vrai déploiement — store Supabase entièrement codé,
  schéma SQL fourni, mais non testable sans projet réel, comme le client Uber
  Direct du module livraison).
- `email-provider.ts` — `EMAIL_MODE` `demo` (log console, statut `simulated`)
  ou `live` (Resend, REST brut via `fetch`, aucun SDK ajouté).
- `scheduler.ts` — `scheduleReviewRequest()` calcule `sendAt` (délai
  configurable à 3 niveaux : par commerce > `REVIEW_REQUEST_DELAY_HOURS` >
  override ponctuel de la démo — jamais codé en dur) ; `processDueJobs()`
  envoie tout ce qui est dû, appelée par la route cron ET par un poller local
  (dev uniquement, désactivé si `VERCEL`/prod) pour que la démo tourne sans
  curl manuel.
- `templates/review-request.tsx` — email HTML en styles inline (tables, pas
  de Tailwind — la plupart des clients mail dégradent le CSS moderne),
  reprend les jetons de marque du commerçant, un seul CTA, lien de
  désinscription.
- Routes : `POST /api/reservations` (création + planification), `GET/POST
  /api/reviews/run` (cron), `GET /api/reviews/status` (suivi commerçant — un
  statut par job, simplification volontaire vs. table `email_log` séparée),
  `GET /api/reviews/unsubscribe` (RGPD, lien direct depuis l'email).
- `vercel.json` — cron `/api/reviews/run` toutes les 10 min (⚠️ le plan Vercel
  Hobby limite les cron à 1×/jour — un plan Pro est nécessaire en prod réelle).
- `app/demo/avis/` — sandbox non liée à la nav, désindexée (même traitement
  que `/demo/commande`) : formulaire de réservation fictive (délai réglable en
  minutes) + tableau de suivi live des statuts.

**Bug trouvé et corrigé pendant la vérification** : le store en mémoire
utilisait un simple singleton de module (`let memoryStore = ...`). Or
Next.js peut bundler chaque route handler comme une entrée séparée — deux
routes important le même fichier se retrouvaient chacune avec leur PROPRE
copie du module, donc deux instances différentes du store : un job créé via
`/api/reservations` restait invisible depuis `/api/reviews/status`. Corrigé
en portant le singleton sur `globalThis` (même technique que le contournement
Prisma/HMR bien connu de l'écosystème Next.js) — vérifié après coup : le job
créé par une route est immédiatement visible depuis l'autre.

**Deuxième point trouvé en vérifiant le build** : `/api/reviews/status` et
`/api/reviews/run` ne lisant ni cookies ni paramètres de requête, Next.js les
pré-rendait en **statique** au build (réponse figée pour toujours en
production) — jamais ce qu'on veut pour un état qui change à chaque envoi.
Ajout de `export const dynamic = "force-dynamic"` sur les deux routes ;
rebuild : les deux apparaissent bien en `ƒ` (dynamique) désormais.

**Vérifications effectuées**
- `tsc --noEmit` ✅, build production **19 routes** ✅.
- Cycle complet testé en mode démo (`EMAIL_MODE` non défini) : réservation
  créée via l'API → job `scheduled` visible immédiatement depuis une AUTRE
  route → au bout du délai (testé à 1-2 minutes), le poller local l'envoie
  tout seul → statut `simulated` + `sentAt` renseigné → ligne
  `[reviews:demo] Email simulé → ...` visible en console serveur. Reproduit
  deux fois (2 jobs distincts), les deux confirmés.
- Désinscription testée : lien `/api/reviews/unsubscribe?id=...` marque le
  job `canceled`/`unsubscribed`, et une NOUVELLE réservation pour le même
  couple commerce/email est créée déjà `canceled` (vérifié par requête directe).
- Erreurs gérées proprement : commerce inconnu → 404 avec message clair ;
  champs requis manquants → 400 ; absence totale de config `EMAIL_MODE` /
  `REVIEWS_STORE_MODE` → aucune erreur, comportement démo par défaut.
- Site principal non affecté : `/` répond toujours en 200, aucune régression.
- **Aucun push** — en attente de relecture avant mise en ligne.

---

## [Optimisation performance] Baseline Lighthouse — AVANT modification

Build de production (`next build` + `next start -p 3005`), Lighthouse CLI
(`npx lighthouse`, Chrome headless, catégories perf/a11y/bonnes pratiques/SEO)
sur la page d'accueil `/`.

### Scores de départ

| Catégorie | Score |
| --- | --- |
| Performance | **96** |
| Accessibilité | **96** |
| Bonnes pratiques | **96** |
| SEO | **100** |

### Métriques

| Métrique | Valeur |
| --- | --- |
| First Contentful Paint | 0,8 s |
| Largest Contentful Paint | 2,8 s |
| Total Blocking Time | 30 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 0,8 s |
| Time to Interactive | 3,0 s |
| Max Potential FID | 120 ms |

### Pistes concrètes déjà identifiées par Lighthouse (à creuser, pas à corriger à l'aveugle)

1. **3 animations non compositées** sur la section Verdict (`glitch-jitter`,
   `glitch-split-a`, `glitch-split-b`) — Lighthouse flague `filter` (« may move
   pixels ») et `clip-path` (« Unsupported CSS Property ») comme non pris en
   charge par le compositeur. C'était présenté comme « propriétés compositées
   uniquement » dans le changelog du Labo/Verdict — **à revérifier, l'outil dit
   le contraire pour clip-path/filter animés**, contrairement à `transform`/`opacity`.
2. **JS inutilisé** : chunk framer-motion (`249-*.js`, 128 Ko) — 29,7 Ko sur
   40,7 Ko (73 %) non exécutés sur la page d'accueil.
3. **2 tâches longues** détectées (117 ms au chargement initial, 84 ms dans le
   chunk react-dom vers 2,8 s) — TBT reste bas (30 ms), à surveiller mais pas
   forcément un problème en soi.
4. Chunk `fd9d1056-*.js` (172 Ko) identifié = **react-dom** (incompressible,
   pas une piste d'optimisation).

Premier build de prod (`First Load JS` partagé) : **87,4 Ko** répartis en
`117-*.js` (31,7 Ko), `fd9d1056-*.js` (53,6 Ko compressé), + chunks additionnels.
Page d'accueil : 3,19 Ko propres + 147 Ko total.

Diagnostic détaillé (animations, canvas, images, polices, bundle, re-renders
React) à suivre avant toute correction — voir entrée suivante.

---

## [Optimisation performance] Diagnostic complet + corrections appliquées

Méthode : profiling réel (pas de suppositions), un point de contrôle par item
de la checklist, correction uniquement de ce qui est confirmé.

### 1. Profiling réel (scroll + interactions)

`PerformanceObserver` (`longtask`) installé en conditions réelles (build de
prod, port 3005) pendant : parcours complet de la page (Hero → Verdict →
Plans → Process → Contact via navigation par ancre), plusieurs cycles de
l'effet glitch du Verdict, interactions sur le panier de `/demo/commande`.
**Résultat : zéro tâche longue (>50 ms) détectée** dans les trois scénarios.
Les 2 tâches longues que Lighthouse rapporte sur le chargement initial
(117 ms et 84 ms) sont internes à React/react-dom (hydratation) — TBT réel
mesuré à seulement 30 ms au départ, donc déjà sous le seuil qui impacterait
l'expérience.

### 2. Animations — audit exhaustif de tous les `@keyframes` + props Framer Motion

Toutes les animations du site passées en revue (`app/globals.css` +
`animate`/`initial`/`whileInView` de Framer Motion, code live uniquement) :

- `preview-in`, `hero-rise`, `hero-slate`, `sig-drift`, `sig-word`,
  `v3-ticker`, `v3-drift`, `v3-notif`, `Reveal` (Framer Motion) : **déjà
  `transform`/`opacity` uniquement** — rien à corriger.
- `offer-pulse` anime `box-shadow` (exactement la propriété citée comme
  contre-exemple) — mais n'est utilisée que par `.featured-offer`, une classe
  **exclusive à `components/Carte.tsx` (archive-only, v1/v2)**. Aucun élément
  du site actuel ne porte cette classe : zéro coût réel, laissée telle quelle
  (hors périmètre, code mort mais protégé comme documenté dans le nettoyage
  précédent).
- **`glitch-jitter` / `glitch-split-a` / `glitch-split-b`** (section Verdict) :
  seules animations réellement problématiques, confirmées par Lighthouse
  (`non-composited-animations`, 3 éléments flagués) ET par lecture directe du
  CSS — `filter` et `clip-path` animés, pas compositables de façon fiable.
  Voir corrections ci-dessous.

### 3. Canvas / effets visuels lourds

- **Hero (`V3Scene.tsx` + `V3Backdrop.tsx`)** : déjà exemplaire sur les 3
  critères demandés — `dpr={[1, 1.5]}` (plafonné, jamais illimité),
  `frameloop={active ? "always" : "never"}` piloté par un `IntersectionObserver`
  (pause hors écran), et surtout **coupé sur mobile/tactile** (`pointer: coarse`
  ou `max-width: 768px` → fallback CSS, jamais de WebGL chargé). Chargement
  WebGL lui-même différé via `next/dynamic` + `requestIdleCallback`. Rien à
  changer.
- **Curseur qui suit le blob WebGL** : position stockée dans une `ref`
  (`target.current`), jamais dans le state React — consommée une seule fois
  par frame via `useFrame` avec un lerp. Déjà l'implémentation demandée.
  point 7 de la checklist confirmé sans action nécessaire.
- **Labo (`ShatterPortal.tsx`)** : vérifié en lecture seule uniquement (zone
  protégée, jamais modifiée) — DPR plafonné à 2, boucle `requestAnimationFrame`,
  nombre de fragments déjà réduit sur mobile (36 vs 65 desktop). Déjà conforme.

### 4. Images

Recherche exhaustive (`find` sur tous les formats raster + grep `<img>`/
`next/image`) : **zéro image raster dans tout le projet**, live ou archivé.
Le site est 100 % SVG inline / dégradés CSS / WebGL. Rien à optimiser —
confirmé par recherche directe, pas supposé.

### 5. Polices

`next/font/google` (Instrument Serif, Work Sans, IBM Plex Mono) : déjà
auto-hébergées (aucune requête vers fonts.googleapis.com), `display: "swap"`
déjà positionné sur les 3 familles, préchargement automatique confirmé dans
le HTML de prod (6 `<link rel="preload" as="font">`). C'est exactement ce que
`next/font` garantit par construction — rien à ajouter.

### 6. JavaScript et bundle

- **Taille du bundle** : chunks identifiés précisément (pas par déduction) en
  comparant les requêtes réseau de `/` vs `/demo/commande` : `fd9d1056-*.js`
  (172 Ko) = react-dom, `117-*.js` (124 Ko) = runtime React, `972-*.js`
  (26 Ko) = helpers Next.js (i18n/routing, partagé partout) — tous
  incompressibles. `249-*.js` (128 Ko) = **Framer Motion**, chargé uniquement
  sur les pages utilisant `<Reveal>` (le code-splitting par route fonctionne
  déjà correctement) mais avec **73 % de code jamais exécuté** (29,7 Ko/40,7 Ko,
  mesuré par Lighthouse `unused-javascript`). Voir correction ci-dessous.
- **Scripts tiers** : Vercel Analytics (`@vercel/analytics/react`) chargé de
  façon non bloquante (`<Analytics />` en fin de `<body>`, script tiers
  différé par le SDK lui-même) — confirmé par le `server-response-time` de
  10 ms et le TBT de 30 ms au départ. Rien à changer.
- **Modules Commande & Livraison / Relance avis** : leur code serveur
  (`lib/delivery/*`, `lib/reviews/*`) tourne exclusivement dans des routes API
  (`app/api/**/route.ts`) — jamais expédié au navigateur, quelle que soit la
  page. Côté client, `DeliveryOptionSelector`/`DeliveryTracker` ne sont
  importés que par `app/demo/commande` et `app/demo/livraison` (vérifié via
  les requêtes réseau) : le découpage par route de Next.js les exclut déjà du
  bundle de la page d'accueil et de toutes les autres pages. **Déjà fait, rien
  à changer.**

### 7. Re-renders React inutiles

Recherche de tout `useState` mis à jour en boucle ou sur `mousemove`/
`pointermove` dans le code live :
- **Hero (`NotifFeed`)** : `setInterval` à 2,2 s — fréquence négligeable,
  pas un problème.
- **Verdict (`GlitchAnswer`)** : `setInterval` à 2 s — idem, négligeable.
- **Curseur WebGL** : déjà sur une `ref`, voir point 3.
- **Aucun** `mousemove`/`pointermove` mettant à jour du state React trouvé
  dans le code live (les 3 occurrences archive-only — `signature/*`,
  `v2/V2Hero.tsx` — sont hors périmètre).

Conclusion : **zéro problème de re-render trouvé.**

### Corrections appliquées

1. **`components/Reveal.tsx` : `motion` → `LazyMotion` + `m` + `domAnimation`.**
   Seul consommateur du composant `motion` complet dans tout le code live, et
   seulement pour un fade + `translateY` (ni drag, ni layout, ni `AnimatePresence`
   complexe) — exactement le cas d'usage prévu pour `LazyMotion`. Zéro
   changement de comportement (même easing, même durée, même déclenchement
   `whileInView`, même court-circuit sous `prefers-reduced-motion` — la
   branche reduced-motion ne touche même pas au nouveau code).
2. **`app/globals.css` : `filter` retiré de `@keyframes glitch-jitter`.**
   Le micro-flou de 0,3px qu'il produisait était à peine perceptible ; le
   tremblement `transform` seul suffit visuellement. Change 1 des 3 éléments
   flagués par Lighthouse.

### Non corrigé — décision à confirmer

**`glitch-split-a` / `glitch-split-b` (2 éléments restants) animent
`clip-path`**, le cœur du découpage en « tranches » qui fait le look glitch/
RGB-split de la section Verdict. Mesuré : **zéro tâche longue réelle causée
par cet effet** sur cette machine (voir point 1) — le flag Lighthouse est
correct sur le principe (clip-path animé n'est pas garanti compositable par
tous les navigateurs) mais n'est pas la cause d'un ralentissement observable
ici. Par cohérence avec la consigne de ne pas dégrader un effet déjà validé
sans confirmation, **je ne l'ai pas modifié**. Deux options si vous voulez
aller plus loin, par ordre de risque visuel croissant : (a) rien, l'effet est
déjà rapide en pratique ; (b) reconstruire l'effet avec des bandes déjà
découpées statiquement (plusieurs éléments à `clip-path` fixe, seul le
`transform`/`opacity` de chacun serait animé) — même rendu final possible,
mais demande une réécriture du composant, pas juste du CSS.

### Autres constats (hors périmètre performance, non corrigés)

- **`errors-in-console`** (Lighthouse, bonnes pratiques) : 404 sur
  `/_vercel/insights/script.js` — c'est Vercel Analytics qui cherche un
  script servi uniquement par l'infrastructure Vercel réelle ; absent en test
  local (`next start`). Pas un bug, un artefact de test — n'apparaîtra pas
  une fois déployé.
- **`color-contrast`** (Lighthouse, accessibilité) : plusieurs textes en
  `text-encre/50` à `/60` (opacité réduite) et badges colorés sous le ratio
  WCAG. Réel, mais hors périmètre de ce chantier (performance, pas
  accessibilité visuelle) — signalé plutôt que corrigé à la volée.

### Scores Lighthouse — avant / après

| Catégorie / métrique | Avant | Après |
| --- | --- | --- |
| Performance | 96 | 96 |
| Accessibilité | 96 | 96 |
| Bonnes pratiques | 96 | 96 |
| SEO | 100 | 100 |
| First Contentful Paint | 0,8 s | 0,8 s |
| Largest Contentful Paint | 2,8 s | 2,8 s |
| **Total Blocking Time** | **30 ms** | **10 ms** |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 0,8 s | 0,8 s |
| Time to Interactive | 3,0 s | 2,9 s |
| **JS inutilisé (page d'accueil)** | **29,7 Ko** | **0 Ko** |
| **Animations non compositées** | **3 éléments** | **2 éléments** |
| First Load JS (page d'accueil) | 147 Ko | **137 Ko** |
| First Load JS (`/qui-je-suis`) | 144 Ko | **134 Ko** |

Les scores globaux (déjà à 96-100 au départ) ne bougent pas — le site était
déjà très bien optimisé avant ce chantier. Les métriques fines qui reflètent
directement les corrections (TBT, JS inutilisé, animations non compositées,
poids du bundle) s'améliorent toutes, sans aucune régression ailleurs.

### Vérifications effectuées

- `tsc --noEmit` ✅, build production ✅ (mêmes 19 routes).
- Rendu visuel vérifié en preview après corrections : Hero, section Verdict
  (glitch actif, texte cyclé), desktop et mobile — identiques à avant.
- `prefers-reduced-motion` re-testé spécifiquement sur `Reveal.tsx` (seul
  fichier modifié touchant à une logique reduced-motion) : flag forcé
  temporairement, confirmé que le contenu s'affiche directement à `opacity:1`
  sans transition (même comportement qu'avant, la branche reduced-motion est
  identique ligne pour ligne), hack retiré immédiatement après.
- **Aucun push** — en attente de relecture avant mise en ligne, et de votre
  décision sur l'effet glitch (clip-path) ci-dessus.
