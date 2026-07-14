"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type NotifEvent = { icon: string; text: string; tag: string };

const DEFAULT_TAG_COLORS: Record<string, string> = {
  résa: "bg-violet/15 text-violet",
  avis: "bg-jaune/25 text-encre",
  commande: "bg-corail/15 text-corail",
  admin: "bg-teal/15 text-teal",
  contact: "bg-teal/15 text-teal",
};

/** Flux d'événements simulé : une notif toutes les `intervalMs`, 4 visibles
 *  max. Reduced-motion : liste statique, aucune rotation. Extrait du Hero
 *  v3 pour être réutilisé partout où il faut montrer une automatisation
 *  qui se déclenche seule, sans interaction du visiteur. */
export default function NotifFeed({
  events,
  tagColors = DEFAULT_TAG_COLORS,
  intervalMs = 2200,
}: {
  events: NotifEvent[];
  tagColors?: Record<string, string>;
  intervalMs?: number;
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
          className={`${reduce ? "" : "v3-notif"} flex items-center gap-3 rounded-xl border-2 border-encre/10 bg-lait px-3.5 py-2.5`}
        >
          <span className="text-lg" aria-hidden>
            {e.icon}
          </span>
          <span className="min-w-0 flex-1 truncate font-sans text-[0.83rem] text-encre/85">
            {e.text}
          </span>
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.58rem] uppercase ${
              tagColors[e.tag] || "bg-encre/10 text-encre"
            }`}
          >
            {e.tag}
          </span>
        </li>
      ))}
    </ul>
  );
}
