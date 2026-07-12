// Shaders de « l'ardoise vivante » — braises dérivantes dans la palette NOVA,
// réactives au pointeur. Écrit à la main (pas de dépendance shader externe).

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
  uniform float uMobile;

  // Palette NOVA (linéaire approx).
  const vec3 CAFE     = vec3(0.180, 0.145, 0.129);
  const vec3 MOUTARDE = vec3(0.784, 0.608, 0.235);
  const vec3 LIE      = vec3(0.478, 0.180, 0.180);
  const vec3 SAUGE    = vec3(0.431, 0.482, 0.345);

  // --- Simplex noise 2D (Ashima / Stefan Gustavson) ---
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
    for (int i = 0; i < 4; i++) {
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

    float t = uTime * 0.05;

    // Chaleur qui « ondule » autour du pointeur (subtil, sans rebond).
    float md = distance(p, m);
    float warp = smoothstep(0.6, 0.0, md) * 0.14;
    vec2 dir = normalize(p - m + 1e-4);
    vec2 pw = p + dir * warp * sin(uTime * 0.5);

    // Braises dérivantes.
    float n  = fbm(pw * 1.6 + vec2(t, -t * 0.6));
    float n2 = fbm(pw * 3.0 - vec2(t * 0.4, t));
    float embers = smoothstep(0.1, 0.7, n * 0.6 + n2 * 0.4);

    vec3 col = CAFE;
    col = mix(col, LIE, embers * 0.5);
    col = mix(col, MOUTARDE, smoothstep(0.55, 0.95, n) * 0.6);
    col = mix(col, SAUGE, smoothstep(0.5, 0.0, n2) * 0.12);

    // Lueur moutarde qui suit le curseur.
    float glow = smoothstep(0.5, 0.0, md);
    col += MOUTARDE * glow * 0.22;

    // Vignette pour concentrer le regard au centre.
    float vig = smoothstep(1.15, 0.35, distance(uv, vec2(0.5)));
    col *= mix(0.68, 1.0, vig);

    // Grain fin.
    float grain = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.03;

    gl_FragColor = vec4(col, 1.0);
  }
`;
