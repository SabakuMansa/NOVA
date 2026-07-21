import { noiseGLSL } from "./noise.glsl";

/**
 * Shaders des NUAGES — seconde coquille sphérique (rayon ~1.02× la planète),
 * transparente, avec son propre bruit FBM animé. Éclairée par la même lumière
 * directionnelle (nuages visibles côté jour, estompés côté nuit).
 *
 * La coquille tourne un peu plus vite que la surface (géré côté JS via un pivot
 * dédié) ; le bruit dérive aussi lentement dans le shader pour un mouvement
 * organique. Sample en espace objet → les nuages « collent » à leur coquille.
 */

export const vertexShader = /* glsl */ `
  varying vec3 vObjPos;
  varying vec3 vWorldNormal;

  void main() {
    vObjPos = position;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vObjPos;
  varying vec3 vWorldNormal;

  uniform float uTime;
  uniform vec3  uSeed;
  uniform vec3  uColor;
  uniform vec3  uLightDir;
  uniform float uOpacity;
  uniform int   uOctaves;
  uniform float uNightStrength;

  ${noiseGLSL}

  void main() {
    vec3 dir = normalize(vObjPos);

    // Couverture nuageuse : FBM animé (dérive lente dans le domaine).
    vec3 p = dir * 2.4 + uSeed + vec3(uTime * 0.012, 0.0, uTime * 0.008);
    float cover = fbm(p, uOctaves) * 0.5 + 0.5;

    // Seuillage doux : bandes/amas plutôt qu'une brume uniforme.
    float alpha = smoothstep(0.52, 0.72, cover) * uOpacity;

    // Éclairage : les nuages s'assombrissent côté nuit (mais pas totalement).
    float NdotL = dot(normalize(vWorldNormal), normalize(uLightDir));
    float day = smoothstep(-0.1, 0.35, NdotL);
    float lighting = uNightStrength + (1.0 - uNightStrength) * day;

    gl_FragColor = vec4(uColor * lighting, alpha);
  }
`;
