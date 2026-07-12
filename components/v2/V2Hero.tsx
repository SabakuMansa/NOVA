"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { hero } from "@/content/site";
import SignatureBackdrop from "@/components/signature/SignatureBackdrop";

/**
 * Hero palier 3 de /v2 : réutilise le shader « braises » vérifié pour
 * /signature, habillé avec le VRAI copy du site (content.hero) — pas un texte
 * inventé. Le texte est dans le DOM (lisible sans JS), révélé mot par mot en
 * CSS (.sig-word, repose à opacity 1), avec un léger parallaxe au pointeur.
 */
function splitWords(text: string, startIndex: number) {
  return text.split(" ").map((w, i) => (
    <span key={i}>
      <span
        className="sig-word inline-block"
        style={{ animationDelay: `${((startIndex + i) * 0.05).toFixed(2)}s` }}
      >
        {w}
      </span>{" "}
    </span>
  ));
}

export default function V2Hero() {
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
      tx = ((e.clientX / window.innerWidth) * 2 - 1) * 8;
      ty = ((e.clientY / window.innerHeight) * 2 - 1) * 6;
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

  const leadWords = hero.titleLead.split(" ").length;

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-cafe text-nappe">
      <SignatureBackdrop />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-content flex-col justify-center px-5 py-32 md:px-8">
        <p className="sig-word font-mono text-[0.68rem] uppercase tracking-eyebrow text-moutarde">
          {hero.eyebrow}
        </p>

        <div ref={ref} className="will-change-transform">
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.1] tracking-[-0.005em] sm:text-6xl md:text-[4.2rem]">
            {splitWords(hero.titleLead, 1)}
            <span className="sig-word display-em relative inline-block whitespace-nowrap text-moutarde">
              {hero.titleEm}
            </span>
            .
          </h1>
        </div>

        <p
          className="sig-word mt-8 max-w-xl font-sans text-lg leading-relaxed text-nappe/75"
          style={{ animationDelay: `${(leadWords * 0.05 + 0.3).toFixed(2)}s` }}
        >
          {hero.subtitle}
        </p>

        <div
          className="sig-word mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: `${(leadWords * 0.05 + 0.4).toFixed(2)}s` }}
        >
          <Link
            href={hero.ctaPrimary.href.startsWith("#") ? "/v2/contact" : hero.ctaPrimary.href}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-lie px-7 py-4 font-sans text-base font-medium text-nappe shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {hero.ctaPrimary.label}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/v2/approche"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-nappe/25 px-7 py-4 font-sans text-base text-nappe transition-colors hover:border-nappe hover:bg-nappe/10"
          >
            Découvrir l'approche
          </Link>
        </div>

        <p className="sig-word mt-14 font-mono text-[0.6rem] uppercase tracking-eyebrow text-nappe/35">
          Bougez le curseur — l'ardoise réagit
        </p>
      </div>
    </section>
  );
}
