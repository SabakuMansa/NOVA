// Shader du hero v3 — « aurora » : blobs colorés (violet/corail/teal/jaune)
// qui dérivent sur fond lait, avec une lueur qui suit le curseur.
// Même architecture que le shader braises (vérifiée en perf) : 3 octaves fbm.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse; // 0..1
  uniform vec2  uRes;

  // Palette v3 (approx linéaire).
  const vec3 LAIT   = vec3(0.984, 0.969, 0.937);
  const vec3 VIOLET = vec3(0.424, 0.361, 0.906);
  const vec3 CORAIL = vec3(1.000, 0.420, 0.290);
  const vec3 TEAL   = vec3(0.055, 0.659, 0.545);
  const vec3 JAUNE  = vec3(1.000, 0.773, 0.239);

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);

    float t = uTime * 0.045;

    // Légère attraction du champ vers le curseur.
    float md = distance(p, m);
    vec2 pull = (m - p) * smoothstep(0.7, 0.0, md) * 0.18;
    vec2 pw = p + pull;

    float n1 = fbm(pw * 1.3 + vec2(t, -t * 0.7));
    float n2 = fbm(pw * 1.9 - vec2(t * 0.5, t * 0.9) + 3.7);
    float n3 = fbm(pw * 1.1 + vec2(-t * 0.8, t * 0.4) - 2.1);

    vec3 col = LAIT;
    col = mix(col, VIOLET, smoothstep(0.15, 0.75, n1) * 0.5);
    col = mix(col, CORAIL, smoothstep(0.20, 0.80, n2) * 0.45);
    col = mix(col, TEAL,   smoothstep(0.25, 0.85, n3) * 0.40);
    col = mix(col, JAUNE,  smoothstep(0.55, 0.95, n1 * n2 + 0.3) * 0.35);

    // Lueur claire qui suit le curseur (éclaircit, ne salit pas le texte).
    col = mix(col, LAIT, smoothstep(0.45, 0.0, md) * 0.5);

    // Vignette très douce vers le lait pour asseoir le texte.
    float vig = smoothstep(0.2, 0.95, distance(uv, vec2(0.5, 0.55)));
    col = mix(col, LAIT, vig * 0.55);

    // Grain léger.
    float grain = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.02;

    gl_FragColor = vec4(col, 1.0);
  }
`;
