"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type NotifEvent = { icon: string; text: string; tag: string };

const DEFAULT_TAG_COLORS: Record<string, string> = {
  résa: "bg-arcade-orange/15 text-arcade-orange",
  avis: "bg-arcade-gold/20 text-arcade-gold",
  commande: "bg-arcade-tan/15 text-arcade-tan",
  admin: "bg-arcade-orange/15 text-arcade-orange",
  contact: "bg-arcade-tan/15 text-arcade-tan",
};

/** Flux d'événements simulé : une notif toutes les `intervalMs`, 4 visibles
 *  max. Reduced-motion : liste statique, aucune rotation. Extrait du Hero
 *  v3 (arcade) pour être réutilisé partout où il faut montrer une
 *  automatisation qui se déclenche seule, sans interaction du visiteur —
 *  seul appelant restant : la démo Machine, restylée en arcade le 16/07,
 *  donc les défauts sont désormais directement arcade (plus besoin de
 *  surcharge par prop). */
export default function NotifFeed({
  events,
  tagColors = DEFAULT_TAG_COLORS,
  intervalMs = 2200,
  itemClassName = "border-arcade-border bg-arcade-bg",
  textClassName = "text-arcade-cream/90",
}: {
  events: NotifEvent[];
  tagColors?: Record<string, string>;
  intervalMs?: number;
  /** Surcharge optionnelle du style de la carte — défaut inchangé pour tous
   *  les appelants existants (Hero clair, démo Machine). */
  itemClassName?: string;
  textClassName?: string;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setCount((c) => c + 1), intervalMs);
    return () => clearInterval(t);
  }, [reduce, intervalMs]);

  const visible = Array.from({ length: 4 }, (_, i) => {
    const idx = (count - 3 + i + events.length * 100) % events.length;
    return { ...events[idx], key: count - 3 + i };
  });

  return (
    <ul className="space-y-2.5" aria-live="off">
      {visible.map((e) => (
        <li
          key={e.key}
          className={`${reduce ? "" : "v3-notif"} flex items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 ${itemClassName}`}
        >
          <span className="text-lg" aria-hidden>
            {e.icon}
          </span>
          <span
            className={`min-w-0 flex-1 truncate font-terminal text-base ${textClassName}`}
          >
            {e.text}
          </span>
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.58rem] uppercase ${
              tagColors[e.tag] || "bg-arcade-tan/15 text-arcade-tan"
            }`}
          >
            {e.tag}
          </span>
        </li>
      ))}
    </ul>
  );
}
