"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// WebGL chargé uniquement côté client, en différé (le texte reste prioritaire).
const SignatureScene = dynamic(() => import("./SignatureScene"), {
  ssr: false,
});

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

type Mode = "static" | "css" | "webgl";

export default function SignatureBackdrop() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("static");
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) {
      setMode("static");
      return;
    }

    // Mobile / tactile : l'effet curseur n'a pas de sens et le shader plein
    // écran y coûte cher → fallback CSS animé (même palette), jamais de WebGL.
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (coarse || !webglAvailable()) {
      setMode("css");
      return;
    }

    // Desktop : on diffère le chargement de three.js APRÈS le premier rendu
    // (load + idle) pour ne pas concurrencer le LCP/TBT — la base statique et
    // le fallback CSS couvrent l'attente sans flash.
    let idleId: number | undefined;
    let loadHandler: (() => void) | undefined;
    const arm = () => {
      const ric: typeof requestIdleCallback =
        "requestIdleCallback" in window
          ? window.requestIdleCallback.bind(window)
          : ((cb: IdleRequestCallback) =>
              window.setTimeout(() => cb({} as IdleDeadline), 200)) as never;
      idleId = ric(() => setMode("webgl")) as unknown as number;
    };
    if (document.readyState === "complete") {
      arm();
    } else {
      loadHandler = arm;
      window.addEventListener("load", loadHandler, { once: true });
    }
    return () => {
      if (loadHandler) window.removeEventListener("load", loadHandler);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [reduce]);

  // Pause du rendu quand le hero sort de l'écran : le shader ne tourne plus
  // à 60fps pendant qu'on lit le reste de la page.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || mode !== "webgl") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base statique toujours rendue → jamais d'écran vide ni de flash. */}
      <div className="absolute inset-0 signature-static-bg" />

      {mode === "css" && <div className="absolute inset-0 signature-css-bg" />}

      {mode === "webgl" && (
        <div className="absolute inset-0">
          <SignatureScene active={inView} />
        </div>
      )}

      {/* Voile pour garantir le contraste du texte par-dessus. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(46,37,33,0) 35%, rgba(46,37,33,0.55) 100%)",
        }}
      />
    </div>
  );
}
