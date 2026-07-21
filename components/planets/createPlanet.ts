import * as THREE from "three";
import type { ColorInput, PlanetHandle, PlanetParams } from "./types";
import {
  fragmentShader as surfaceFrag,
  vertexShader as surfaceVert,
} from "./planet.glsl";
import {
  fragmentShader as atmoFrag,
  vertexShader as atmoVert,
} from "./atmosphere.glsl";
import {
  fragmentShader as cloudFrag,
  vertexShader as cloudVert,
} from "./clouds.glsl";
import {
  fragmentShader as ringFrag,
  vertexShader as ringVert,
} from "./rings.glsl";

/**
 * `createPlanet(params)` — usine à planètes procédurales.
 *
 * Renvoie un `PlanetHandle` : `.group` (THREE.Group vanilla) se branche dans
 * n'importe quelle scène ; `.update(elapsed)` doit être appelé chaque frame ;
 * `.setLightDirection(dir)` oriente le soleil ; `.dispose()` libère le GPU.
 *
 * Tout le rendu est procédural (shaders + bruit), zéro texture image. Les
 * couleurs et le relief sont pilotés par `params` ; le `seed` décale le domaine
 * du bruit et suffit à distinguer deux planètes du même type.
 */

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

function toColor(input: ColorInput): THREE.Color {
  return input instanceof THREE.Color ? input.clone() : new THREE.Color(input);
}

/**
 * Dérive un décalage vec3 déterministe à partir du seed (hash type « sin »).
 * Deux seeds distincts donnent des offsets très différents → reliefs distincts.
 */
function seedToVec3(seed: number): THREE.Vector3 {
  const h = (n: number) => {
    const s = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return (s - Math.floor(s)) * 200.0 - 100.0; // ~[-100, 100]
  };
  return new THREE.Vector3(h(1), h(2), h(3));
}

/** Petit hash scalaire déterministe 0..1 à partir du seed. */
function seedScalar(seed: number, salt: number): number {
  const s = Math.sin(seed * 78.233 + salt * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

const QUALITY = {
  high: { segments: 128, octaves: 5 },
  low: { segments: 48, octaves: 3 },
} as const;

// ---------------------------------------------------------------------------
// Résolution des paramètres (défauts propres)
// ---------------------------------------------------------------------------

function resolveParams(p: PlanetParams) {
  const type = p.type ?? "terrestrial";
  return {
    seed: p.seed ?? 1,
    radius: p.radius ?? 1,
    rotationSpeed: p.rotationSpeed ?? 0.05,
    type,
    seaLevel: p.seaLevel ?? 0.5,
    frequency: p.frequency ?? (type === "gas" ? 3.0 : 2.2),
    quality: p.quality ?? "high",

    colorOcean: toColor(p.colorOcean ?? (type === "gas" ? 0x5a3b7a : 0x184a8c)),
    colorLow: toColor(p.colorLow ?? (type === "gas" ? 0x9d6fbf : 0x2f7d4f)),
    colorHigh: toColor(p.colorHigh ?? (type === "gas" ? 0xe6d2ff : 0xcbb487)),

    hasAtmosphere: p.hasAtmosphere ?? true,
    atmosphereColor: toColor(p.atmosphereColor ?? 0x6ab7ff),
    atmosphereStrength: p.atmosphereStrength ?? 1,

    hasRings: p.hasRings ?? false,
    ringColor: toColor(p.ringColor ?? 0xd8c9a8),
    ringInner: p.ringInner ?? 1.4,
    ringOuter: p.ringOuter ?? 2.2,
    ringTilt: p.ringTilt ?? 0.35,

    hasClouds: p.hasClouds ?? false,
    cloudColor: toColor(p.cloudColor ?? 0xffffff),
    cloudOpacity: p.cloudOpacity ?? 0.75,
  };
}

// ---------------------------------------------------------------------------
// Fabrique
// ---------------------------------------------------------------------------

export function createPlanet(params: PlanetParams = {}): PlanetHandle {
  const r = resolveParams(params);
  const { segments, octaves } = QUALITY[r.quality];

  const seedOffset = seedToVec3(r.seed);
  // Warp dérivé du seed : renforce la distinction entre planètes de même type.
  const warp = 0.1 + seedScalar(r.seed, 3) * 0.35;
  const nightStrength = 0.08;
  const grain = 0.045; // micro-grain un peu plus présent = rendu moins « lisse »

  // Direction du soleil partagée par tous les matériaux (référence unique).
  const lightDir = new THREE.Vector3(1, 0.4, 0.6).normalize();

  const group = new THREE.Group();
  // Pivot de surface : tourne sur son axe. Les nuages ont leur propre pivot
  // (rotation un peu plus rapide) ; atmosphère et anneaux ne tournent pas.
  const surfacePivot = new THREE.Group();
  const cloudPivot = new THREE.Group();
  group.add(surfacePivot, cloudPivot);

  // Tout ce qui doit recevoir uLightDir / uTime (mis à jour chaque frame).
  const materials: THREE.ShaderMaterial[] = [];

  // --- Surface ---
  const surfaceGeo = new THREE.SphereGeometry(r.radius, segments, segments);
  const surfaceMat = new THREE.ShaderMaterial({
    vertexShader: surfaceVert,
    fragmentShader: surfaceFrag,
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: seedOffset },
      uType: { value: r.type === "gas" ? 1 : 0 },
      uSeaLevel: { value: r.seaLevel },
      uColorOcean: { value: r.colorOcean },
      uColorLow: { value: r.colorLow },
      uColorHigh: { value: r.colorHigh },
      uLightDir: { value: lightDir },
      uNightStrength: { value: nightStrength },
      uOctaves: { value: octaves },
      uFrequency: { value: r.frequency },
      uWarp: { value: warp },
      uBands: { value: 14 + Math.floor(seedScalar(r.seed, 7) * 10) }, // 14..24 bandes
      uGrain: { value: grain },
      // Rotation objet->monde : `modelMatrix` n'existe pas dans le fragment
      // shader (Three ne l'injecte qu'au vertex) ; on la fournit à la main et
      // on la met à jour chaque frame dans `update()` (la surface tourne).
      uModelMat3: { value: new THREE.Matrix3() },
    },
  });
  materials.push(surfaceMat);
  const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
  surfacePivot.add(surfaceMesh);

  // --- Atmosphère (halo fresnel) ---
  let atmoGeo: THREE.SphereGeometry | null = null;
  if (r.hasAtmosphere) {
    atmoGeo = new THREE.SphereGeometry(r.radius * 1.08, segments, segments);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: atmoVert,
      fragmentShader: atmoFrag,
      transparent: true,
      side: THREE.BackSide, // on ne voit que la face arrière → halo au limbe
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uColor: { value: r.atmosphereColor },
        uLightDir: { value: lightDir },
        uStrength: { value: r.atmosphereStrength },
        uNightStrength: { value: 0.35 },
      },
    });
    materials.push(atmoMat);
    group.add(new THREE.Mesh(atmoGeo, atmoMat));
  }

  // --- Nuages (seconde coquille) ---
  let cloudGeo: THREE.SphereGeometry | null = null;
  if (r.hasClouds) {
    cloudGeo = new THREE.SphereGeometry(r.radius * 1.02, segments, segments);
    const cloudMat = new THREE.ShaderMaterial({
      vertexShader: cloudVert,
      fragmentShader: cloudFrag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSeed: { value: seedOffset },
        uColor: { value: r.cloudColor },
        uLightDir: { value: lightDir },
        uOpacity: { value: r.cloudOpacity },
        uOctaves: { value: octaves },
        uNightStrength: { value: nightStrength },
      },
    });
    materials.push(cloudMat);
    cloudPivot.add(new THREE.Mesh(cloudGeo, cloudMat));
  }

  // --- Anneaux ---
  let ringGeo: THREE.RingGeometry | null = null;
  if (r.hasRings) {
    const inner = r.radius * r.ringInner;
    const outer = r.radius * r.ringOuter;
    ringGeo = new THREE.RingGeometry(inner, outer, 128, 1);
    const ringMat = new THREE.ShaderMaterial({
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uColor: { value: r.ringColor },
        uInner: { value: inner },
        uOuter: { value: outer },
        uLightDir: { value: lightDir },
        uSeed: { value: seedScalar(r.seed, 5) * 10 },
        uOctaves: { value: octaves },
      },
    });
    materials.push(ringMat);
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2 + r.ringTilt; // plan XZ + inclinaison
    group.add(ringMesh);
  }

  // -------------------------------------------------------------------------
  // Handle
  // -------------------------------------------------------------------------

  const geometries: THREE.BufferGeometry[] = [surfaceGeo];
  if (atmoGeo) geometries.push(atmoGeo);
  if (cloudGeo) geometries.push(cloudGeo);
  if (ringGeo) geometries.push(ringGeo);

  return {
    group,
    params: r,

    update(elapsed: number) {
      for (const m of materials) {
        if (m.uniforms.uTime) m.uniforms.uTime.value = elapsed;
      }
      // Rotation propre ; les nuages dérivent un peu plus vite que la surface.
      surfacePivot.rotation.y = elapsed * r.rotationSpeed;
      cloudPivot.rotation.y = elapsed * r.rotationSpeed * 1.15;
      // Rafraîchit la rotation objet->monde pour l'éclairage de la surface
      // (la surface tourne, donc sa matrice monde change chaque frame).
      surfaceMesh.updateWorldMatrix(true, false);
      (surfaceMat.uniforms.uModelMat3.value as THREE.Matrix3).setFromMatrix4(
        surfaceMesh.matrixWorld,
      );
    },

    setLightDirection(dir: THREE.Vector3) {
      lightDir.copy(dir).normalize();
    },

    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
    },
  };
}
