"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Même architecture perf que le hero /v2 (vérifiée) : chargement différé,
// pause hors écran, fallback CSS sur mobile/tactile, statique en reduced-motion.
const V3Scene = dynamic(() => import("./V3Scene"), { ssr: false });

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

export default function V3Backdrop() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("static");
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) {
      setMode("static");
      return;
    }
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (coarse || !webglAvailable()) {
      setMode("css");
      return;
    }
    let idleId: number | undefined;
    let loadHandler: (() => void) | undefined;
    const arm = () => {
      const ric: typeof requestIdleCallback =
        "requestIdleCallback" in window
          ? window.requestIdleCallback.bind(window)
          : (((cb: IdleRequestCallback) =>
              window.setTimeout(() => cb({} as IdleDeadline), 200)) as never);
      idleId = ric(() => setMode("webgl")) as unknown as number;
    };
    if (document.readyState === "complete") arm();
    else {
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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || mode !== "webgl") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
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
      {/* Base statique (blobs figés) : toujours là, lisible sans JS. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 34% at 22% 30%, rgba(108,92,231,0.30), transparent 70%)," +
            "radial-gradient(34% 30% at 74% 22%, rgba(255,107,74,0.26), transparent 70%)," +
            "radial-gradient(36% 32% at 66% 72%, rgba(14,168,139,0.24), transparent 70%)," +
            "radial-gradient(30% 28% at 30% 78%, rgba(255,197,61,0.30), transparent 70%)," +
            "#FBF7EF",
        }}
      />

      {mode === "css" && <div className="absolute inset-0 v3-hero-css" />}

      {mode === "webgl" && (
        <div className="absolute inset-0">
          <V3Scene active={inView} />
        </div>
      )}
    </div>
  );
}
