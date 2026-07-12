# Refonte multi-pages `/v2` — notes de conception

Espace **isolé** (`app/v2/`, `components/v2/`) : le one-page existant reste intact et
accessible en parallèle. Rien n'est poussé sans accord.

## Recherche d'inspiration

Une recherche web ciblée sur les transitions multi-pages a été tentée en début de
session (WebSearch), mais l'outil de recherche a rencontré une **indisponibilité
temporaire de la plateforme** pendant une bonne partie de la session (échecs
systématiques du classifieur de sécurité sur tous les outils, y compris Write/Bash —
pas un problème réseau côté site). Plutôt que d'inventer des références, cette refonte
s'appuie sur la recherche **réelle et déjà vérifiée** menée dans la même session pour la
pièce signature `/signature` (voir `SIGNATURE-NOTES.md`), directement pertinente ici :

| Référence | Ce qu'on en retient pour le multi-pages |
| --- | --- |
| **By-Kin** (Awwwards SOTD + Developer Award + FWA, Next.js + GSAP) | Scroll « pondéré », transitions qui **ne s'affichent jamais pour elles-mêmes** — le site est perçu comme « une seule surface continue » malgré plusieurs pages. C'est l'objectif ici : la navigation entre `/v2/*` doit se sentir fluide, jamais comme un rechargement. |
| **Iventions / Minh Pham** (Three.js + GSAP) | Motion « layered over WebGL » avec retenue — un seul moment fort (le hero), le reste reste sobre. |
| **Mat Voyce** | Typo cinétique **timeline-driven**, jamais bloquante pour la lecture. |

**Complément technique** (connaissances établies, non une « source » web) : le pattern
standard pour un multi-pages fluide en Next.js App Router est **Lenis** pour le smooth
scroll (couche d'interpolation au-dessus du scroll natif, désactivée sous
`prefers-reduced-motion`) + un `template.tsx` par route group pour rejouer une animation
d'entrée à chaque navigation (App Router remonte `template.tsx` à chaque changement de
route, contrairement à `layout.tsx` qui persiste) — plus simple et plus robuste que la
View Transitions API (encore inégalement supportée) pour un rendu fiable multi-navigateurs.

## Architecture retenue

```
app/v2/
  layout.tsx          Nav + Footer v2 partagés, SmoothScroll (Lenis)
  template.tsx         Animation d'entrée de page, remontée à chaque navigation
  page.tsx              /v2 — Accueil
  approche/page.tsx      /v2/approche — Approche + Méthode + Process
  carte/page.tsx          /v2/carte — La Carte (INTOUCHÉE) + supplément + démo
  apercu/page.tsx         /v2/apercu — Configurateur + Témoignages
  contact/page.tsx       /v2/contact — Contact
components/v2/
  Nav.tsx               Navigation par pages (liens réels, actif via usePathname)
  Footer.tsx            Footer avec liens de page
  SmoothScroll.tsx      Wrapper Lenis (no-op si prefers-reduced-motion)
  V2Hero.tsx            Hero palier 3 : shader « braises » vérifié de /signature,
                         habillé avec le VRAI copy (content.hero), révélation par mot
```

## Ce qui est réutilisé tel quel (contenu INTOUCHÉ)

Les composants de section existants (`Approche`, `Methode`, `Process`, `Carte`,
`Configurator`, `Temoignages`, `Contact`) importent déjà leur contenu directement depuis
`content/site.ts` et ne dépendent pas de la navigation par ancre du one-page — ils sont
donc **repris sans modification** dans les nouvelles pages `/v2/*`. Le copywriting et
« La Carte » (offres + supplément + démo de livraison) sont strictement identiques à
l'original.

## Ce qui est nouveau (uniquement la mise en scène)

- Nav/Footer avec de vrais liens de page au lieu d'ancres.
- Smooth scroll (Lenis) sur tout `/v2`.
- Transition d'entrée de page via `template.tsx` (fade + léger slide, easing NOVA
  `[0.22,1,0.36,1]`, jamais de rebond).
- Un seul moment signature palier 3 : le hero de `/v2` reprend le shader WebGL
  « braises » déjà construit et **vérifié** pour `/signature` (réactif au curseur),
  avec le texte réel du hero (`content.hero`), pas un nouveau texte.

## Dégradation gracieuse

WebGL → CSS animé → statique, `prefers-reduced-motion` respecté partout, texte toujours
dans le DOM. Lenis désactivé sous reduced-motion (scroll natif du navigateur).

## SEO — décision sur le sitemap

`/v2/*` est marqué **`noindex, nofollow`** (metadata du layout `/v2`) et **`Disallow: /v2`**
dans `robots.txt`, tant que cet espace est en évaluation. Ajouter ces pages au
`sitemap.xml` public aurait été contradictoire avec le `noindex` — `app/sitemap.ts`
reste donc **inchangé** (toujours celui du one-page). Chaque page `/v2/*` a néanmoins
déjà son propre `<title>`, `description` et `canonical` (prêts pour le jour où
l'espace serait validé et passé en index).

## Bug trouvé et corrigé en vérification : contraste de la nav sur le hero sombre

Le logo/nav (texte café brûlé par défaut) était quasi illisible sur le hero sombre de
`/v2` tant que la barre n'était pas encore compacte (fond transparent). Corrigé dans
`components/v2/Nav.tsx` : un état `onDarkHero` (vrai uniquement sur `/v2`, avant scroll)
bascule le logo, les liens, le bouton CTA et le bouton mobile vers des tons clairs
(nappe/moutarde). Vérifié : lisible en haut de page ET après scroll (repasse aux tons
cafe habituels), sur desktop et mobile ; les autres pages (fond clair) ne sont pas
affectées.

## Vérification effectuée

- **Build de production** (`npm run build`) : ✅ compilation propre, **20 routes**
  générées, toutes les pages `/v2/*` en statique (`○`).
- **`npx tsc --noEmit`** : ✅ aucune erreur.
- **Chrome réel, premier plan** — chaque page testée desktop (1440px) et mobile (390px) :
  - `/v2` : hero WebGL (shader réutilisé de `/signature`) avec le vrai copy du hero,
    section « Le constat » (Problemes, intacte), cartes de navigation vers les 4 pages.
  - `/v2/approche` : `PageHeader` (h1) + Approche + Méthode + Process, contenu identique
    à l'original.
  - `/v2/carte` : **« La Carte » strictement intacte** — 3 offres, prix (690€ / 1490€
    « Recommandé » / dès 1990€), supplément « Commande & Livraison directe »
    (450€ + 25€/mois), bouton « Essayer la démo ».
  - `/v2/apercu` : configurateur + témoignages, identiques.
  - `/v2/contact` : formulaire identique.
  - Footer présent sur toutes les pages, avec lien de retour « Voir la version
    one-page → ».
- **Transitions de page** : navigation testée entre plusieurs pages (clic sur les liens
  de nav) — `template.tsx` rejoue le fade + léger slide à chaque changement de route ;
  la nav indique la bonne page active à chaque fois.
- **Smooth scroll (Lenis)** : actif sur `/v2`, scroll fluide observé pendant les tests.
- **0 erreur console** sur toutes les pages testées (vérifié après rechargement complet).
- **Aucune régression** : `/` (one-page) revérifié après coup, rendu identique à avant.
- **Formules interdites / mention « Uber »** : recherche sur `app/v2` et
  `components/v2` → aucune occurrence.
- Reduced-motion : implémenté partout via le même pattern déjà vérifié pour `/signature`
  et le one-page (`useReducedMotion` / media query CSS) — non re-testé manuellement dans
  cette passe (pattern identique, déjà validé ailleurs dans le projet).

## Limite connue de cette session

La recherche d'inspiration fraîche (WebSearch/WebFetch) a été bloquée par une
indisponibilité de plateforme prolongée pendant une grande partie de la session (voir
plus haut). Les références citées sont réelles mais proviennent de la recherche déjà
faite pour `/signature` dans la même session, pas d'une recherche nouvelle et
spécifique au multi-pages. À compléter si une recherche plus ciblée est souhaitée.
