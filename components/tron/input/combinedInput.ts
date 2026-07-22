import { type InputSource, type ShipInput } from "../types";

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Fusionne plusieurs sources en une interface neutre unique : le clavier ET le
 * joystick tactile alimentent le même état sans que la physique le sache. Axes
 * sommés (bornés ±1), booléens et fronts montants en OU logique. `targetAngle`
 * (cap absolu, mode joystick) n'est pas sommable : en pratique une seule
 * source le fournit à la fois (le clavier renvoie toujours `null`) — on garde
 * la dernière valeur non nulle rencontrée.
 */
export function createCombinedInput(sources: InputSource[]): InputSource {
  return {
    read(): ShipInput {
      let thrust = 0;
      let turn = 0;
      let boost = false;
      let interact = false;
      let recenter = false;
      let targetAngle: number | null = null;
      for (const s of sources) {
        const i = s.read();
        thrust += i.thrust;
        turn += i.turn;
        boost = boost || i.boost;
        interact = interact || i.interact;
        recenter = recenter || i.recenter;
        if (i.targetAngle !== null) targetAngle = i.targetAngle;
      }
      return { thrust: clamp1(thrust), turn: clamp1(turn), boost, interact, recenter, targetAngle };
    },
    dispose() {
      for (const s of sources) s.dispose();
    },
  };
}
