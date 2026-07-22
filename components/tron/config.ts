/**
 * Réglages centraux du module Tron — TOUT ce qui s'ajuste est ici.
 *
 * Unités monde arbitraires (pixels-monde). Le vaisseau et les planètes vivent
 * dans un plan 2D ; la caméra convertit monde → écran.
 */

// ── Physique de vol (arcade Asteroids ; game-feel > réalisme) ───────────────
export const FLIGHT = {
  ACCEL: 1500, // accélération de poussée (unités/s²) — punchy, compense le drag
  MAX_SPEED: 620, // vitesse max (unités/s)
  BOOST_MULT: 1.8, // multiplicateur accel + vitesse max sous boost
  DRAG: 2.4, // amortissement/s — assez marqué : le vaisseau se pose vite (~1 s)
  REVERSE_MULT: 0.5, // poussée arrière (S/↓) plus faible que l'avant
  TURN_SPEED: 3.4, // vitesse de rotation (rad/s) — mode relatif, clavier (turn)
  // Mode cap absolu (joystick tactile, cf. flightModel.stepFlight) : le
  // vaisseau pivote PROGRESSIVEMENT vers le cap visé (targetAngle), jamais un
  // snap instantané — c'est ce qui garde le feel Asteroids au pouce.
  JOYSTICK_TURN_SPEED: 3.4, // vitesse de rotation vers le cap visé (rad/s) — réglable indépendamment du clavier
  JOYSTICK_DEAD_ZONE: 0.12, // intensité (0..1) sous laquelle le joystick est ignoré (micro-mouvements du pouce au repos)
} as const;

// ── Monde + frontière élastique ─────────────────────────────────────────────
export const WORLD = {
  RADIUS: 2800, // rayon du monde jouable (contient les 4 planètes + marge)
  BOUNDARY_START: 0.85, // fraction du rayon où l'indice de bord commence
  BOUNDARY_STIFFNESS: 3.2, // raideur du ressort de rappel au-delà du rayon
  RECENTER_TIME: 1.0, // durée du recentrage (s)
} as const;

// ── Caméra 2D ───────────────────────────────────────────────────────────────
export const CAMERA = {
  LERP: 3.5, // réactivité du suivi (plus grand = plus rigide), par seconde
  // Vue « carte » dézoomée : on voit plusieurs planètes en naviguant, pas
  // seulement celle dont on s'approche. (1 = 1 unité monde par pixel.)
  BASE_ZOOM: 0.5, // zoom au repos
  MIN_ZOOM: 0.42, // zoom à vitesse max (dézoom = sensation de vitesse)
  ZOOM_LERP: 2, // réactivité du zoom
} as const;

// ── Direction artistique néon (couleurs signature K1000 + accents) ──────────
// Faciles à changer : une couleur dominante (corail K1000) + un cyan « Tron ».
export const NEON = {
  BG: "#04060a", // fond quasi noir
  GRID: "rgba(60,120,160,0.06)", // grille de perspective très discrète
  STAR: "rgba(180,220,255,0.7)",
  SHIP: "#5ff2ff", // vaisseau : cyan Tron lumineux
  SHIP_CORE: "#ffffff",
  THRUST: "#ff6b4a", // flamme/traînée : corail K1000
  BOUNDARY: "#ff3b6b", // anneau-frontière : rose-rouge d'alerte
  HUD: "#8be9ff",
} as const;

// Palette d'anneaux planètes (néon distinct par planète).
export const PLANET_COLORS = [
  "#5ff2ff", // cyan
  "#ff6b4a", // corail
  "#c8ff3d", // vert acide
  "#b76bff", // violet
  "#ffc53d", // or
  "#ff3b8b", // magenta
  "#3dffa8", // menthe
] as const;

// ── Qualité (dégradable pour mobile) ────────────────────────────────────────
export interface QualitySettings {
  glow: number; // multiplicateur de shadowBlur (0 = pas de glow)
  trailMax: number; // nombre max de segments de traînée
  starCount: number; // densité du champ d'étoiles
  grid: boolean; // grille de perspective
  cacheScale: number; // résolution des caches d'assets (1 = pleine, <1 = mobile)
}

export const QUALITY: Record<"high" | "low", QualitySettings> = {
  high: { glow: 1, trailMax: 60, starCount: 220, grid: true, cacheScale: 1 },
  low: { glow: 0.5, trailMax: 24, starCount: 90, grid: false, cacheScale: 0.6 },
};

// ── Vaisseau (asset) ────────────────────────────────────────────────────────
export const SHIP = {
  SIZE: 96, // côté de la boîte de dessin de l'asset (unités monde)
  CENTER_OFFSET: { x: 0, y: 0 }, // ancrage de rotation (fraction de l'image)
} as const;

// ── Mapping planète → page réelle du site ───────────────────────────────────
// Une entrée par page. `route` = destination de navigation (la preview logge).
// `radius` = demi-boîte de dessin de l'asset (les rayons/glow vont jusqu'au bord).
// `centerOffset` corrige les assets dont le centre visuel ≠ centre de l'image
// (fraction de l'image, défaut 0,0 — à ajuster à l'œil pour Labo/Accueil).
// `accent` sert au halo d'approche + label HUD ; le glow de l'asset est baké.
export interface PlanetPage {
  key: string;
  name: string;
  route: string;
  asset: string; // chemin public de l'asset PNG
  accent: string;
  rotationSpeed: number; // rad/s (rotation propre lente)
  centerOffset: { x: number; y: number };
  x: number;
  y: number;
  radius: number;
  approachRadius: number;
}

export const PLANET_PAGES: PlanetPage[] = [
  {
    key: "accueil",
    name: "Accueil",
    route: "/",
    asset: "/tron/planets/accueil.png",
    accent: "#5ff2ff",
    rotationSpeed: 0.08,
    centerOffset: { x: 0, y: 0 },
    x: 0,
    y: -520,
    radius: 220,
    approachRadius: 360,
  },
  {
    key: "les-plans",
    name: "Les plans",
    route: "/#plans",
    asset: "/tron/planets/les-plans.png",
    accent: "#ffc53d",
    rotationSpeed: -0.06,
    centerOffset: { x: 0, y: 0 },
    x: -1250,
    y: 520,
    radius: 190,
    approachRadius: 330,
  },
  {
    key: "qui-suis-je",
    name: "Qui suis-je",
    // Route réelle existante du site (pas « /qui-suis-je »).
    route: "/qui-je-suis",
    asset: "/tron/planets/qui-suis-je.png",
    accent: "#ff6b4a",
    rotationSpeed: 0.07,
    centerOffset: { x: 0, y: 0 },
    x: 1150,
    y: -360,
    radius: 200,
    approachRadius: 340,
  },
  {
    key: "labo",
    name: "Labo",
    route: "/labo",
    asset: "/tron/planets/labo.png",
    accent: "#b76bff",
    rotationSpeed: -0.05,
    centerOffset: { x: 0, y: 0 },
    x: 320,
    y: 1080,
    radius: 210,
    approachRadius: 350,
  },
];
