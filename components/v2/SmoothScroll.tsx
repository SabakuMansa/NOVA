"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * Smooth scroll (Lenis) pour l'espace /v2. No-op sous prefers-reduced-motion :
 * le scroll natif du navigateur reste utilisé, aucune dépendance JS pour lire
 * le contenu.
 *
 * Lenis prend le contrôle du rendu du scroll (rAF + position virtuelle) mais
 * ne sait pas qu'un clic sur `<a href="#section">` doit déplacer cette
 * position : le saut natif du navigateur est immédiatement écrasé au tick
 * suivant. D'où le handler de clic ci-dessous, qui délègue explicitement le
 * défilement vers l'ancre à Lenis (`lenis.scrollTo`) au lieu de laisser le
 * navigateur faire un saut que Lenis annulerait.
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic, sans rebond
      smoothWheel: true,
    });

    let raf = 0;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a[href]");
      const href = anchor?.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const path = href.slice(0, hashIndex);
      if (path && path !== window.location.pathname) return;

      const id = href.slice(hashIndex + 1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el, { offset: -90 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
