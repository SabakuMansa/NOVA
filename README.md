# NOVA Studio — Site vitrine

Site vitrine de **NOVA Studio**, studio digital local (Île-de-France) qui conçoit
des sites et outils numériques pour les commerces de proximité.

Fondateur restaurateur en activité → positionnement « un commerçant qui comprend
les commerçants ».

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design tokens dans `tailwind.config.ts`)
- **Framer Motion** (animations mesurées, `prefers-reduced-motion` respecté)
- **Vercel Analytics** (`@vercel/analytics`) — sans cookie, RGPD-friendly, gratuit
- 100 % statique / client-side — aucune clé API, aucune dépendance payante

## Démarrer en local

```bash
npm install
npm run dev
# → http://localhost:3002
```

## Structure

```
app/
  layout.tsx        Polices + metadata SEO + JSON-LD + Analytics
  page.tsx          Assemble les sections
  globals.css       Reset, tokens CSS, utilitaires (grain papier, points de suite)
  icon.svg          Favicon (monogramme « N »)
  opengraph-image.tsx  Image de partage générée par next/og (aucune image externe)
  sitemap.ts        /sitemap.xml
  robots.ts         /robots.txt
components/         Une section = un composant (Hero, Carte, Configurator, …)
  JsonLd.tsx        Données structurées Schema.org (ProfessionalService)
content/
  site.ts           ⭐ TOUT le texte du site + les 12 combos + SEO + témoignages
```

## SEO

- **Métadonnées** riches + Open Graph + Twitter Card dans `app/layout.tsx`.
- **Image de partage** auto-générée (`app/opengraph-image.tsx`), aux couleurs de la marque.
- **`sitemap.xml`** et **`robots.txt`** générés (`app/sitemap.ts`, `app/robots.ts`).
- **JSON-LD `ProfessionalService`** (`components/JsonLd.tsx`) : zone desservie
  Île-de-France, **sans adresse inventée** tant que le studio n'est pas nommé.

### Modifier les textes

Tout le contenu éditorial vit dans **`content/site.ts`** : titres, offres, prix,
process, coordonnées, footer. On peut changer une phrase ou un tarif sans jamais
toucher à un composant.

## Parti-pris de design

- **Palette « terroir francilien »** : nappe, café brûlé, moutarde de Meaux,
  lie-de-vin, sauge, craie (cf. `tailwind.config.ts`).
- **Signature « La Carte »** : la section Offres est traitée littéralement comme
  une carte de restaurant (papier, filets, points de suite, prix alignés à droite).
- **Configurateur** : 4 activités × 3 styles = 12 aperçus écrits en dur dans
  `content/site.ts`, aucun appel réseau.

## Déploiement Vercel

1. Pousser le repo sur GitHub/GitLab.
2. Sur [vercel.com](https://vercel.com) → **New Project** → importer le repo.
3. Framework détecté automatiquement (**Next.js**) — aucune variable
   d'environnement requise. Laisser les réglages par défaut :
   - Build : `next build`
   - Output : `.next`
4. **Deploy**. Le site est en ligne en ~1 min.

> Le port `3002` ne concerne que le dev local (`npm run dev`) ; Vercel gère le
> sien automatiquement.

## ⚠️ Placeholders à remplacer avant mise en ligne

« NOVA Studio » est un **nom de code** : plusieurs valeurs sont volontairement
provisoires et signalées dans `content/site.ts`.

- **`seo.siteUrl`** : domaine placeholder (`https://nova-studio.fr`) → mettre le
  vrai domaine (utilisé par le sitemap, robots, OG, canonical, JSON-LD).
- **`temoignages.items`** : **exemples balisés « Placeholder »**. Ne pas publier
  de faux avis — remplacer par de vrais témoignages clients (avec accord).
- **`contact.email` / `contact.phone`** : coordonnées d'exemple.
- **Réseaux sociaux & liens légaux** : placeholders `#` dans `content/site.ts`.

## À brancher plus tard

- **Formulaire de contact** : `components/Contact.tsx` affiche un état de succès
  local (démo). Brancher un service d'envoi (Formspree, Resend, route API…) dans
  le `onSubmit`.
- **Pages légales** : Mentions légales + Confidentialité (obligatoire en France).
