"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import SpaceInvadersGame from "./SpaceInvadersGame";

/**
 * Easter egg déclenché par un clic sur "INSERT COIN" dans le bandeau
 * arcade global — overlay plein écran avec un mini-jeu Space Invaders
 * réellement jouable (voir SpaceInvadersGame.tsx). Cet overlay ne gère
 * que le "cadre" : fond, verrou de scroll pendant l'ouverture, fermeture
 * (bouton dédié + touche Échap), et le repli reduced-motion.
 *
 * Pas de fermeture au clic extérieur ici (contrairement à une simple
 * animation décorative) : pendant une partie, un clic un peu large sur
 * le pourtour de l'écran ne doit pas fermer accidentellement le jeu en
 * cours — seuls le bouton dédié et Échap ferment.
 */
export default function InsertCoinOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-arcade-bg/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Mini-jeu Insert Coin"
    >
      <div className="flex max-h-full w-full max-w-xs flex-col items-center gap-4 overflow-y-auto py-4">
        {reduce ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-arcade-border-thick bg-arcade-bg-alt p-8 text-center">
            <p className="font-pixel text-sm text-arcade-gold">Insert Coin</p>
            <p className="max-w-xs font-terminal text-xl text-arcade-tan">
              Cette fonctionnalité nécessite les animations activées.
            </p>
          </div>
        ) : (
          <SpaceInvadersGame />
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border-2 border-arcade-border-thick bg-arcade-card px-6 py-3.5 font-sans text-[0.6rem] text-arcade-cream transition-colors hover:text-arcade-gold"
        >
          ÉCHAP — Fermer
        </button>
      </div>
    </div>
  );
}
