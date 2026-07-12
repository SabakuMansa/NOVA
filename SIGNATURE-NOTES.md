# Section signature `/signature` — notes de conception

Pièce maîtresse isolée pour tester le plafond design de NOVA Studio (niveau Awwwards).
**N'affecte pas** la page d'accueil : route dédiée `/signature`, composants sous
`components/signature/`.

## Références consultées (réelles, 2025–2026)

| Référence | Ce qu'on en retient |
| --- | --- |
| **By-Kin** (Awwwards SOTD + Developer Award + FWA) | Typographie éditoriale assumée, scroll « pondéré », transitions qui ne s'affichent jamais pour elles-mêmes → **retenue**, pas de gadget. |
| **Iventions / Minh Pham** (Three.js + GSAP) | WebGL **atmosphérique** (lumière, matière) plutôt que spectacle ; motion « layered over WebGL » avec restraint. → un fond génératif discret, pas un jouet 3D. |
| **Mat Voyce** (Awwwards SOTD, GSAP SOTY nominee) | Typo cinétique **timeline-driven** où « l'animation ne bloque jamais la lecture ». → révélation par mots, texte lisible en permanence. |
| **Obys** | La typo comme système visuel central (lettres qui scale/split/morph). → pousser la typo serif de NOVA. |
| **Bruno Simon** (Awwwards SOTM) | Three.js + physics, mais c'est un cas « portfolio-jeu » → **hors périmètre** ici (trop, pas le message commerçant). |

**Constat transverse (Hon Tran, Studio Meyer)** : la typo cinétique « démo » ne
survit pas en prod si elle se bat contre les lecteurs d'écran, le SEO et le CLS. Les
sites qui gagnent l'utilisent **avec parcimonie sur le hero**, gardent le texte lisible,
soignent le fallback `prefers-reduced-motion`, et tiennent **60fps**.

## Parti-pris retenu — « L'ardoise vivante »

On réinterprète **l'ardoise / le menu du studio** (déjà présents dans la DA NOVA) en
version temps réel :

- **Fond WebGL (palier 3)** : un shader plein écran sur base **café brûlé**, avec une
  chaleur génératif (braises **moutarde / lie / sauge** qui dérivent lentement, comme de
  la vapeur au-dessus d'une plaque), **réactif au pointeur** (une lueur douce suit le
  curseur, comme une main qui essuie l'ardoise). Grain subtil. `transform`/`opacity`,
  jamais de rebond.
- **Typo cinétique (retenue)** : gros titre serif (`font-display`) révélé **mot par mot**
  (CSS, `fill-mode: both` → reste visible), léger **parallaxe au pointeur**. Le texte est
  **dans le DOM, lisible sans JS**.
- **Message** : « un site qui travaille pour vous, conçu par un restaurateur » — cohérent
  avec la DA existante (palette, Instrument Serif, EASE `[0.22,1,0.36,1]`).

## Dégradation gracieuse

1. **Palier 3 (WebGL)** : Three.js via `@react-three/fiber`, **dynamic import client**.
2. **Palier 2 (CSS)** : si WebGL indisponible → dégradé animé CSS (mêmes couleurs).
3. **Reduced-motion** : fond **statique** lisible, aucune animation, texte 100 % visible.
4. **Mobile** : rendu allégé (moins d'itérations shader, pas de parallaxe lourde).

## Choix techniques

- Deps : `three` + `@react-three/fiber` uniquement (shader écrit à la main). **Pas** de
  `drei`/`gsap`/`lenis` → bundle plus léger ; scroll géré par Framer (déjà présent),
  pointeur par `useFrame`.
- WebGL chargé en `next/dynamic({ ssr: false })` : le texte (LCP, accessibilité) est rendu
  côté serveur, le canvas est un **enrichissement** derrière.
- Accessibilité : contenu réel dans le DOM, contrastes OK (texte nappe sur café), respect
  strict de `prefers-reduced-motion`.

## Fichiers

```
app/signature/page.tsx                 Page isolée (noindex), contenu dans le DOM
components/signature/embers.glsl.ts    Shaders (simplex noise + braises + lueur pointeur)
components/signature/SignatureScene.tsx   Canvas r3f + plan shader (client, dynamic)
components/signature/SignatureBackdrop.tsx  Choix WebGL / CSS / statique + voile contraste
components/signature/SignatureTitle.tsx     Typo cinétique (révélation par mot + parallaxe)
app/globals.css                        .signature-static-bg / .signature-css-bg / .sig-word
```

## Vérification effectuée (Chrome réel, premier plan)

- ✅ **Desktop 1440px** : shader de braises animé, lueur moutarde qui suit le curseur,
  parallaxe du titre au pointeur, typo serif cinétique lisible. Rendu « ardoise vivante ».
- ✅ **Mobile 390px** : rendu allégé (dpr réduit), titre qui s'adapte, aucun débordement.
- ✅ **0 erreur console** (aucune erreur three/WebGL/hydratation).
- ✅ **Aucune régression** sur la page d'accueil (`/`) : identique, la pièce est 100 % isolée.
- ✅ Texte présent dans le DOM et lisible (n'attend pas le JS).
- ⚙️ Vérifié via le serveur de dev (pas de `next build` pour ne pas perturber une autre
  session dev en cours sur le même dossier). Typecheck `tsc --noEmit` OK.

## Idées d'itération (si la direction plaît)

- Transition d'entrée « rideau » (l'ardoise qui s'essuie) au chargement.
- Distorsion du texte lui-même (mesh text / MSDF) au survol, au lieu du seul fond.
- Son léger optionnel (braises) au survol, coupé par défaut.
