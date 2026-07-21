"use client";

import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation"; // ← activer pour l'intégration réelle
import {
  createTronEngine,
  PLANET_PAGES,
  type TronEngine,
  type World,
} from "@/components/tron";

/**
 * PREVIEW JETABLE du module `components/tron` — navigation spatiale néon avec
 * assets. Fond + planètes (assets pré-rendus) + vaisseau (asset pivoté) + vol
 * Asteroids + caméra suiveuse dézoomée + frontière élastique + proximité +
 * atterrissage (fondu → log de la route). Hors périmètre produit (route
 * /labo/tron, noindex).
 */

// Mondes dérivés du mapping page→planète (config PLANET_PAGES) — les 4 pages,
// affichées ensemble pour qu'on voie plusieurs planètes en naviguant.
const worldFromPage = (p: (typeof PLANET_PAGES)[number]): World => ({
  x: p.x,
  y: p.y,
  radius: p.radius,
  name: p.name,
  slug: p.key,
  color: p.accent,
  approachRadius: p.approachRadius,
  asset: p.asset,
  route: p.route,
  rotationSpeed: p.rotationSpeed,
  centerOffset: p.centerOffset,
});

const WORLDS: World[] = PLANET_PAGES.map(worldFromPage);
const SHIP_ASSET = "/tron/ship.png";
const routeToName = new Map(PLANET_PAGES.map((p) => [p.route, { name: p.name, accent: p.accent }]));

export default function TronPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TronEngine | null>(null);
  // const router = useRouter(); // ← activer pour l'intégration réelle
  const [fps, setFps] = useState(0);
  // Planète à portée (nom + couleur d'accent) pour l'indicateur de proximité.
  const [near, setNear] = useState<{ name: string; accent: string } | null>(null);
  // Atterrissage en cours : route ciblée (déclenche le fondu).
  const [landing, setLanding] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const engine = createTronEngine(canvas, {
      worlds: WORLDS,
      shipAsset: SHIP_ASSET,
      quality: "high",
      reducedMotion,
      onFps: setFps,
      onProximity: (w) => setNear(w ? { name: w.name, accent: w.color } : null),
      onLand: (route) => {
        // Fondu au noir, puis — en preview — on logge la route. En intégration
        // réelle : router.push(route) une fois l'overlay opaque.
        setLanding(route);
        console.log("[tron] atterrissage →", route);
        // router.push(route);
        // Preview : on rouvre la scène après un instant pour continuer à tester.
        window.setTimeout(() => setLanding(null), 1600);
      },
    });
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const landInfo = landing ? routeToName.get(landing) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#04060a", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        onClick={() => engineRef.current?.triggerInteract()}
        style={{ display: "block", width: "100%", height: "100%", touchAction: "none", cursor: "crosshair" }}
      />

      {/* Indicateur de proximité (nom + prompt d'atterrissage), teinté accent. */}
      {near && !landing && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "ui-monospace, monospace",
            textAlign: "center",
            color: near.accent,
            background: "rgba(4,10,18,0.5)",
            backdropFilter: "blur(6px)",
            padding: "10px 18px",
            borderRadius: 10,
            border: `1px solid ${near.accent}55`,
            boxShadow: `0 0 22px ${near.accent}33`,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 15, letterSpacing: 2, fontWeight: 700 }}>
            {near.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
            Entrée ou clic pour atterrir
          </div>
        </div>
      )}

      {/* Bouton recentrer (discret, coin haut-droit). */}
      <button
        type="button"
        onClick={() => engineRef.current?.recenter()}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
          color: "#8be9ff",
          background: "rgba(4,10,18,0.5)",
          backdropFilter: "blur(6px)",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid rgba(95,242,255,0.25)",
          cursor: "pointer",
        }}
      >
        recentrer (R)
      </button>

      {/* Rappel discret des contrôles + FPS. */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          fontFamily: "ui-monospace, monospace",
          fontSize: 12,
          lineHeight: 1.7,
          color: "#8be9ff",
          background: "rgba(4,10,18,0.5)",
          backdropFilter: "blur(6px)",
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid rgba(95,242,255,0.25)",
          boxShadow: "0 0 18px rgba(95,242,255,0.12)",
          pointerEvents: "none",
        }}
      >
        <div style={{ opacity: 0.65, marginBottom: 4 }}>{fps} FPS</div>
        <div>
          <b>Z</b> pousser · <b>Q/D</b> tourner · <b>Shift</b> boost · <b>Entrée/clic</b> atterrir
        </div>
      </div>

      {/* Overlay de fondu à l'atterrissage (CSS, opacité 0→1). */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#04060a",
          opacity: landing ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: landing ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ui-monospace, monospace",
          color: landInfo?.accent ?? "#8be9ff",
        }}
      >
        {landing && (
          <>
            <div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 700 }}>
              {landInfo?.name?.toUpperCase() ?? "ATTERRISSAGE"}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
              → {landing}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
