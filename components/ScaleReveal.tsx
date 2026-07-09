"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./Reveal";

/**
 * Entrée "objet entier" : fade + scale très léger (0.98 → 1), sans translateY
 * ni stagger. Utilisé pour « La Carte » afin qu'elle apparaisse comme une carte
 * physique unique, jamais construite morceau par morceau.
 */
export default function ScaleReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
