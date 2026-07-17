"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Easter egg déclenché par un clic sur "INSERT COIN" dans le bandeau
 * arcade global — scène décorative façon Space Invaders (pas un jeu
 * jouable), dessinée en Canvas + requestAnimationFrame, résolution
 * plafonnée (devicePixelRatio capé à 2, dimensions internes fixes).
 * reduced-motion : une seule frame statique, aucune boucle rAF.
 */

const COLS = 8;
const ROWS = 5;
const CELL = 3; // taille d'un pixel du sprite, en px canvas
const SPRITE_W = 11;
const SPRITE_H = 8;
const INVADER = SPRITE_W * CELL;
const GAP = 14;
const MARGIN = 16;
const GRID_W = COLS * (INVADER + GAP) - GAP;
const CANVAS_W = GRID_W + MARGIN * 2 + 40; // marge de manœuvre latérale
const CANVAS_H = ROWS * (INVADER + GAP) - GAP + MARGIN * 2 + 60;

// Sprite pixel-art simple (1 = pixel plein), esprit "space invader" classique.
const SPRITE: number[][] = [
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
];

const ROW_COLORS = ["#FF7A00", "#FFD23F", "#FF7A00", "#FFD23F", "#FF7A00"];

export default function InsertCoinOverlay({
  open,
  onClose,
  contactHref,
}: {
  open: boolean;
  onClose: () => void;
  contactHref: string;
}) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Verrou de scroll pendant l'ouverture — restauré à la fermeture, jamais
  // laissé actif (ne bloque donc jamais le reste du site une fois fermé).
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

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const drawInvader = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      for (let r = 0; r < SPRITE_H; r++) {
        for (let c = 0; c < SPRITE_W; c++) {
          if (SPRITE[r][c]) {
            ctx.fillRect(x + c * CELL, y + r * CELL, CELL, CELL);
          }
        }
      }
    };

    const drawGrid = (gridX: number, gridY: number) => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = MARGIN + gridX + c * (INVADER + GAP);
          const y = MARGIN + gridY + r * (INVADER + GAP);
          drawInvader(x, y, ROW_COLORS[r % ROW_COLORS.length]);
        }
      }
    };

    if (reduce) {
      drawGrid(20, 0);
      return;
    }

    let gridX = 20;
    let gridY = 0;
    let dir = 1;
    const speedPxPerSec = 28;
    const dropStep = 18;
    const maxX = CANVAS_W - MARGIN * 2 - GRID_W;
    let last = 0;
    let rafId = 0;

    const frame = (timestamp: number) => {
      if (!last) last = timestamp;
      const dt = (timestamp - last) / 1000;
      last = timestamp;

      gridX += dir * speedPxPerSec * dt;
      if (gridX <= 0 || gridX >= maxX) {
        gridX = Math.max(0, Math.min(gridX, maxX));
        dir *= -1;
        gridY += dropStep;
        if (gridY > CANVAS_H - ROWS * (INVADER + GAP) - MARGIN * 2) {
          gridY = 0;
        }
      }

      drawGrid(gridX, gridY);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [open, reduce]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-arcade-bg/95 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg Insert Coin"
    >
      <div
        className="flex max-w-full flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <canvas
          ref={canvasRef}
          style={{ width: CANVAS_W, height: CANVAS_H, maxWidth: "90vw" }}
          className="rounded-lg border-2 border-arcade-border-thick bg-arcade-bg-alt"
          aria-hidden
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-pixel text-sm text-arcade-gold sm:text-base">
            Game over
          </p>
          <p className="max-w-sm font-terminal text-xl text-arcade-tan">
            Contactez-nous pour continuer.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={contactHref}
            onClick={onClose}
            className="rounded-xl border-2 border-arcade-border-thick bg-arcade-orange px-6 py-3.5 font-pixel text-[0.6rem] text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
          >
            Réserver un audit gratuit
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-arcade-border-thick bg-arcade-card px-6 py-3.5 font-pixel text-[0.6rem] text-arcade-cream transition-colors hover:text-arcade-gold"
          >
            ÉCHAP — Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
