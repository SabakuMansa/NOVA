"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./embers.glsl";

function EmbersPlane({ mobile }: { mobile: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const { size, viewport } = useThree();
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
      uMobile: { value: mobile ? 1 : 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Suivi du pointeur via la fenêtre : le canvas est sous une couche
  // pointer-events:none, donc r3f ne reçoit pas les events — on écoute window.
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
    (u.uMouse.value as THREE.Vector2).lerp(target.current, mobile ? 0.1 : 0.05);
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

export default function SignatureScene({ mobile }: { mobile: boolean }) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, mobile ? 1.25 : 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      frameloop="always"
    >
      <EmbersPlane mobile={mobile} />
    </Canvas>
  );
}
