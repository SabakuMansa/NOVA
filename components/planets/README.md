# Module « planètes procédurales »

Sphères 3D générées **100 % par shader GLSL** (bruit simplex + FBM), sans aucune
texture image. Chaque planète est pilotée par paramètres → variété infinie,
poids négligeable. Le module ne dépend que de **`three`** (aucune dépendance
R3F) : il se branche dans n'importe quelle scène Three.js, R3F ou vanilla.

## Utilisation

```ts
import * as THREE from "three";
import { createPlanet, PLANET_PRESETS } from "@/components/planets";

const planet = createPlanet({ ...PLANET_PRESETS.terra, seed: 7, radius: 1.2 });
scene.add(planet.group);
planet.setLightDirection(new THREE.Vector3(1, 0.4, 0.6)); // le « soleil »

// boucle de rendu :
planet.update(clock.getElapsedTime()); // pilote uTime + rotation, chaque frame

// démontage :
planet.dispose();
```

En R3F : `<primitive object={planet.group} />` et appeler `planet.update(t)`
dans un `useFrame` (voir `components/labo/PlanetsPreview.tsx`, la preview jetable).

## `createPlanet(params)` → `PlanetHandle`

`PlanetParams` (tout optionnel, défauts propres — voir `types.ts`) :

| Champ | Rôle |
|---|---|
| `seed` | varie le bruit ; suffit à distinguer 2 planètes du même type |
| `radius`, `rotationSpeed` | taille, vitesse de rotation propre (rad/s) |
| `type` | `terrestrial` (continents/relief) ou `gas` (bandes animées) |
| `colorOcean/Low/High` | palette (océan/bande sombre, terres basses, terres hautes) |
| `seaLevel` | seuil océan/terre 0..1 (ignoré en gaz) |
| `hasAtmosphere` + `atmosphereColor`/`atmosphereStrength` | halo fresnel |
| `hasRings` + `ringColor`/`ringInner`/`ringOuter`/`ringTilt` | anneau |
| `hasClouds` + `cloudColor`/`cloudOpacity` | seconde coquille nuageuse |
| `frequency` | finesse des motifs (relief/bandes) |
| `quality` | `high` (128 seg / 5 octaves) ou `low` (48 / 3) — **mode dégradé mobile** |

`PlanetHandle` : `{ group, update(elapsed), setLightDirection(dir), dispose(), params }`.

7 presets prêts à l'emploi dans `PLANET_PRESETS` : `terra`, `volcanic`, `desert`,
`ice`, `gasViolet`, `gasAmber`, `oceanWorld`.

## Perf

- Coût dominé par le fragment shader (bruit). `quality: 'low'` réduit segments
  **et** octaves → viser 60 fps sur mobile / avec beaucoup de planètes.
- `dispose()` libère géométries + matériaux.
- Rendu conseillé **sans tone-mapping ACES** (couleurs stylisées) : côté R3F,
  passer `flat` au `<Canvas>` (cf. la preview).

## Fichiers

`createPlanet.ts` (fabrique) · `types.ts` (API) · `presets.ts` (7 palettes) ·
`noise.glsl.ts` (simplex 3D + FBM partagés) · `planet.glsl.ts` (surface,
terrestre + gaz) · `atmosphere.glsl.ts` · `clouds.glsl.ts` · `rings.glsl.ts` ·
`index.ts` (barrel).

Preview jetable : `app/labo/planetes` + `components/labo/PlanetsPreview.tsx`
(hors module, supprimable).
