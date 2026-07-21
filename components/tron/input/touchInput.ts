import { type InputSource, type ShipInput } from "../types";

/**
 * Adaptateur TACTILE — mobile.
 *
 * Ne lit AUCUN événement lui-même : le HUD React (joystick + boutons) pousse
 * l'état via les setters exposés, et l'adaptateur le restitue sous la même
 * interface neutre. Le joystick fournit un vecteur (x,y) ∈ [-1,1]² :
 *  - `x` → rotation (turn)
 *  - `-y` → poussée (thrust) — vers le haut = avant.
 */
export interface TouchInput extends InputSource {
  setJoystick: (x: number, y: number) => void;
  setBoost: (v: boolean) => void;
  /** Front montant : déclenche interact une fois au prochain read(). */
  pulseInteract: () => void;
  pulseRecenter: () => void;
}

export function createTouchInput(): TouchInput {
  let jx = 0;
  let jy = 0;
  let boost = false;
  const edge = { interact: false, recenter: false };

  return {
    setJoystick(x, y) {
      jx = Math.max(-1, Math.min(1, x));
      jy = Math.max(-1, Math.min(1, y));
    },
    setBoost(v) {
      boost = v;
    },
    pulseInteract() {
      edge.interact = true;
    },
    pulseRecenter() {
      edge.recenter = true;
    },
    read(): ShipInput {
      const interact = edge.interact;
      const recenter = edge.recenter;
      edge.interact = false;
      edge.recenter = false;
      return {
        thrust: -jy, // haut du joystick = avant
        turn: jx,
        boost,
        interact,
        recenter,
      };
    },
    dispose() {
      jx = 0;
      jy = 0;
      boost = false;
    },
  };
}
