"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./embers.glsl";

function EmbersPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const { size, viewport } = useThree();
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Suivi du pointeur via la fenêtre : le canvas est sous une couche
  // pointer-events:none, donc r3f ne reçoit pas les events — on écoute window.
  // La position est stockée dans une ref (pas de state React → pas de
  // re-render), et consommée une seule fois par frame dans useFrame.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    (u.uMouse.value as THREE.Vector2).lerp(target.current, 0.05);
    (u.uRes.value as THREE.Vector2).set(state.size.width, state.size.height);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

/**
 * Scène WebGL du fond « braises ». Desktop uniquement (le fallback CSS couvre
 * mobile/tactile). `active` pilote la boucle de rendu : quand le hero sort de
 * l'écran, `frameloop="never"` stoppe complètement le shader (0 coût GPU) au
 * lieu de le laisser tourner à 60fps hors champ.
 */
export default function SignatureScene({ active }: { active: boolean }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      frameloop={active ? "always" : "never"}
    >
      <EmbersPlane />
    </Canvas>
  );
}
