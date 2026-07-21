"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  createPlanet,
  PLANET_PRESETS,
  type PlanetHandle,
  type PlanetParams,
} from "@/components/planets";

/**
 * PREVIEW JETABLE du module `components/planets` — hôte R3F fin, hors périmètre
 * produit (route /labo/planetes, noindex). Se supprime d'un bloc sans toucher au
 * module réutilisable. Sert uniquement à valider le rendu avant intégration.
 */

// Liste des planètes affichées. On les dispose en ligne horizontale, centrées.
// (Passe de validation : commencer par UNE planète terrestre, puis étendre.)
type PreviewEntry = { params: PlanetParams; label: string };

// Les 7 archétypes (passe de perf + galerie). Chaque planète a un seed distinct.
const RADIUS = 0.8;
const PLANETS: PreviewEntry[] = [
  { params: { ...PLANET_PRESETS.terra, seed: 7, radius: RADIUS }, label: "terra" },
  { params: { ...PLANET_PRESETS.volcanic, seed: 3, radius: RADIUS }, label: "volcanic" },
  { params: { ...PLANET_PRESETS.desert, seed: 12, radius: RADIUS }, label: "desert" },
  { params: { ...PLANET_PRESETS.ice, seed: 5, radius: RADIUS }, label: "ice" },
  { params: { ...PLANET_PRESETS.gasViolet, seed: 21, radius: RADIUS }, label: "gasViolet" },
  { params: { ...PLANET_PRESETS.gasAmber, seed: 9, radius: RADIUS }, label: "gasAmber" },
  { params: { ...PLANET_PRESETS.oceanWorld, seed: 33, radius: RADIUS }, label: "oceanWorld" },
];

const STAR_COUNT = 1400;

/** Fond étoilé statique (Points) — contexte spatial, coût négligeable. */
function Starfield() {
  const geo = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    // Distribution déterministe (pas de Math.random au build) via hash simple.
    for (let i = 0; i < STAR_COUNT; i++) {
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const b = Math.sin(i * 78.233) * 43758.5453;
      const c = Math.sin(i * 39.425) * 43758.5453;
      const u = (a - Math.floor(a)) * 2 - 1;
      const v = (b - Math.floor(b)) * 2 - 1;
      const w = (c - Math.floor(c)) * 2 - 1;
      const dir = new THREE.Vector3(u, v, w).normalize();
      const radius = 30 + ((c - Math.floor(c)) * 20);
      positions[i * 3] = dir.x * radius;
      positions[i * 3 + 1] = dir.y * radius;
      positions[i * 3 + 2] = dir.z * radius;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.12}
        color={0xffffff}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

/** Une planète : crée le handle, la monte, l'anime, la dispose au démontage. */
function Planet({
  params,
  position,
  reducedMotion,
}: {
  params: PlanetParams;
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const handle = useMemo<PlanetHandle>(() => createPlanet(params), [params]);

  useEffect(() => {
    handle.setLightDirection(new THREE.Vector3(0.45, 0.4, 0.8));
    return () => handle.dispose();
  }, [handle]);

  useFrame((state) => {
    // Reduced-motion : composition figée (temps constant) plutôt qu'animée.
    handle.update(reducedMotion ? 6.0 : state.clock.elapsedTime);
  });

  return <primitive object={handle.group} position={position} />;
}

/** Champ de planètes + rotation « orbite » du rig au drag souris. */
function PlanetField({ reducedMotion }: { reducedMotion: boolean }) {
  const rig = useRef<THREE.Group>(null!);
  const drag = useRef({ active: false, x: 0, y: 0, rotX: 0, rotY: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.rotY += (e.clientX - drag.current.x) * 0.005;
      drag.current.rotX += (e.clientY - drag.current.y) * 0.005;
      drag.current.rotX = Math.max(-0.8, Math.min(0.8, drag.current.rotX));
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const up = () => {
      drag.current.active = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame(() => {
    if (!rig.current) return;
    rig.current.rotation.y = drag.current.rotY;
    rig.current.rotation.x = drag.current.rotX;
  });

  // Grille centrée (4 par rangée) — tient à l'écran et se lit comme une galerie.
  const cols = 4;
  const gap = 2.3;
  const rows = Math.ceil(PLANETS.length / cols);

  return (
    <group ref={rig}>
      {PLANETS.map((p, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const itemsInRow = Math.min(cols, PLANETS.length - row * cols);
        const xOffset = ((itemsInRow - 1) * gap) / 2;
        const yOffset = ((rows - 1) * gap) / 2;
        return (
          <Planet
            key={p.label + i}
            params={p.params}
            position={[col * gap - xOffset, yOffset - row * gap, 0]}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </group>
  );
}

/** Compteur FPS maison (pas de drei/Stats) pour la passe de perf. */
function FpsMeter({ onSample }: { onSample: (fps: number) => void }) {
  const acc = useRef({ frames: 0, t: 0 });
  useFrame((_, delta) => {
    acc.current.frames += 1;
    acc.current.t += delta;
    if (acc.current.t >= 0.5) {
      onSample(Math.round(acc.current.frames / acc.current.t));
      acc.current.frames = 0;
      acc.current.t = 0;
    }
  });
  return null;
}

export default function PlanetsPreview() {
  const [fps, setFps] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#05060a" }}>
      <Canvas
        flat // NoToneMapping : les couleurs procédurales stylisées ne doivent
        // pas passer par l'ACES filmic (qui les assombrit/désature).
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 9.5], fov: 45 }}
      >
        <Starfield />
        <PlanetField reducedMotion={reducedMotion} />
        <FpsMeter onSample={setFps} />
      </Canvas>

      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          fontFamily: "monospace",
          fontSize: 12,
          color: "#9fe",
          background: "rgba(0,0,0,0.4)",
          padding: "6px 10px",
          borderRadius: 6,
          pointerEvents: "none",
        }}
      >
        {fps} FPS · {PLANETS.length} planète(s) · glisser pour tourner
        {reducedMotion ? " · reduced-motion" : ""}
      </div>
    </div>
  );
}
