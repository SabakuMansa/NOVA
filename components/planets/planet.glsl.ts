import { noiseGLSL } from "./noise.glsl";

/**
 * Shaders de la SURFACE de la planète (sphère).
 *
 * Un seul programme gère les deux types, sélectionnés par l'uniform `uType`
 * (0 = terrestre, 1 = gazeuse). La branche est *uniforme* (même valeur pour
 * tous les fragments d'une planète) donc sans divergence GPU.
 *
 * Le bruit est échantillonné en espace OBJET (`vObjPos`, constant par sommet) :
 * les continents/bandes sont donc « peints » sur la sphère et tournent avec elle,
 * sans re-calcul. L'éclairage se fait en espace MONDE.
 *
 * NB Three.js : `modelMatrix` n'est injecté que dans le VERTEX shader. Le
 * fragment reçoit donc `vWorldPos` (varying) pour la vue, et `uModelMat3`
 * (uniform, maj chaque frame) pour transformer la normale objet→monde après
 * perturbation par le relief.
 *
 * Points d'ajustement repérés par des commentaires : RELIEF, BUMP, BANDES GAZ,
 * ÉCLAIRAGE, GRAIN.
 */

export const vertexShader = /* glsl */ `
  varying vec3 vObjPos;       // position en espace objet (domaine du bruit)
  varying vec3 vWorldPos;     // position en espace monde (direction de vue)
  varying vec3 vWorldNormal;  // normale géométrique en espace monde

  void main() {
    vObjPos = position;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vObjPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  uniform float uTime;
  uniform vec3  uSeed;         // décalage de domaine du bruit (dérivé du seed)
  uniform float uType;         // 0 = terrestre, 1 = gazeuse
  uniform float uSeaLevel;     // seuil océan/terre (0..1)
  uniform vec3  uColorOcean;
  uniform vec3  uColorLow;
  uniform vec3  uColorHigh;
  uniform vec3  uLightDir;     // direction vers le soleil (monde, normalisée)
  uniform float uNightStrength; // luminosité résiduelle côté nuit (0..1)
  uniform int   uOctaves;      // qualité : nombre d'octaves FBM
  uniform float uFrequency;    // fréquence de base du relief / des bandes
  uniform float uWarp;         // intensité du domain-warp (dérivé du seed)
  uniform float uBands;        // fréquence des bandes (gaz)
  uniform float uGrain;        // intensité du micro-grain
  uniform mat3  uModelMat3;    // rotation objet->monde (maj chaque frame en JS)

  ${noiseGLSL}

  // Hauteur du relief en un point de la sphère (direction unitaire), 0..1.
  // RELIEF : domain-warp léger pour casser la régularité, puis FBM.
  float heightAt(vec3 dir) {
    vec3 p = dir * uFrequency + uSeed;
    // Warp : on déplace le point d'échantillonnage par un autre bruit basse fréq.
    vec3 w = vec3(
      snoise(p + 11.3),
      snoise(p + 47.9),
      snoise(p + 83.1)
    );
    p += w * uWarp;
    float n = fbm(p, uOctaves);      // ~[-1,1]
    return n * 0.5 + 0.5;            // -> [0,1]
  }

  // Couleur de surface d'une planète TERRESTRE + normale perturbée (relief).
  void terrestrialColor(vec3 nrm, out vec3 col, out vec3 outNormal, out float specMask) {
    float h = heightAt(nrm);

    // BUMP : gradient de hauteur via deux échantillons voisins le long d'une
    // base tangente OBJET arbitraire, pour un ombrage de relief sans déplacer la
    // géométrie (silhouette lisse, coût = 2 FBM). Réduit le côté « plastique ».
    vec3 up = abs(nrm.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tang = normalize(cross(nrm, up));
    vec3 bitang = cross(nrm, tang);
    float eps = 0.015;
    float hT = heightAt(normalize(nrm + tang * eps));
    float hB = heightAt(normalize(nrm + bitang * eps));
    // Pas de bump sous l'eau (surface lisse) ; fort sur les terres.
    float land = step(uSeaLevel, h);
    float bumpStrength = 1.4 * land;
    vec3 objN = normalize(nrm - (tang * (hT - h) + bitang * (hB - h)) * bumpStrength);
    // Rotation objet -> monde via la matrice fournie en uniform.
    outNormal = normalize(uModelMat3 * objN);

    if (h < uSeaLevel) {
      // Océan : plus sombre en profondeur, plus clair près des côtes.
      float depth = smoothstep(uSeaLevel, uSeaLevel - 0.18, h);
      vec3 shallow = uColorOcean * 1.25;
      vec3 deep = uColorOcean * 0.55;
      col = mix(shallow, deep, depth);
      specMask = 1.0; // l'eau brille (spéculaire côté jour)
    } else {
      // Terres : rampe basse -> haute, avec gain pour marquer les sommets.
      float t = (h - uSeaLevel) / max(1.0 - uSeaLevel, 0.001);
      float ramp = pow(t, 0.8);
      col = mix(uColorLow, uColorHigh, smoothstep(0.0, 1.0, ramp));
      // Liseré de côte légèrement plus clair juste au-dessus du niveau de la mer.
      col = mix(col, uColorLow * 1.15, smoothstep(0.06, 0.0, t));
      specMask = 0.0;
    }
  }

  // Couleur de surface d'une géante GAZEUSE : bandes horizontales animées.
  void gasColor(vec3 nrm, out vec3 col) {
    float lat = nrm.y; // -1..1 (pôles en ±1)

    // BANDES GAZ : turbulence FBM qui ondule les bandes + dérive horizontale
    // animée par uTime (les bandes « coulent » lentement façon Jupiter).
    vec3 p = nrm * vec3(0.6, uFrequency, 0.6) + uSeed;
    p.x += uTime * 0.03; // dérive
    float turb = fbm(p, uOctaves);
    float bands = sin(lat * uBands + turb * 2.2);   // -1..1
    float b = bands * 0.5 + 0.5;                     // 0..1

    // Rampe 3 couleurs à travers la bande.
    col = mix(uColorOcean, uColorLow, smoothstep(0.0, 0.55, b));
    col = mix(col, uColorHigh, smoothstep(0.55, 1.0, b));

    // Tempêtes : quelques taches ovales (FBM haute fréq, seuillé).
    float storm = fbm(nrm * (uFrequency * 2.4) + uSeed + 21.0, uOctaves);
    col = mix(col, uColorHigh * 1.1, smoothstep(0.55, 0.85, storm) * 0.35);
  }

  // Petit hash pour le grain (indépendant de toute texture).
  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  void main() {
    vec3 nrm = normalize(vObjPos); // direction sur la sphère unité (espace objet)

    vec3 col;
    vec3 worldN;
    float specMask = 0.0;

    if (uType < 0.5) {
      terrestrialColor(nrm, col, worldN, specMask);
    } else {
      gasColor(nrm, col);
      worldN = normalize(vWorldNormal); // gaz : normale géométrique
    }

    // ÉCLAIRAGE : lumière directionnelle « soleil » avec terminateur doux.
    float NdotL = dot(worldN, normalize(uLightDir));
    float day = smoothstep(-0.12, 0.28, NdotL); // transition jour/nuit adoucie
    float lighting = uNightStrength + (1.0 - uNightStrength) * day;
    vec3 lit = col * lighting;

    // Spéculaire océan (sheen) côté jour seulement.
    if (specMask > 0.5) {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 halfV = normalize(normalize(uLightDir) + viewDir);
      float spec = pow(max(dot(worldN, halfV), 0.0), 48.0) * day;
      lit += spec * 0.4;
    }

    // GRAIN : micro-variation pour éviter l'aspect lisse « plastique ».
    float g = hash13(nrm * 200.0);
    lit += (g - 0.5) * uGrain;

    gl_FragColor = vec4(lit, 1.0);
  }
`;
