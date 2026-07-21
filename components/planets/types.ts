import type * as THREE from "three";

/**
 * Module « planètes procédurales » — types publics.
 *
 * Objectif : `createPlanet(params)` renvoie un `PlanetHandle` dont le `.group`
 * (un THREE.Group vanilla, aucune dépendance R3F) se branche dans n'importe
 * quelle scène Three.js. Tout le rendu vient de shaders GLSL (bruit
 * procédural), aucune texture image.
 */

export type PlanetType = "terrestrial" | "gas";

/** Qualité de rendu — pilote la finesse de sphère et le nombre d'octaves FBM. */
export type PlanetQuality = "high" | "low";

/** Couleur acceptée en entrée : hex (`0xff8844` ou `"#ff8844"`) ou THREE.Color. */
export type ColorInput = number | string | THREE.Color;

/**
 * Paramètres de `createPlanet`. Tout est optionnel sauf le type implicite :
 * des défauts propres s'appliquent (voir `resolveParams` dans createPlanet.ts).
 * Le `seed` suffit à distinguer deux planètes du même type (il décale le
 * domaine du bruit + dérive de micro-variations).
 */
export interface PlanetParams {
  /** Graine de variation du bruit. Deux seeds différents ⇒ reliefs différents. */
  seed?: number;
  /** Rayon de la sphère (unités de scène). Défaut 1. */
  radius?: number;
  /** Vitesse de rotation propre, en rad/s. Défaut 0.05. */
  rotationSpeed?: number;
  /** `terrestrial` (continents/relief) ou `gas` (bandes horizontales). */
  type?: PlanetType;

  // --- Palette (pilote entièrement les couleurs, jamais imposée par le seed) ---
  /** Couleur des océans (terrestre) / bande sombre (gaz). */
  colorOcean?: ColorInput;
  /** Couleur des terres basses (terrestre) / bande médiane (gaz). */
  colorLow?: ColorInput;
  /** Couleur des terres hautes / montagnes (terrestre) / bande claire (gaz). */
  colorHigh?: ColorInput;

  /** Seuil océan/terre, 0..1. Bas = beaucoup d'océan. Ignoré en gaz. Défaut 0.5. */
  seaLevel?: number;

  // --- Atmosphère (halo fresnel) ---
  hasAtmosphere?: boolean;
  atmosphereColor?: ColorInput;
  /** Intensité du halo. Défaut 1. */
  atmosphereStrength?: number;

  // --- Anneaux ---
  hasRings?: boolean;
  ringColor?: ColorInput;
  /** Rayon interne de l'anneau, en multiples du rayon planète. Défaut 1.4. */
  ringInner?: number;
  /** Rayon externe de l'anneau, en multiples du rayon planète. Défaut 2.2. */
  ringOuter?: number;
  /** Inclinaison de l'anneau, en radians. Défaut 0.35. */
  ringTilt?: number;

  // --- Nuages (seconde coquille) ---
  hasClouds?: boolean;
  cloudColor?: ColorInput;
  /** Opacité maximale des nuages, 0..1. Défaut 0.75. */
  cloudOpacity?: number;

  /**
   * Fréquence de base du relief / des bandes. Plus haut = motifs plus fins.
   * Défaut 2.2 (terrestre) / 3.0 (gaz), appliqué si non fourni.
   */
  frequency?: number;

  /** `high` (128 seg / 5 octaves) ou `low` pour mobile (48 seg / 3 octaves). */
  quality?: PlanetQuality;
}

/**
 * Objet retourné par `createPlanet`. `group` s'ajoute à la scène ; `update`
 * doit être appelé chaque frame (pilote `uTime` + rotation) ; `dispose` libère
 * géométries et matériaux quand la planète quitte la scène.
 */
export interface PlanetHandle {
  /** À ajouter dans ta scène : `scene.add(handle.group)`. */
  group: THREE.Group;
  /** Appeler chaque frame avec le temps écoulé cumulé (secondes). */
  update: (elapsed: number) => void;
  /**
   * Oriente le « soleil » de la scène. `dir` pointe de la planète vers la
   * lumière (sera normalisé). Défaut : (1, 0.4, 0.6).
   */
  setLightDirection: (dir: THREE.Vector3) => void;
  /** Libère toutes les ressources GPU de cette planète. */
  dispose: () => void;
  /** Paramètres résolus effectivement utilisés (défauts appliqués). */
  readonly params: Required<
    Omit<
      PlanetParams,
      | "colorOcean"
      | "colorLow"
      | "colorHigh"
      | "atmosphereColor"
      | "ringColor"
      | "cloudColor"
    >
  >;
}
