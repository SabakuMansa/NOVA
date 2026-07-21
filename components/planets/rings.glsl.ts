import { noiseGLSL } from "./noise.glsl";

/**
 * Shaders des ANNEAUX — plaqués sur une `RingGeometry` (plan XY, tiltée côté JS).
 *
 * On reconstruit une coordonnée RADIALE dans le fragment à partir de la position
 * locale (`length(pos.xy)`), normalisée entre rayon interne et externe : elle
 * pilote des bandes concentriques (alternance opacité) + un léger bruit pour la
 * granularité, sans aucune texture. Semi-transparent, DoubleSide.
 */

export const vertexShader = /* glsl */ `
  varying vec3 vLocalPos;   // position dans le plan de l'anneau
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vLocalPos = position;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vLocalPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  uniform vec3  uColor;
  uniform float uInner;     // rayon interne (unités locales)
  uniform float uOuter;     // rayon externe (unités locales)
  uniform vec3  uLightDir;
  uniform float uSeed;      // scalaire de variation
  uniform int   uOctaves;

  ${noiseGLSL}

  void main() {
    // Coordonnée radiale 0 (interne) -> 1 (externe).
    float r = length(vLocalPos.xy);
    float t = clamp((r - uInner) / max(uOuter - uInner, 0.001), 0.0, 1.0);

    // Bandes concentriques : produit de sinus de fréquences différentes +
    // bruit 1D (via snoise sur un axe) pour casser la régularité.
    float bands = 0.5 + 0.5 * sin(t * 90.0);
    bands *= 0.6 + 0.4 * sin(t * 33.0 + uSeed);
    float grain = fbm(vec3(t * 40.0 + uSeed, 0.0, 0.0), uOctaves) * 0.5 + 0.5;
    float density = bands * grain;

    // Bords adoucis (interne + externe) pour éviter les arêtes dures.
    float edge = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.94, t);
    float alpha = density * edge;

    // Éclairage doux : l'anneau capte la lumière du soleil (les deux faces).
    float NdotL = abs(dot(normalize(vWorldNormal), normalize(uLightDir)));
    float lighting = 0.5 + 0.5 * NdotL;

    gl_FragColor = vec4(uColor * lighting, alpha);
  }
`;
