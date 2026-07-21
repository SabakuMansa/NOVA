import type { PlanetParams } from "./types";

/**
 * 7 presets de planètes — palettes prêtes à l'emploi couvrant les archétypes
 * demandés (rouge volcanique, océan bleu, désertique ambre, gazeuse violette à
 * bandes, etc.). Chaque preset est un `PlanetParams` partiel : on peut le
 * surcharger (notamment `seed`, `radius`) à l'instanciation.
 *
 *   createPlanet({ ...PLANET_PRESETS.volcanic, seed: 42 })
 *
 * Le `seed` seul suffit à rendre deux planètes du même preset distinctes.
 */
export const PLANET_PRESETS = {
  /** Monde tempéré type Terre — océans bleus, continents verts, nuages. */
  terra: {
    type: "terrestrial",
    colorOcean: 0x184a8c,
    colorLow: 0x2f7d4f,
    colorHigh: 0xcbb487,
    seaLevel: 0.5,
    hasAtmosphere: true,
    atmosphereColor: 0x6ab7ff,
    hasClouds: true,
    cloudOpacity: 0.7,
  },

  /** Monde volcanique — mers de lave sombres, coulées rouge-orangé, halo braise. */
  volcanic: {
    type: "terrestrial",
    colorOcean: 0x2a0a06,
    colorLow: 0xc0341a,
    colorHigh: 0xf2c14e,
    seaLevel: 0.55,
    hasAtmosphere: true,
    atmosphereColor: 0xff5a2a,
    atmosphereStrength: 1.2,
    hasClouds: false,
  },

  /** Monde désertique — dunes ambre/ocre, quasi sans océan, halo doré discret. */
  desert: {
    type: "terrestrial",
    colorOcean: 0x8a5a2b,
    colorLow: 0xc98a3c,
    colorHigh: 0xe8c07a,
    seaLevel: 0.22,
    hasAtmosphere: true,
    atmosphereColor: 0xf0d9a8,
    atmosphereStrength: 0.6,
    hasClouds: false,
  },

  /** Monde glacé — banquise blanche, mers cyan pâle, halo givré, nuages. */
  ice: {
    type: "terrestrial",
    colorOcean: 0x9fd6e8,
    colorLow: 0xeaf4f8,
    colorHigh: 0xc9e6f2,
    seaLevel: 0.5,
    hasAtmosphere: true,
    atmosphereColor: 0xbfeaff,
    hasClouds: true,
    cloudOpacity: 0.6,
  },

  /** Géante gazeuse violette — bandes magenta animées, anneau, halo pourpre. */
  gasViolet: {
    type: "gas",
    colorOcean: 0x3a1f5c,
    colorLow: 0x8b4fbf,
    colorHigh: 0xe0c3ff,
    frequency: 3.2,
    hasAtmosphere: true,
    atmosphereColor: 0x9b5cff,
    hasRings: true,
    ringColor: 0xb79fd0,
    ringInner: 1.4,
    ringOuter: 2.3,
    ringTilt: 0.35,
  },

  /** Géante gazeuse ambre façon Jupiter — bandes crème/brun, anneau, halo chaud. */
  gasAmber: {
    type: "gas",
    colorOcean: 0x6e4326,
    colorLow: 0xc99a5b,
    colorHigh: 0xf3e2c0,
    frequency: 3.0,
    hasAtmosphere: true,
    atmosphereColor: 0xf0c98a,
    atmosphereStrength: 0.9,
    hasRings: true,
    ringColor: 0xd8c9a8,
    ringInner: 1.5,
    ringOuter: 2.4,
    ringTilt: 0.28,
  },

  /** Monde-océan — presque entièrement d'eau, quelques archipels, halo turquoise. */
  oceanWorld: {
    type: "terrestrial",
    colorOcean: 0x0f6f8c,
    colorLow: 0x2f8f6f,
    colorHigh: 0x9fd0b0,
    seaLevel: 0.68,
    hasAtmosphere: true,
    atmosphereColor: 0x6fe0d0,
    hasClouds: true,
    cloudOpacity: 0.65,
  },
} satisfies Record<string, PlanetParams>;

export type PlanetPresetName = keyof typeof PLANET_PRESETS;
