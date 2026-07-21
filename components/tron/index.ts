/**
 * Module « navigation spatiale 2D Tron » — point d'entrée public.
 *
 * Canvas 2D natif (aucun Three.js/WebGL), 100 % autonome. L'engine possède la
 * boucle rAF ; le composant hôte monte un `<canvas>`, crée l'engine avec la
 * liste des mondes, superpose le HUD HTML, et appelle `dispose()` au démontage.
 */
export { createTronEngine, type TronEngine } from "./engine";
export {
  FLIGHT,
  WORLD,
  CAMERA,
  NEON,
  PLANET_COLORS,
  QUALITY,
  SHIP,
  PLANET_PAGES,
  type PlanetPage,
} from "./config";
export type { World, ShipInput, TronEngineOptions } from "./types";
