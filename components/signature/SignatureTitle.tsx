"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Le texte est rendu dans le DOM (accessible, lisible sans JS). L'animation
// (révélation par mot en CSS) repose à opacity 1 ; le parallaxe au pointeur est
// un enrichissement facultatif, désactivé sous prefers-reduced-motion.

const LINE = ["Un", "site", "qui", "travaille", "pour", "vous."];
const KICKER = ["Même", "pendant", "le", "coup", "de", "feu."];
const EMPH = "travaille";

function Words({
  words,
  start,
  className = "",
}: {
  words: string[];
  start: number;
  className?: string;
}) {
  return (
    <>
      {words.map((w, idx) => (
        <span key={idx}>
          <span
            className={`sig-word ${className} ${
              w === EMPH ? "italic text-moutarde" : ""
            }`}
            style={{ animationDelay: `${((start + idx) * 0.06).toFixed(2)}s` }}
          >
            {w}
          </span>{" "}
        </span>
      ))}
    </>
  );
}

export default function SignatureTitle() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = ((e.clientX / window.innerWidth) * 2 - 1) * 10;
      ty = ((e.clientY / window.innerHeight) * 2 - 1) * 8;
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div ref={ref} className="will-change-transform">
      <h1 className="font-display text-5xl leading-[1.02] tracking-[-0.01em] text-nappe sm:text-7xl md:text-[5.5rem]">
        <Words words={LINE} start={0} />
      </h1>
      <p className="mt-4 font-display text-2xl italic leading-tight text-nappe/65 sm:text-3xl md:text-4xl">
        <Words words={KICKER} start={LINE.length} />
      </p>
    </div>
  );
}
