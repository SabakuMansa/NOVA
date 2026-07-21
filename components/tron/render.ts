import { NEON, WORLD, type QualitySettings } from "./config";
import { type World } from "./types";

/**
 * Rendu néon — canvas 2D natif. Le glow vient de `ctx.shadowBlur` + `shadowColor`
 * appliqués aux tracés lumineux (réservé aux traits, coûteux si sur-utilisé).
 *
 * Toutes les fonctions travaillent en pixels CSS (le DPR est géré en amont par
 * `ctx.setTransform` dans l'engine). `View` porte la caméra 2D : conversion
 * monde → écran = `(monde - cam) * zoom + centre écran`.
 */
export interface View {
  w: number;
  h: number;
  camX: number;
  camY: number;
  zoom: number;
  time: number;
  q: QualitySettings;
  /** reduced-motion actif → rotations/pulsations ralenties. */
  reduced: boolean;
}

const sx = (v: View, wx: number) => (wx - v.camX) * v.zoom + v.w / 2;
const sy = (v: View, wy: number) => (wy - v.camY) * v.zoom + v.h / 2;

/** Conversion monde → écran (exposée pour l'engine). */
export function toScreen(v: View, wx: number, wy: number): [number, number] {
  return [sx(v, wx), sy(v, wy)];
}

/** Hash déterministe [0,1) pour le champ d'étoiles infini par cellules. */
function hash(ix: number, iy: number): number {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

/** Fond : couleur de base + grille discrète + champ d'étoiles parallaxe. */
export function drawBackground(ctx: CanvasRenderingContext2D, v: View): void {
  ctx.fillStyle = NEON.BG;
  ctx.fillRect(0, 0, v.w, v.h);

  // Grille de perspective très discrète (façon Tron), alignée sur le monde.
  if (v.q.grid) {
    const GRID = 260;
    ctx.strokeStyle = NEON.GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const startX = Math.floor((v.camX - v.w / 2 / v.zoom) / GRID) * GRID;
    const endX = v.camX + v.w / 2 / v.zoom;
    for (let gx = startX; gx <= endX; gx += GRID) {
      ctx.moveTo(sx(v, gx), 0);
      ctx.lineTo(sx(v, gx), v.h);
    }
    const startY = Math.floor((v.camY - v.h / 2 / v.zoom) / GRID) * GRID;
    const endY = v.camY + v.h / 2 / v.zoom;
    for (let gy = startY; gy <= endY; gy += GRID) {
      ctx.moveTo(0, sy(v, gy));
      ctx.lineTo(v.w, sy(v, gy));
    }
    ctx.stroke();
  }

  // Étoiles : cellules hachées dans un plan parallaxe (défilent plus lentement
  // que le monde → sensation de profondeur). Densité pilotée par la qualité.
  const parallax = 0.55;
  const ox = v.camX * parallax;
  const oy = v.camY * parallax;
  const CELL = v.q.starCount >= 200 ? 70 : 110; // plus petit = plus d'étoiles
  const cols = Math.ceil(v.w / CELL) + 2;
  const rows = Math.ceil(v.h / CELL) + 2;
  const baseIx = Math.floor((ox - v.w / 2) / CELL);
  const baseIy = Math.floor((oy - v.h / 2) / CELL);
  ctx.fillStyle = NEON.STAR;
  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const ix = baseIx + cx;
      const iy = baseIy + cy;
      const r = hash(ix, iy);
      if (r < 0.45) continue; // ~55 % des cellules ont une étoile
      const px = (ix + hash(ix + 11, iy)) * CELL - (ox - v.w / 2);
      const py = (iy + hash(ix, iy + 7)) * CELL - (oy - v.h / 2);
      const twinkle = 0.5 + 0.5 * Math.sin(v.time * 2 + r * 30);
      const size = r > 0.9 ? 1.6 : 1;
      ctx.globalAlpha = 0.35 + twinkle * 0.5;
      ctx.fillRect(px, py, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

/** Hash déterministe d'une chaîne → [0,1) (variété visuelle stable par planète). */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/**
 * Une planète = point d'intérêt néon. Au-delà de l'anneau principal, chaque
 * planète porte des DÉTAILS distinctifs dérivés de son slug (nombre de repères,
 * lunes en orbite, motif central), pour qu'on les différencie d'un coup d'œil
 * sans remplissage lourd. `pulse` (0..1) intensifie le glow à portée.
 */
export function drawPlanet(
  ctx: CanvasRenderingContext2D,
  v: View,
  w: World,
  pulse: number,
): void {
  const cx = sx(v, w.x);
  const cy = sy(v, w.y);
  const r = w.radius * v.zoom;

  // Cull hors écran (marge large pour lunes/orbites).
  if (cx < -r - 120 || cx > v.w + r + 120 || cy < -r - 120 || cy > v.h + r + 120) return;

  // Caractéristiques stables dérivées du slug.
  const seed = hashStr(w.slug);
  const style = Math.floor(seed * 3); // 0,1,2 → motif central
  const ticks = 8 + Math.floor(hashStr(w.slug + "t") * 12); // 8..20 repères
  const moons = 1 + Math.floor(hashStr(w.slug + "m") * 2); // 1..2 lunes
  const spinDir = hashStr(w.slug + "s") > 0.5 ? 1 : -1;

  ctx.save();
  const glow = (13 + pulse * 20) * v.q.glow;
  ctx.shadowColor = w.color;
  ctx.strokeStyle = w.color;
  ctx.fillStyle = w.color;

  // Corps : remplissage radial très léger (présence sans lourdeur).
  const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
  grad.addColorStop(0, hexA(w.color, 0.16 + pulse * 0.1));
  grad.addColorStop(1, hexA(w.color, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = w.color;

  // Anneau principal.
  ctx.shadowBlur = glow;
  ctx.lineWidth = 2 + pulse * 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Anneau intérieur concentrique (fin).
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Repères sur l'anneau (petits traits radiaux vers l'extérieur).
  ctx.shadowBlur = 4 * v.q.glow;
  ctx.lineWidth = 1;
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2 + seed * 6.28;
    const c = Math.cos(a);
    const s = Math.sin(a);
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(cx + c * r, cy + s * r);
    ctx.lineTo(cx + c * (r + 5), cy + s * (r + 5));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Motif central distinctif selon le style.
  ctx.shadowBlur = glow * 0.6;
  if (style === 0) {
    // Point-noyau lumineux.
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(2, r * 0.1), 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 1) {
    // Croix / réticule.
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.5, cy);
    ctx.lineTo(cx + r * 0.5, cy);
    ctx.moveTo(cx, cy - r * 0.5);
    ctx.lineTo(cx, cy + r * 0.5);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    // Arc de balayage tournant.
    const a0 = v.time * spinDir * 1.2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.42, a0, a0 + Math.PI * 0.7);
    ctx.stroke();
  }

  // Lunes en orbite (petits points lumineux + trajectoire faible).
  for (let m = 0; m < moons; m++) {
    const orbit = r * (1.35 + m * 0.28);
    const a = v.time * spinDir * (0.6 - m * 0.15) + seed * 6.28 + m * 2.1;
    const mx = cx + Math.cos(a) * orbit;
    const my = cy + Math.sin(a) * orbit;
    // trajectoire
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(cx, cy, orbit, 0, Math.PI * 2);
    ctx.stroke();
    // lune
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 8 * v.q.glow;
    ctx.beginPath();
    ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Anneau d'approche pulsant (pointillé) quand à portée.
  if (pulse > 0.01) {
    const ar = w.approachRadius * v.zoom;
    ctx.globalAlpha = 0.25 + 0.25 * Math.sin(v.time * 4);
    ctx.setLineDash([6, 10]);
    ctx.lineWidth = 1;
    ctx.shadowBlur = 6 * v.q.glow;
    ctx.beginPath();
    ctx.arc(cx, cy, ar, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  // Nom du projet, typo fine lumineuse, sous l'anneau.
  ctx.shadowBlur = 8 * v.q.glow;
  ctx.font = "13px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(w.name.toUpperCase(), cx, cy + r + 22);
  ctx.restore();
}

/** Convertit un hex (#rrggbb) en rgba() avec alpha donné (pour les dégradés). */
function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/**
 * Dessine une planète depuis son ASSET pré-rendu (canvas cache), avec rotation
 * propre autour d'un centre réglable (`centerOffset`). Le glow est déjà dans
 * l'asset ; à l'approche on ajoute une légère pulsation + un halo teinté accent.
 */
export function drawPlanetAsset(
  ctx: CanvasRenderingContext2D,
  v: View,
  w: World,
  cache: HTMLCanvasElement,
  pulse: number,
): void {
  const cx = sx(v, w.x);
  const cy = sy(v, w.y);
  const box = 2 * w.radius * v.zoom;

  // Cull hors écran (marge = taille de la boîte).
  if (cx < -box || cx > v.w + box || cy < -box || cy > v.h + box) return;

  // Rotation propre (ralentie en reduced-motion).
  const rotFactor = v.reduced ? 0.3 : 1;
  const rot = v.time * (w.rotationSpeed ?? 0) * rotFactor;

  // Pulsation d'échelle discrète à l'approche.
  const pulseScale = 1 + pulse * 0.05 * (0.5 + 0.5 * Math.sin(v.time * 4));
  const drawBox = box * pulseScale;

  // Halo d'approche teinté accent (sous l'asset), pulsant.
  if (pulse > 0.01) {
    ctx.save();
    ctx.globalAlpha = 0.35 * pulse * (0.6 + 0.4 * Math.sin(v.time * 4));
    ctx.shadowBlur = 26 * v.q.glow;
    ctx.shadowColor = w.color;
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, w.radius * v.zoom * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Asset : rotation autour de (centre image + centerOffset).
  const ox = (w.centerOffset?.x ?? 0) * drawBox;
  const oy = (w.centerOffset?.y ?? 0) * drawBox;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.drawImage(cache, -drawBox / 2 - ox, -drawBox / 2 - oy, drawBox, drawBox);
  ctx.restore();

  // Anneau d'approche pointillé + label.
  if (pulse > 0.01) {
    ctx.save();
    const ar = w.approachRadius * v.zoom;
    ctx.globalAlpha = 0.22 + 0.22 * Math.sin(v.time * 4);
    ctx.setLineDash([6, 10]);
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 6 * v.q.glow;
    ctx.shadowColor = w.color;
    ctx.beginPath();
    ctx.arc(cx, cy, ar, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Nom du projet (label HUD lumineux, teinté accent).
  ctx.save();
  ctx.shadowBlur = 8 * v.q.glow;
  ctx.shadowColor = w.color;
  ctx.fillStyle = w.color;
  ctx.font = "13px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(w.name.toUpperCase(), cx, cy + w.radius * v.zoom + 20);
  ctx.restore();
}

/**
 * Dessine le VAISSEAU depuis son asset pré-rendu, pivoté selon le cap. L'asset
 * pointe vers le haut → rotation = `angle + π/2` (à angle = -π/2 = « haut »,
 * rotation nulle). Ancrage réglable `centerOffset`.
 */
export function drawShipAsset(
  ctx: CanvasRenderingContext2D,
  v: View,
  cache: HTMLCanvasElement,
  screenX: number,
  screenY: number,
  angle: number,
  boxWorld: number,
  centerOffset: { x: number; y: number },
): void {
  const box = boxWorld * v.zoom;
  const ox = centerOffset.x * box;
  const oy = centerOffset.y * box;
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(angle + Math.PI / 2);
  ctx.drawImage(cache, -box / 2 - ox, -box / 2 - oy, box, box);
  ctx.restore();
}

/** Un point de traînée réacteur (coordonnées MONDE, s'estompe avec `life`). */
export interface TrailParticle {
  x: number;
  y: number;
  life: number; // 1 → 0
}

/** Traînée de réacteur : points lumineux corail qui s'estompent derrière le vaisseau. */
export function drawTrail(
  ctx: CanvasRenderingContext2D,
  v: View,
  particles: TrailParticle[],
): void {
  ctx.save();
  ctx.shadowColor = NEON.THRUST;
  ctx.fillStyle = NEON.THRUST;
  for (const p of particles) {
    const px = sx(v, p.x);
    const py = sy(v, p.y);
    ctx.globalAlpha = p.life * 0.7;
    ctx.shadowBlur = 10 * v.q.glow * p.life;
    const r = (1.5 + p.life * 4) * v.zoom;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Le vaisseau : delta vectoriel néon + noyau blanc, à une position écran donnée. */
export function drawShipAt(
  ctx: CanvasRenderingContext2D,
  v: View,
  screenX: number,
  screenY: number,
  angle: number,
  thrusting: boolean,
): void {
  const L = 17; // longueur du nez
  const B = 11; // demi-largeur arrière
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(angle);

  // Silhouette delta : nez en avant (+X), deux ailerons arrière, encoche.
  ctx.beginPath();
  ctx.moveTo(L, 0);
  ctx.lineTo(-L * 0.7, B);
  ctx.lineTo(-L * 0.4, 0);
  ctx.lineTo(-L * 0.7, -B);
  ctx.closePath();

  ctx.shadowBlur = 16 * v.q.glow;
  ctx.shadowColor = NEON.SHIP;
  ctx.strokeStyle = NEON.SHIP;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Noyau blanc (petit trait central) pour le « cœur » lumineux.
  ctx.beginPath();
  ctx.moveTo(L * 0.7, 0);
  ctx.lineTo(-L * 0.3, 0);
  ctx.shadowBlur = 8 * v.q.glow;
  ctx.shadowColor = NEON.SHIP_CORE;
  ctx.strokeStyle = NEON.SHIP_CORE;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Petite flamme au ralenti (la vraie traînée = étape suivante).
  if (thrusting) {
    ctx.beginPath();
    ctx.moveTo(-L * 0.4, 0);
    ctx.lineTo(-L * 0.9 - Math.random() * 6, 0);
    ctx.shadowBlur = 12 * v.q.glow;
    ctx.shadowColor = NEON.THRUST;
    ctx.strokeStyle = NEON.THRUST;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Indice de bord : anneau-frontière lointain + vignette, dont l'opacité croît
 * avec `boundary` (0 = rien, 1 = au rayon, >1 au-delà). Prévient avant de repousser.
 */
export function drawBoundary(
  ctx: CanvasRenderingContext2D,
  v: View,
  boundary: number,
): void {
  if (boundary <= 0) return;
  const a = Math.min(1, boundary);

  // Vignette rouge-néon sur les bords.
  const grad = ctx.createRadialGradient(
    v.w / 2,
    v.h / 2,
    Math.min(v.w, v.h) * 0.35,
    v.w / 2,
    v.h / 2,
    Math.max(v.w, v.h) * 0.75,
  );
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, `rgba(255,59,107,${0.28 * a})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, v.w, v.h);

  // Anneau-frontière lumineux au loin.
  const cx = sx(v, 0);
  const cy = sy(v, 0);
  const r = WORLD.RADIUS * v.zoom;
  ctx.save();
  ctx.globalAlpha = 0.3 + 0.5 * a;
  ctx.shadowBlur = 16 * v.q.glow;
  ctx.shadowColor = NEON.BOUNDARY;
  ctx.strokeStyle = NEON.BOUNDARY;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
