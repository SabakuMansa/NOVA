/**
 * Types partagés du module Tron.
 */

/**
 * État d'entrée neutre — la physique ne consomme QUE ça, peu importe la source
 * (clavier, tactile…). Écrite une seule fois.
 */
export interface ShipInput {
  /** Poussée : -1 (arrière) … 0 … +1 (avant). */
  thrust: number;
  /** Rotation : -1 (gauche) … 0 … +1 (droite). */
  turn: number;
  /** Boost maintenu (Shift / bouton propulsion). */
  boost: boolean;
  /** Action ponctuelle (Entrée / clic / bouton atterrir). */
  interact: boolean;
  /** Demande de recentrage ponctuelle (touche R / bouton). */
  recenter: boolean;
  /**
   * Cap absolu visé, en radians (mode joystick) — `null` = mode relatif
   * (clavier) : `turn` fait alors pivoter le vaisseau comme aujourd'hui.
   * Quand renseigné, `flightModel.stepFlight` fait pivoter le vaisseau
   * PROGRESSIVEMENT vers ce cap (pas de snap) et ignore `turn`.
   */
  targetAngle: number | null;
}

export const NEUTRAL_INPUT: ShipInput = {
  thrust: 0,
  turn: 0,
  boost: false,
  interact: false,
  recenter: false,
  targetAngle: null,
};

/** Source d'entrées : `read()` renvoie l'état courant, `dispose()` nettoie. */
export interface InputSource {
  read: () => ShipInput;
  dispose: () => void;
}

/**
 * Descripteur d'une planète = point d'intérêt. Le rendu (cercle néon) et la
 * navigation (name/slug) sont tenus ensemble ici ; `slug` sera relié à la vraie
 * page projet plus tard.
 */
export interface World {
  x: number;
  y: number;
  radius: number;
  name: string;
  slug: string;
  color: string;
  /** Rayon d'approche : à l'intérieur, l'atterrissage est proposé. */
  approachRadius: number;

  // — Champs assets/navigation (optionnels ; absents = rendu procédural). —
  /** Chemin public de l'asset PNG (ex. "/tron/planets/accueil.png"). */
  asset?: string;
  /** Destination de navigation à l'atterrissage (ex. "/qui-je-suis"). */
  route?: string;
  /** Vitesse de rotation propre de l'asset (rad/s). */
  rotationSpeed?: number;
  /** Décalage du centre de rotation (fraction de l'image), défaut {0,0}. */
  centerOffset?: { x: number; y: number };
}

/** Options de création du moteur Tron. */
export interface TronEngineOptions {
  worlds: World[];
  /** Chemin public de l'asset vaisseau (ex. "/tron/ship.png"). */
  shipAsset?: string;
  quality?: "high" | "low";
  reducedMotion?: boolean;
  /** Appelé quand la planète à portée change (null = plus aucune). */
  onProximity?: (world: World | null) => void;
  /** Appelé à l'atterrissage (Entrée/clic à portée) avec la planète atterrie. */
  onLand?: (world: World) => void;
  /** Appelé ~2×/s avec les FPS mesurés (HUD de debug). */
  onFps?: (fps: number) => void;
  /** Position/cap initiaux du vaisseau — défaut (0,0), cap vers le haut.
   *  Utilisé pour réapparaître près de la dernière planète quittée. */
  spawn?: { x: number; y: number; angle?: number };
}
