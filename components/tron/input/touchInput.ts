import { FLIGHT } from "../config";
import { type InputSource, type ShipInput } from "../types";

/**
 * Adaptateur TACTILE — mobile.
 *
 * Ne lit AUCUN événement lui-même : le HUD React (joystick + boutons) pousse
 * l'état via les setters exposés, et l'adaptateur le restitue sous la même
 * interface neutre. Le joystick fournit un vecteur (x,y) ∈ [-1,1]² (même
 * repère écran que le monde, Y vers le bas) — contrairement au clavier
 * (rotation relative via `turn`), un joystick donne une direction ABSOLUE :
 * le doigt pointe où le vaisseau doit aller. On restitue donc un cap visé
 * (`targetAngle` = angle du vecteur) plutôt qu'un `turn` — `flightModel`
 * pivote alors progressivement vers ce cap (jamais un snap). L'intensité
 * (distance au centre, zone morte appliquée) pilote la poussée, proportionnelle.
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

      const magnitude = Math.min(1, Math.hypot(jx, jy));
      let targetAngle: number | null = null;
      let thrust = 0;
      if (magnitude >= FLIGHT.JOYSTICK_DEAD_ZONE) {
        // atan2(y,x) dans le même repère écran/monde (Y vers le bas) que le
        // reste du moteur : haut du joystick (jy<0) → angle -π/2 = "haut".
        targetAngle = Math.atan2(jy, jx);
        // Remappe [DEAD_ZONE, 1] → [0, 1] : la poussée démarre à 0 pile après
        // la zone morte plutôt que de sauter à DEAD_ZONE.
        thrust = (magnitude - FLIGHT.JOYSTICK_DEAD_ZONE) / (1 - FLIGHT.JOYSTICK_DEAD_ZONE);
      }

      return {
        thrust,
        turn: 0, // non utilisé en tactile — la direction passe par targetAngle
        boost,
        interact,
        recenter,
        targetAngle,
      };
    },
    dispose() {
      jx = 0;
      jy = 0;
      boost = false;
    },
  };
}
