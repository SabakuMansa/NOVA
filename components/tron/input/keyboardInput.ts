import { type InputSource, type ShipInput } from "../types";

/**
 * Adaptateur CLAVIER — desktop.
 *
 *   Z / ↑  : poussée avant       S / ↓ : poussée arrière douce
 *   Q / ←  : tourner à gauche    D / → : tourner à droite
 *   Shift  : boost               Entrée : interagir (atterrir)   R : recentrer
 *
 * On lit `e.code` (position physique de la touche) : `KeyW` = position Z sur un
 * clavier AZERTY, `KeyA` = position Q → ZQSD fonctionne sans dépendre de la
 * disposition logique. `interact` et `recenter` sont des fronts montants
 * (consommés une fois par appui).
 */
export function createKeyboardInput(): InputSource {
  const pressed = new Set<string>();
  const edge = { interact: false, recenter: false };

  const onKeyDown = (e: KeyboardEvent) => {
    // Évite le scroll de page sur les flèches / espace pendant le pilotage.
    if (
      e.code.startsWith("Arrow") ||
      ["KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)
    ) {
      e.preventDefault();
    }
    if (!pressed.has(e.code)) {
      if (e.code === "Enter") edge.interact = true;
      if (e.code === "KeyR") edge.recenter = true;
    }
    pressed.add(e.code);
  };
  const onKeyUp = (e: KeyboardEvent) => pressed.delete(e.code);

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  const axis = (neg: boolean, pos: boolean) => (pos ? 1 : 0) - (neg ? 1 : 0);

  return {
    read(): ShipInput {
      const forward = pressed.has("KeyW") || pressed.has("ArrowUp");
      const back = pressed.has("KeyS") || pressed.has("ArrowDown");
      const left = pressed.has("KeyA") || pressed.has("ArrowLeft");
      const right = pressed.has("KeyD") || pressed.has("ArrowRight");
      const boost = pressed.has("ShiftLeft") || pressed.has("ShiftRight");

      // Consomme les fronts montants (un seul déclenchement par appui).
      const interact = edge.interact;
      const recenter = edge.recenter;
      edge.interact = false;
      edge.recenter = false;

      return {
        thrust: axis(back, forward),
        turn: axis(left, right),
        boost,
        interact,
        recenter,
        targetAngle: null, // mode relatif : turn pivote directement (cf. flightModel)
      };
    },
    dispose() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      pressed.clear();
    },
  };
}
