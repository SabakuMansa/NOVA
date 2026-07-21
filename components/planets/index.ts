/**
 * Module « planètes procédurales » — point d'entrée public.
 *
 * Usage minimal (dans n'importe quelle scène Three.js, R3F ou vanilla) :
 *
 *   import { createPlanet, PLANET_PRESETS } from "@/components/planets";
 *
 *   const planet = createPlanet({ ...PLANET_PRESETS.terra, seed: 7, radius: 1.2 });
 *   scene.add(planet.group);
 *   planet.setLightDirection(new THREE.Vector3(1, 0.4, 0.6));
 *   // dans la boucle de rendu :
 *   planet.update(clock.elapsedTime);
 *   // au démontage :
 *   planet.dispose();
 *
 * 100 % procédural (shaders GLSL + bruit), aucune texture image. Le module ne
 * dépend que de `three`.
 */
export { createPlanet } from "./createPlanet";
export { PLANET_PRESETS } from "./presets";
export type { PlanetPresetName } from "./presets";
export type {
  PlanetParams,
  PlanetHandle,
  PlanetType,
  PlanetQuality,
  ColorInput,
} from "./types";
