# Journal des modifications — NOVA Studio

> Session de travail autonome (nuit). **Tout est strictement local, aucun `git push`.**
> À relire au matin avant toute mise en production.

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
