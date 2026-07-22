import { FLIGHT, WORLD } from "./config";
import { type ShipInput } from "./types";

/**
 * Modèle de vol 2D — Asteroids « à la main », sans collisions.
 *
 * Écrit une seule fois, consomme l'état neutre `ShipInput`. Le vaisseau tourne
 * sur lui-même (angle), la poussée accélère dans la direction du cap, la
 * vélocité s'accumule et glisse par inertie (cœur du feel Asteroids), un drag
 * exponentiel calme quand on lâche les gaz. Une frontière élastique repousse
 * doucement vers le centre au-delà de `WORLD.RADIUS`.
 *
 * Convention : angle en radians, 0 = pointe vers +X (droite). En canvas l'axe Y
 * pointe vers le bas ; `turn > 0` (touche D) tourne dans le sens horaire à
 * l'écran, ce qui est l'attendu.
 */
export interface FlightState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  /** Vitesse scalaire courante (pour caméra/HUD). */
  speed: number;
  /** Fraction du dépassement de frontière 0..1+ (pour l'indice visuel). */
  boundary: number;
  /** Tween de recentrage en cours (null = aucun). */
  recenter: { t: number; x0: number; y0: number } | null;
}

export function createFlightState(x = 0, y = 0, angle = -Math.PI / 2): FlightState {
  return { x, y, vx: 0, vy: 0, angle, speed: 0, boundary: 0, recenter: null };
}

/** Déclenche un recentrage progressif vers (0,0) sur `WORLD.RECENTER_TIME`. */
export function startRecenter(s: FlightState): void {
  s.recenter = { t: 0, x0: s.x, y0: s.y };
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Avance la physique d'un pas `dt` (s) selon `input`. Modifie `state` en place.
 */
export function stepFlight(state: FlightState, input: ShipInput, dt: number): void {
  // dt borné : évite les sauts si l'onglet a été gelé.
  const step = Math.min(dt, 0.05);

  if (input.recenter && !state.recenter) startRecenter(state);

  // — RECENTRAGE : tween prioritaire (interpolation douce, pas de saut). —
  if (state.recenter) {
    state.recenter.t += step / WORLD.RECENTER_TIME;
    const k = easeInOut(Math.min(1, state.recenter.t));
    state.x = state.recenter.x0 * (1 - k);
    state.y = state.recenter.y0 * (1 - k);
    // La vélocité se dissipe pendant le recentrage.
    state.vx *= Math.exp(-4 * step);
    state.vy *= Math.exp(-4 * step);
    if (state.recenter.t >= 1) state.recenter = null;
    state.speed = Math.hypot(state.vx, state.vy);
    return;
  }

  const boost = input.boost ? FLIGHT.BOOST_MULT : 1;

  // — ROTATION —
  if (input.targetAngle !== null) {
    // Mode cap absolu (joystick) : pivote PROGRESSIVEMENT vers le cap visé,
    // par le plus court chemin angulaire (gère le passage par ±π) — jamais un
    // snap instantané, pour garder le feel Asteroids. `turn` est ignoré ici.
    const delta = Math.atan2(
      Math.sin(input.targetAngle - state.angle),
      Math.cos(input.targetAngle - state.angle),
    );
    const maxStep = FLIGHT.JOYSTICK_TURN_SPEED * step;
    state.angle += Math.max(-maxStep, Math.min(maxStep, delta));
  } else {
    // Mode relatif (clavier, inchangé) : turn pivote directement.
    state.angle += input.turn * FLIGHT.TURN_SPEED * step;
  }

  // — POUSSÉE selon le cap (avant plus fort que l'arrière). —
  if (input.thrust !== 0) {
    const sign = input.thrust >= 0 ? 1 : FLIGHT.REVERSE_MULT;
    const a = input.thrust * sign * FLIGHT.ACCEL * boost;
    state.vx += Math.cos(state.angle) * a * step;
    state.vy += Math.sin(state.angle) * a * step;
  }

  // — DRAG exponentiel (indépendant du framerate). —
  const damp = Math.exp(-FLIGHT.DRAG * step);
  state.vx *= damp;
  state.vy *= damp;

  // — FRONTIÈRE ÉLASTIQUE : ressort de rappel au-delà du rayon (pas un mur). —
  const dist = Math.hypot(state.x, state.y);
  if (dist > WORLD.RADIUS && dist > 0.0001) {
    const overshoot = dist - WORLD.RADIUS;
    const nx = -state.x / dist; // vers le centre
    const ny = -state.y / dist;
    const pull = overshoot * WORLD.BOUNDARY_STIFFNESS * step;
    state.vx += nx * pull;
    state.vy += ny * pull;
  }
  // Indice de bord : 0 sous BOUNDARY_START, monte vers 1 au rayon, >1 au-delà.
  state.boundary = Math.max(
    0,
    (dist / WORLD.RADIUS - WORLD.BOUNDARY_START) / (1 - WORLD.BOUNDARY_START),
  );

  // — CLAMP vitesse max. —
  const maxSpeed = FLIGHT.MAX_SPEED * boost;
  const sp = Math.hypot(state.vx, state.vy);
  if (sp > maxSpeed) {
    state.vx *= maxSpeed / sp;
    state.vy *= maxSpeed / sp;
  }

  // — INTÉGRATION position. —
  state.x += state.vx * step;
  state.y += state.vy * step;
  state.speed = Math.hypot(state.vx, state.vy);
}
