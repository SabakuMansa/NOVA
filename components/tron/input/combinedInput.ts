import { type InputSource, type ShipInput } from "../types";

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Fusionne plusieurs sources en une interface neutre unique : le clavier ET le
 * joystick tactile alimentent le même état sans que la physique le sache. Axes
 * sommés (bornés ±1), booléens et fronts montants en OU logique.
 */
export function createCombinedInput(sources: InputSource[]): InputSource {
  return {
    read(): ShipInput {
      let thrust = 0;
      let turn = 0;
      let boost = false;
      let interact = false;
      let recenter = false;
      for (const s of sources) {
        const i = s.read();
        thrust += i.thrust;
        turn += i.turn;
        boost = boost || i.boost;
        interact = interact || i.interact;
        recenter = recenter || i.recenter;
      }
      return { thrust: clamp1(thrust), turn: clamp1(turn), boost, interact, recenter };
    },
    dispose() {
      for (const s of sources) s.dispose();
    },
  };
}
