"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (reduce) {
      setMode("static");
      return;
    }
    setMobile(window.matchMedia("(max-width: 768px)").matches);
    setMode(webglAvailable() ? "webgl" : "css");
  }, [reduce]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base statique toujours rendue → jamais d'écran vide ni de flash. */}
      <div className="absolute inset-0 signature-static-bg" />

      {mode === "css" && <div className="absolute inset-0 signature-css-bg" />}

      {mode === "webgl" && (
        <div className="absolute inset-0">
          <SignatureScene mobile={mobile} />
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
