"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import type { TouchInput } from "@/components/tron/input/touchInput";

/**
 * HUD tactile — joystick virtuel (bas-gauche) + bouton boost presser-maintenir
 * (bas-droite). Pilote directement `engine.touch` (déjà fusionné dans l'entrée
 * neutre du moteur via `createCombinedInput`, cf. components/tron/engine.ts) :
 * aucune logique de vol ici, juste la traduction gestes → setJoystick/setBoost.
 * Rendu uniquement sur pointeur tactile (cf. détection `pointer: coarse` dans
 * TronPreview).
 */
export default function TronTouchControls({ touch }: { touch: TouchInput }) {
  const padRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const RADIUS = 52; // rayon utile du pad (px) = déplacement max du knob

  const setKnob = useCallback((dx: number, dy: number) => {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const pad = padRef.current;
      if (!pad) return;
      const rect = pad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > RADIUS) {
        dx = (dx / dist) * RADIUS;
        dy = (dy / dist) * RADIUS;
      }
      setKnob(dx, dy);
      touch.setJoystick(dx / RADIUS, dy / RADIUS);
    },
    [touch, setKnob],
  );

  const reset = useCallback(() => {
    setKnob(0, 0);
    touch.setJoystick(0, 0);
  }, [touch, setKnob]);

  // Relâche le joystick au démontage (changement de page, cleanup React).
  useEffect(() => reset, [reset]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    activePointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX, e.clientY);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    handleMove(e.clientX, e.clientY);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    activePointer.current = null;
    reset();
  };

  return (
    <>
      {/* Joystick virtuel — bas-gauche. x → rotation, -y → poussée avant. */}
      <div
        ref={padRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "fixed",
          left: 20,
          bottom: 20,
          width: 116,
          height: 116,
          borderRadius: "50%",
          background: "rgba(4,10,18,0.55)",
          border: "1px solid rgba(95,242,255,0.3)",
          boxShadow: "0 0 18px rgba(95,242,255,0.12)",
          touchAction: "none",
          zIndex: 400,
        }}
      >
        <div
          ref={knobRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 48,
            height: 48,
            marginTop: -24,
            marginLeft: -24,
            borderRadius: "50%",
            background: "rgba(95,242,255,0.25)",
            border: "1px solid #5ff2ff",
            boxShadow: "0 0 14px rgba(95,242,255,0.5)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Boost — bas-droite, presser-maintenir (comme Shift au clavier). */}
      <button
        type="button"
        onPointerDown={() => touch.setBoost(true)}
        onPointerUp={() => touch.setBoost(false)}
        onPointerCancel={() => touch.setBoost(false)}
        onPointerLeave={() => touch.setBoost(false)}
        aria-label="Boost"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 76,
          height: 76,
          borderRadius: "50%",
          background: "rgba(4,10,18,0.55)",
          border: "1px solid rgba(255,107,74,0.4)",
          boxShadow: "0 0 18px rgba(255,107,74,0.18)",
          color: "#ff6b4a",
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          touchAction: "none",
        }}
      >
        BOOST
      </button>
    </>
  );
}
