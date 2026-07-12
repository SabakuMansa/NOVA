"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/Reveal";

/**
 * `template.tsx` est remonté par Next.js à CHAQUE navigation (contrairement à
 * `layout.tsx` qui persiste) — c'est ce qui permet de rejouer une animation
 * d'entrée de page à chaque changement de route dans /v2.
 * Sous prefers-reduced-motion : aucune animation, contenu affiché directement.
 */
export default function V2Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
