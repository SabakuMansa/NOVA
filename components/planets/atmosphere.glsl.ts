/**
 * Shaders de l'ATMOSPHÈRE — coquille sphérique légèrement plus grande que la
 * planète, rendue en `BackSide` avec blending additif : on ne voit que la face
 * arrière, ce qui produit un halo lumineux concentré sur le bord du globe (rim).
 *
 * Le halo est un terme de Fresnel : `pow(1 - dot(view, normal), p)` — maximal
 * là où la surface est rasante (le limbe), nul de face. On le renforce côté
 * jour pour que la lueur suive l'éclairage du soleil.
 *
 * Bonus « premium » : léger décalage de teinte selon la puissance du Fresnel
 * (rim iridescent), pour une frange plus riche qu'une couleur plate.
 */

export const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  uniform vec3  uColor;      // couleur du halo
  uniform vec3  uLightDir;   // direction vers le soleil
  uniform float uStrength;   // intensité globale
  uniform float uNightStrength; // lueur résiduelle côté nuit

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Fresnel : on regarde la face arrière (BackSide), donc la normale pointe
    // vers l'intérieur — on prend abs() pour un rim propre quel que soit le sens.
    float fres = 1.0 - abs(dot(viewDir, N));
    float rim = pow(fres, 3.0);

    // Renfort côté jour : le halo est plus vif là où le soleil frappe.
    float NdotL = dot(N, normalize(uLightDir));
    float day = smoothstep(-0.25, 0.5, NdotL);
    float glow = rim * (uNightStrength + (1.0 - uNightStrength) * day);

    // Rim iridescent : la teinte glisse légèrement vers le bord extrême.
    vec3 tint = mix(uColor, uColor.gbr, pow(fres, 6.0) * 0.5);

    vec3 col = tint * glow * uStrength;
    // Alpha additif : la couleur EST l'apport lumineux (blending = Additive).
    gl_FragColor = vec4(col, glow);
  }
`;
