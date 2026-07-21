/**
 * GLSL partagé — bruit procédural 3D.
 *
 * Bloc de chaîne injecté dans les fragment shaders de la surface, des nuages et
 * des anneaux. Contient :
 *  - `snoise(vec3)` : simplex noise 3D d'Ashima/Stefan Gustavson (référence
 *    éprouvée, ~1 permutation par appel, bon rapport qualité/perf).
 *  - `fbm(vec3, int octaves)` : Fractal Brownian Motion, somme d'octaves de
 *    simplex à fréquence doublée / amplitude halvée. Le nombre d'octaves est
 *    passé en paramètre (uniform `uOctaves`) pour le mode qualité réductible.
 *
 * Point d'ajustement : `GAIN`/`LACUNARITY` ci-dessous contrôlent la rugosité du
 * relief ; la boucle FBM est bornée par une constante de compilation
 * (`FBM_MAX_OCTAVES`) car GLSL ES exige des bornes de boucle constantes — on
 * sort tôt via `if (i >= octaves) break;`.
 */
export const noiseGLSL = /* glsl */ `
  // --- Simplex 3D (Ashima Arts / Stefan Gustavson, domaine public) ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // Première coin + ordonnancement.
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations (hash des 4 coins du simplex).
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients : 7x7 points sur un octaèdre, réarrangés en 49 (7x7).
    float n_ = 0.142857142857; // 1/7
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalisation des gradients.
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    // Contribution de chaque coin, atténuée par la distance.
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  // Borne de compilation pour la boucle FBM (GLSL ES exige une borne constante).
  #define FBM_MAX_OCTAVES 6

  // FBM : somme d'octaves. Renvoie ~[-1, 1]. octaves (uniform) est borné par
  // FBM_MAX_OCTAVES via un break — permet de baisser la charge sur mobile.
  float fbm(vec3 p, int octaves) {
    const float LACUNARITY = 2.0; // facteur de fréquence entre octaves
    const float GAIN = 0.5;       // facteur d'amplitude entre octaves
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    float norm = 0.0; // pour renormaliser selon le nombre d'octaves réel
    for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
      if (i >= octaves) break;
      sum += amp * snoise(p * freq);
      norm += amp;
      freq *= LACUNARITY;
      amp *= GAIN;
    }
    return sum / max(norm, 0.0001);
  }
`;
