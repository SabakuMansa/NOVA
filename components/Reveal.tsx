"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Easing "premium" partagé (easeOutExpo-like, sans rebond).
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Animation d'entrée au scroll : fade + translateY(20 → 0).
 * whileInView, déclenchée une seule fois, trigger court (margin -100px).
 * Respecte prefers-reduced-motion : contenu affiché directement, sans transition.
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
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
