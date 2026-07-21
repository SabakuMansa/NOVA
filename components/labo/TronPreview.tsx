"use client";

import { useEffect, useRef, useState } from "react";
import {
  createTronEngine,
  PLANET_PAGES,
  type TronEngine,
  type World,
} from "@/components/tron";
import type { TouchInput } from "@/components/tron/input/touchInput";
import { useAirlock } from "@/components/transition/AirlockProvider";
import TronTouchControls from "./TronTouchControls";

/**
 * PREVIEW JETABLE du module `components/tron` — navigation spatiale néon avec
 * assets. Fond + planètes (assets pré-rendus) + vaisseau (asset pivoté) + vol
 * Asteroids + caméra suiveuse dézoomée + frontière élastique + proximité +
 * atterrissage → **vraie navigation** via le sas (AirlockProvider). Hors
 * périmètre produit (route /labo/tron, noindex).
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

// ── Marqueur de session « retour à l'espace » ───────────────────────────────
// Posé au moment de l'atterrissage (juste avant de quitter /labo/tron) :
//  - VISITED_KEY signale qu'on est passé par l'univers → seul ce qui autorise
//    ReturnToSpaceButton à s'afficher sur la page de destination (un visiteur
//    arrivé directement, via Google ou un lien externe, ne voit jamais ce
//    bouton).
//  - LAST_PLANET_KEY mémorise la planète quittée pour y faire réapparaître le
//    vaisseau au retour (continuité de l'exploration, cf. computeSpawn ci-dessous).
const VISITED_KEY = "tron:visited";
const LAST_PLANET_KEY = "tron:lastPlanet";

/**
 * Calcule un point de réapparition juste hors de l'`approachRadius` de la
 * dernière planète quittée (pas dessus, pour ne pas re-déclencher l'atterrissage
 * immédiatement), orienté vers l'espace ouvert. Absent de sessionStorage (ou
 * planète inconnue) → undefined = spawn par défaut (0,0) de l'engine.
 */
function computeSpawn(): { x: number; y: number; angle: number } | undefined {
  const key = window.sessionStorage.getItem(LAST_PLANET_KEY);
  if (!key) return undefined;
  const planet = PLANET_PAGES.find((p) => p.key === key);
  if (!planet) return undefined;
  const dist = Math.hypot(planet.x, planet.y);
  // Direction radiale (centre du monde → planète) ; repli vers le haut si la
  // planète est quasi au centre.
  const dirX = dist > 1 ? planet.x / dist : 0;
  const dirY = dist > 1 ? planet.y / dist : -1;
  const spawnDist = planet.approachRadius * 1.15;
  return {
    x: planet.x + dirX * spawnDist,
    y: planet.y + dirY * spawnDist,
    angle: Math.atan2(dirY, dirX), // nez face à l'espace ouvert
  };
}

export default function TronPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TronEngine | null>(null);
  const [fps, setFps] = useState(0);
  // Planète à portée (nom + couleur d'accent) pour l'indicateur de proximité.
  const [near, setNear] = useState<{ name: string; accent: string } | null>(null);
  // Pointeur tactile détecté (une seule fois au montage) → bascule le HUD
  // (joystick/boost/bouton atterrir tactile) sans jamais s'afficher sur
  // desktop. `touchIO` = référence stable exposée par l'engine une fois créé.
  const [isTouch, setIsTouch] = useState(false);
  const [touchIO, setTouchIO] = useState<TouchInput | null>(null);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Le sas déclenche la VRAIE navigation (portes → router.push → réouverture).
  // L'engine est impératif : on capture `enter` dans un ref (maj à chaque render)
  // pour que le callback `onLand` (figé à la création de l'engine) y accède.
  const airlock = useAirlock();
  const enterRef = useRef(airlock.enter);
  enterRef.current = airlock.enter;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const engine = createTronEngine(canvas, {
      worlds: WORLDS,
      shipAsset: SHIP_ASSET,
      quality: "high",
      reducedMotion,
      spawn: computeSpawn(),
      onFps: setFps,
      onProximity: (w) => setNear(w ? { name: w.name, accent: w.color } : null),
      onLand: (world) => {
        // Route absente → pas de navigation morte (fallback).
        if (!world.route) {
          console.warn("[tron] atterrissage sans route — navigation ignorée.");
          return;
        }
        // Marqueur de session : pose AVANT de quitter l'espace, lu par
        // ReturnToSpaceButton (affichage) et par computeSpawn (réapparition).
        try {
          window.sessionStorage.setItem(VISITED_KEY, "1");
          window.sessionStorage.setItem(LAST_PLANET_KEY, world.slug);
        } catch {
          // sessionStorage indisponible (navigation privée stricte) : dégrade
          // silencieusement — pas de bouton retour, mais pas de crash.
        }
        enterRef.current(world.route); // sas : portes → router.push(route) → réouverture
      },
    });
    engineRef.current = engine;
    setTouchIO(engine.touch);
    engine.start();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#04060a", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        onClick={() => engineRef.current?.triggerInteract()}
        style={{ display: "block", width: "100%", height: "100%", touchAction: "none", cursor: "crosshair" }}
      />

      {/* Indicateur de proximité (nom + prompt d'atterrissage), teinté accent. */}
      {near && (
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
            {isTouch ? "À portée — appuyer pour atterrir" : "Entrée ou clic pour atterrir"}
          </div>
        </div>
      )}

      {/* Bouton « atterrir » tactile — gros, bas-centre, seulement à portée. */}
      {isTouch && near && (
        <button
          type="button"
          onClick={() => engineRef.current?.triggerInteract()}
          style={{
            position: "fixed",
            bottom: 34,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 400,
            fontFamily: "ui-monospace, monospace",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#04060a",
            background: near.accent,
            padding: "12px 26px",
            borderRadius: 999,
            border: "none",
            boxShadow: `0 0 22px ${near.accent}88`,
            touchAction: "none",
          }}
        >
          ATTERRIR
        </button>
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

      {/* Rappel discret des contrôles + FPS — desktop uniquement (le tactile a
          son propre HUD : joystick/boost/atterrir, auto-explicite). */}
      {!isTouch && (
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
      )}

      {/* FPS seul, coin haut-gauche — tactile (bas-gauche est pris par le
          joystick). */}
      {isTouch && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            color: "#8be9ff",
            opacity: 0.65,
            pointerEvents: "none",
          }}
        >
          {fps} FPS
        </div>
      )}

      {/* HUD tactile — joystick + boost (gated pointer:coarse, cf. isTouch). */}
      {isTouch && touchIO && <TronTouchControls touch={touchIO} />}

      {/* L'atterrissage est désormais géré par le sas (AirlockProvider) :
          portes → router.push(route) → réouverture sur la vraie page. */}
    </div>
  );
}
