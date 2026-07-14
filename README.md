# NOVA Studio — Site vitrine

Site vitrine de **NOVA Studio**, studio digital local (Île-de-France) qui conçoit
des sites et outils numériques pour les commerces de proximité.

Fondateur restaurateur en activité → positionnement « un commerçant qui comprend
les commerçants ». Direction visuelle actuelle : **v3 « geek coloré »**
(inspirée d'AppSignal), en place à la racine du site depuis la refonte du
13/07/2026.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design tokens dans `tailwind.config.ts`)
- **Framer Motion** (animations mesurées, `prefers-reduced-motion` respecté)
- **Three.js** / `@react-three/fiber` (fonds WebGL du hero, dégradation CSS si indisponible)
- **Vercel Analytics** (`@vercel/analytics`) — sans cookie, RGPD-friendly
- Deux modules backend **optionnels et isolés** (voir plus bas) — le site
  fonctionne normalement sans eux

## Démarrer en local

```bash
npm install
npm run dev
# → http://localhost:3002
```

Aucune variable d'environnement n'est requise pour lancer le site : les
modules Commande & Livraison et Relance avis Google tournent en mode démo par
défaut (voir `.env.example` pour tout configurer en mode réel).

## Structure

```
app/
  layout.tsx          Polices + metadata SEO + JSON-LD + Analytics
  page.tsx            Page d'accueil (assemble les sections v3)
  qui-je-suis/        Page dédiée au parcours du fondateur
  demo/               Sandbox non liées à la nav, désindexées (voir modules ci-dessous)
    commande/         Démo du module Commande & Livraison
    livraison/        Démo du module Commande & Livraison (variante sandbox)
    avis/             Démo du module Relance avis Google
  api/
    delivery/         Routes du module Commande & Livraison
    reservations/     Création d'une réservation (déclenche la relance avis)
    reviews/          Cron d'envoi, statut, désinscription (module Relance avis)
    webhooks/         Webhook Uber Direct (module livraison, mode live)
  labo/               Page technique expérimentale, séparée du site commercial
                      (désindexée, jamais liée depuis la nav — voir CHANGELOG)
  _archive/           Anciennes versions du site (v1, v2, signature) — gelées,
                      non routées, jamais concernées par le nettoyage courant.
                      Anciennes URLs (/v2, /v3, /signature) redirigées vers `/`.
  sitemap.ts          /sitemap.xml
  robots.ts           /robots.txt
components/
  v3/                 Composants de la direction visuelle actuelle (Hero, Nav, Sections…)
  delivery/           Composants live du module Commande & Livraison
  labo/               Composant de la page /labo (isolé, protégé)
  JsonLd.tsx, Reveal.tsx   Utilitaires transverses live
  (racine, v2/, signature/)  Composants des versions archivées — non live,
                      conservés uniquement parce que les archives ci-dessus
                      en dépendent encore
content/
  v3.ts               Tout le texte de la direction visuelle actuelle
  site.ts             Contenu des versions archivées (seul l'export `seo` est
                      encore utilisé par le site actuel : layout/sitemap/robots)
lib/
  delivery/           Module Commande & Livraison (isolé, voir README-delivery.md)
  reviews/            Module Relance avis Google (isolé, voir README-reviews.md)
```

## Modules optionnels

Deux modules backend suivent le même patron : une interface commune, un
fournisseur **démo** (aucun réseau, aucune credential) et un fournisseur
**live** (vrai service, nécessite des credentials), sélectionnés par variable
d'environnement — absente, le site reste en mode démo sans erreur.

| Module | Doc | Variable de mode | Démo locale |
| --- | --- | --- | --- |
| Commande & Livraison | [README-delivery.md](README-delivery.md) | `DELIVERY_MODE` | `/demo/commande`, `/demo/livraison` |
| Relance avis Google | [README-reviews.md](README-reviews.md) | `EMAIL_MODE` | `/demo/avis` |

Voir `.env.example` pour la liste complète des variables (les deux modules,
plus le choix de persistance `REVIEWS_STORE_MODE` du second).

## SEO

- **Métadonnées** riches + Open Graph + Twitter Card dans `app/layout.tsx`.
- **Image de partage** auto-générée (`app/opengraph-image.tsx`), aux couleurs de la marque.
- **`sitemap.xml`** et **`robots.txt`** générés (`app/sitemap.ts`, `app/robots.ts`) —
  excluent `/demo/*` et `/labo` de l'indexation.
- **JSON-LD `ProfessionalService`** (`components/JsonLd.tsx`) : zone desservie
  Île-de-France, **sans adresse inventée** tant que le studio n'est pas nommé.

### Modifier les textes de la page d'accueil

Tout le contenu éditorial de la direction actuelle vit dans **`content/v3.ts`** :
titres, offres, prix, process, coordonnées, footer. On peut changer une phrase
ou un tarif sans jamais toucher à un composant.

## Qualité de code

- **ESLint** (`next lint`, config dans `.eslintrc.json`) — ignore volontairement
  `app/_archive/`, `app/labo/` et `components/labo/` (pas les cibles du nettoyage).
- **Prettier** (`.prettierrc.json` / `.prettierignore`, mêmes exclusions).

## Déploiement Vercel

1. Pousser le repo sur GitHub/GitLab.
2. Sur [vercel.com](https://vercel.com) → **New Project** → importer le repo.
3. Framework détecté automatiquement (**Next.js**). Build : `next build` ·
   Output : `.next`.
4. Renseigner les variables d'environnement des modules si besoin (mode
   `live` — voir `.env.example` et les README dédiés). Aucune n'est requise
   pour un déploiement en mode démo.
5. **Deploy**.

> Le port `3002` ne concerne que le dev local (`npm run dev`) ; Vercel gère le
> sien automatiquement.

## ⚠️ Placeholder à remplacer avant mise en ligne définitive

« NOVA Studio » est encore un **nom de code** dans certains endroits :

- **`seo.siteUrl`** (`content/site.ts`) : domaine placeholder
  (`https://nova-studio.fr`) → mettre le vrai domaine (utilisé par le sitemap,
  robots, OG, canonical, JSON-LD).
- **Coordonnées de contact** (`content/v3.ts` → `v3contact`) : email/téléphone d'exemple.
- **`lib/reviews/businesses.ts`** : un seul commerce fictif de démonstration
  (« La Table du Marché ») — à remplacer par la config réelle de chaque
  commerçant en production.
