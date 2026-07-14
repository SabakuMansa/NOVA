"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Easing "premium" partagé (easeOutExpo-like, sans rebond).
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Animation d'entrée au scroll : fade + translateY(20 → 0).
 * whileInView, déclenchée une seule fois, trigger court (margin -100px).
 * Respecte prefers-reduced-motion : contenu affiché directement, sans transition.
 *
 * `LazyMotion` + `m` (au lieu de `motion`) : seul usage de Framer Motion du
 * site (fade/translateY, rien d'autre — pas de drag, pas de layout). Le
 * feature-set complet de `motion` pèse ~40 Ko compressés dont l'audit
 * Lighthouse mesurait ~30 Ko jamais exécutés sur cette page. `domAnimation`
 * couvre exactement ce qu'on utilise ici, chargé en chunk séparé et dédupliqué
 * automatiquement entre toutes les instances de <Reveal>.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "ul";
}) {
  const reduce = useReducedMotion();
  const MotionTag = m[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionTag
        className={className}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.55, delay, ease: EASE }}
      >
        {children}
      </MotionTag>
    </LazyMotion>
  );
}
