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
