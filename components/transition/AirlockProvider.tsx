"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * COUCHE DE TRANSITION « SAS » persistante.
 *
 * Monté dans le layout RACINE (`app/layout.tsx`), ce provider n'est jamais
 * démonté quand on change de route — condition indispensable pour qu'une
 * animation tienne PAR-DESSUS `router.push` (une animation posée dans la page
 * espace serait coupée par la navigation).
 *
 * Séquence d'un « sas » (déclenché par `useAirlock().enter(route)`) :
 *   1. closing  — les portes verticales néon se ferment (couvrent l'écran).
 *   2. held     — une fois fermées, on lance `router.push(route)` ; les portes
 *                 restent fermées pendant que la nouvelle page se monte.
 *   3. opening  — quand la destination est prête (pathname === cible, après un
 *                 minimum de maintien) OU au filet de sécurité, les portes
 *                 s'ouvrent sur la vraie page.
 *   4. idle     — overlay réinitialisé, inerte (portes hors écran).
 *
 * Hors transition, le provider est un simple passthrough : il rend `{children}`
 * inchangés + un overlay inerte (`pointer-events:none`, portes hors écran) →
 * additif, aucune page n'est affectée.
 */

// ── Durées réglables (ms) ────────────────────────────────────────────────────
const DOOR_CLOSE_MS = 520; // fermeture des portes
const HELD_MIN_MS = 320; // pause « sas » minimale (portes fermées) avant réouverture
const DOOR_OPEN_MS = 520; // réouverture des portes
const HELD_MAX_MS = 1800; // filet de sécurité : ouvre même si la page tarde
const REDUCED_MS = 280; // durée du fondu simple en prefers-reduced-motion

type Phase = "idle" | "closing" | "held" | "opening";

interface AirlockContext {
  /** Déclenche le sas puis navigue vers `route`. */
  enter: (route: string) => void;
  /** true dès qu'une transition est en cours (utile pour figer des entrées). */
  active: boolean;
}

const Ctx = createContext<AirlockContext | null>(null);

/** Hook d'accès au sas. Doit être appelé sous `<AirlockProvider>`. */
export function useAirlock(): AirlockContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAirlock doit être utilisé dans <AirlockProvider>");
  return ctx;
}

/** Chemin sans hash ni query (pour comparer à `usePathname()`). */
const pathOf = (route: string) => route.split(/[?#]/)[0] || "/";

export default function AirlockProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("idle");
  const targetPath = useRef<string | null>(null);
  const heldStart = useRef(0);
  const reducedRef = useRef(false);
  const timers = useRef<number[]>([]);

  // Programme un timer et le mémorise pour nettoyage.
  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => clearTimers();
  }, [clearTimers]);

  const enter = useCallback(
    (route: string) => {
      if (phase !== "idle") return; // une transition à la fois
      clearTimers();
      targetPath.current = pathOf(route);
      const closeMs = reducedRef.current ? REDUCED_MS : DOOR_CLOSE_MS;

      // 1) Fermeture.
      setPhase("closing");

      // 2) Portes fermées → navigation (l'espace est masqué), puis maintien.
      after(closeMs, () => {
        router.push(route);
        heldStart.current = Date.now();
        setPhase("held");
        // Filet de sécurité : ouvre quoi qu'il arrive après HELD_MAX_MS.
        after(HELD_MAX_MS, () => {
          setPhase((p) => (p === "held" ? "opening" : p));
        });
      });
    },
    [phase, router, after, clearTimers],
  );

  // 3) Réouverture : dès que la destination est montée (pathname === cible) et
  //    qu'un minimum de maintien s'est écoulé. Couvre l'instant du changement
  //    de route (les portes ne s'ouvrent jamais AVANT que la page soit là).
  useEffect(() => {
    if (phase !== "held") return;
    if (targetPath.current !== null && pathname !== targetPath.current) return;
    const elapsed = Date.now() - heldStart.current;
    const wait = Math.max(0, HELD_MIN_MS - elapsed);
    const id = after(wait, () => setPhase("opening"));
    return () => clearTimeout(id);
  }, [phase, pathname, after]);

  // 5→6) Fin d'ouverture → idle (overlay réinitialisé).
  useEffect(() => {
    if (phase !== "opening") return;
    const openMs = reducedRef.current ? REDUCED_MS : DOOR_OPEN_MS;
    const id = after(openMs, () => {
      setPhase("idle");
      targetPath.current = null;
    });
    return () => clearTimeout(id);
  }, [phase, after]);

  const active = phase !== "idle";
  // Portes « fermées » pendant closing + held (couvrent l'écran).
  const closed = phase === "closing" || phase === "held";

  return (
    <Ctx.Provider value={{ enter, active }}>
      {children}
      <AirlockDoors closed={closed} active={active} reduced={reducedRef.current} />
    </Ctx.Provider>
  );
}

/**
 * Overlay des portes de sas — 2 panneaux verticaux néon. `closed` = rejointes
 * au centre (écran masqué) ; sinon glissées hors écran. En reduced-motion, un
 * simple voile noir remplace les portes (mêmes états).
 */
function AirlockDoors({
  closed,
  active,
  reduced,
}: {
  closed: boolean;
  active: boolean;
  reduced: boolean;
}) {
  // Fondu simple (reduced-motion) : un seul voile dont l'opacité suit `closed`.
  if (reduced) {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#04060a",
          opacity: closed ? 1 : 0,
          transition: `opacity ${REDUCED_MS}ms ease`,
          pointerEvents: active ? "auto" : "none",
        }}
      />
    );
  }

  const doorBase: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "51%", // léger chevauchement au centre pour ne jamais laisser de fente
    background:
      "linear-gradient(180deg,#05070c 0%,#080b12 50%,#05070c 100%)",
    transition: `transform ${DOOR_CLOSE_MS}ms cubic-bezier(0.7,0,0.2,1)`,
    willChange: "transform",
    // Fin motif de grille façon porte de vaisseau.
    backgroundImage:
      "repeating-linear-gradient(0deg,transparent 0 38px,rgba(95,242,255,0.05) 38px 39px)," +
      "linear-gradient(180deg,#05070c 0%,#080b12 50%,#05070c 100%)",
  };

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: active ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      {/* Porte gauche : fermée = translateX(0), ouverte = -100%. */}
      <div
        style={{
          ...doorBase,
          left: 0,
          transform: closed ? "translate3d(0,0,0)" : "translate3d(-100%,0,0)",
          borderRight: "2px solid #5ff2ff",
          boxShadow: closed ? "6px 0 26px rgba(95,242,255,0.35)" : "none",
        }}
      />
      {/* Porte droite : fermée = translateX(0), ouverte = +100%. */}
      <div
        style={{
          ...doorBase,
          right: 0,
          transform: closed ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
          borderLeft: "2px solid #5ff2ff",
          boxShadow: closed ? "-6px 0 26px rgba(95,242,255,0.35)" : "none",
        }}
      />
      {/* Ligne de jonction centrale lumineuse (visible quand fermé). */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 2,
          transform: "translateX(-1px)",
          background: "#bdf6ff",
          boxShadow: "0 0 16px 3px rgba(95,242,255,0.7)",
          opacity: closed ? 1 : 0,
          transition: `opacity ${DOOR_CLOSE_MS * 0.6}ms ease`,
        }}
      />
    </div>
  );
}
