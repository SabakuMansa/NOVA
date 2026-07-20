"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * LABO / expérience 01 — « le portail qui se fissure ».
 *
 * Au clic sur « Entrer », l'écran A (le portail) se brise en verre :
 *  1. un réseau de fissures procédurales apparaît (toile radiale jitterée
 *     autour du point d'impact — nouvelle géométrie à chaque déclenchement) ;
 *  2. l'écran B (le contenu révélé) transparaît dans les interstices ;
 *  3. les fragments tombent (gravité + rotation + fondu) et libèrent l'écran B.
 *
 * Technique : canvas 2D. L'écran A (DOM simple : fond, blobs, textes, bouton)
 * est REPEINT à l'identique sur une texture offscreen au moment du clic
 * (positions/typos mesurées sur le DOM réel) — pas de capture DOM lourde.
 * Chaque fragment = polygone découpé dans cette texture via clip().
 * Fragments : ~65 desktop / ~36 mobile (quads jitterés, pas des centaines de
 * micro-morceaux). Boucle pilotée par requestAnimationFrame + un filet
 * setInterval (les rAF sont suspendus dans les onglets d'arrière-plan).
 *
 * prefers-reduced-motion : aucun canvas, aucun son — simple fondu croisé.
 * Son : bref éclat de verre SYNTHÉTISÉ en Web Audio (bruit filtré + tintements
 * sinusoïdaux), aucun fichier audio. Créé uniquement sur geste utilisateur.
 */

/* ------------------------------------------------------------------ types */

type Frag = {
  poly: [number, number][]; // sommets (coords écran, px CSS)
  cx: number;               // centroïde
  cy: number;
  vx: number;               // vitesses initiales (trajectoire balistique
  vy: number;               // calculée analytiquement à chaque frame — pas
  vr: number;               // d'intégration incrémentale, donc déterministe)
  delay: number;            // départ de la chute (ms depuis le début)
  gapX: number;             // écartement phase fissure (px, direction radiale)
  gapY: number;
};

const CRACK_MS = 240;   // phase 1 : fissuration + interstices
const TOTAL_MS = 1400;  // durée totale de l'effet (≤ 1,5 s demandé)
const GRAVITY = 2600;   // px/s²

/* --------------------------------------------------- géométrie procédurale */

/** Toile de verre : rayons + anneaux jitterés autour du point d'impact.
 *  Chaque cellule (quad irrégulier) devient un fragment. Regénéré à chaque
 *  déclenchement → les fissures ne sont jamais deux fois les mêmes. */
function buildFragments(w: number, h: number, ix: number, iy: number, mobile: boolean): Frag[] {
  const spokes = mobile ? 9 : 13;
  const rings = mobile ? 4 : 5;
  // Rayon couvrant tout l'écran depuis l'impact.
  const R = Math.max(
    Math.hypot(ix, iy),
    Math.hypot(w - ix, iy),
    Math.hypot(ix, h - iy),
    Math.hypot(w - ix, h - iy)
  ) * 1.06;

  // Angles de rayons jitterés.
  const angles: number[] = [];
  for (let s = 0; s < spokes; s++) {
    const base = (s / spokes) * Math.PI * 2;
    angles.push(base + (Math.random() - 0.5) * (Math.PI / spokes) * 0.9);
  }
  // Rayons d'anneaux (progression accélérée : petits éclats près de l'impact).
  const radii: number[] = [0];
  for (let r = 1; r <= rings; r++) {
    radii.push(R * Math.pow(r / rings, 1.6));
  }

  // Sommets jitterés par (rayon, anneau) — partagés entre cellules voisines
  // pour que les fissures coïncident (vraie toile, pas des tuiles disjointes).
  const vert = (s: number, r: number): [number, number] => {
    const a = angles[s % spokes];
    if (r === 0) return [ix, iy];
    const jr = radii[r] * (1 + (seeded(s * 31 + r * 7) - 0.5) * 0.16);
    const ja = a + (seeded(s * 13 + r * 17) - 0.5) * 0.1;
    return [ix + Math.cos(ja) * jr, iy + Math.sin(ja) * jr];
  };
  // Jitter déterministe par sommet pour cette toile (graine tirée au clic).
  const seedBase = Math.random() * 10_000;
  function seeded(n: number) {
    const x = Math.sin(n * 127.1 + seedBase) * 43758.5453;
    return x - Math.floor(x);
  }

  const frags: Frag[] = [];
  for (let s = 0; s < spokes; s++) {
    for (let r = 0; r < rings; r++) {
      const poly: [number, number][] =
        r === 0
          ? [vert(s, 0), vert(s, 1), vert(s + 1, 1)] // triangles au centre
          : [vert(s, r), vert(s, r + 1), vert(s + 1, r + 1), vert(s + 1, r)];
      const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
      const cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
      // Direction radiale (pour l'écartement des fissures + impulsion).
      const dist = Math.hypot(cx - ix, cy - iy) || 1;
      const nx = (cx - ix) / dist;
      const ny = (cy - iy) / dist;
      frags.push({
        poly, cx, cy,
        vx: nx * (60 + Math.random() * 140),
        vy: -40 + Math.random() * 80 + ny * 40,
        vr: (Math.random() - 0.5) * 5,
        delay: CRACK_MS + r * 55 + Math.random() * 90,
        gapX: nx * (1.5 + Math.random()),
        gapY: ny * (1.5 + Math.random()),
      });
    }
  }
  return frags;
}

/* ------------------------------------------------ réplique de l'écran A */

/** Repeint l'écran A sur un canvas offscreen : fond, blobs, puis chaque
 *  élément marqué [data-paint] à sa position mesurée (même police/couleur). */
function paintReplica(tex: HTMLCanvasElement, root: HTMLElement, w: number, h: number, dpr: number) {
  const ctx = tex.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Fond encre + blobs (mêmes constantes que le style inline du DOM).
  ctx.fillStyle = "#211D16";
  ctx.fillRect(0, 0, w, h);
  for (const [x, y, r, color] of BLOBS) {
    const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * Math.max(w, h));
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-paint]"))) {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (el.dataset.paint === "button") {
      const radius = parseFloat(cs.borderRadius) || 12;
      ctx.fillStyle = cs.backgroundColor;
      ctx.beginPath();
      ctx.roundRect(rect.left, rect.top, rect.width, rect.height, radius);
      ctx.fill();
      ctx.lineWidth = parseFloat(cs.borderTopWidth) || 2;
      ctx.strokeStyle = cs.borderTopColor;
      ctx.stroke();
      ctx.fillStyle = cs.color;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(el.innerText, rect.left + rect.width / 2, rect.top + rect.height / 2 + 1);
      ctx.textAlign = "left";
    } else {
      ctx.fillStyle = cs.color;
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.textBaseline = "alphabetic";
      const ascent = parseFloat(cs.fontSize) * 0.8;
      ctx.fillText(el.innerText, rect.left, rect.top + ascent + (rect.height - parseFloat(cs.fontSize) * 1.05) / 2);
    }
  }
}

// Blobs du portail : [x%, y%, rayon relatif, couleur]. Partagés DOM/canvas.
const BLOBS: [number, number, number, string][] = [
  [0.22, 0.28, 0.34, "rgba(108,92,231,0.24)"],
  [0.78, 0.22, 0.30, "rgba(255,107,74,0.18)"],
  [0.70, 0.78, 0.32, "rgba(14,168,139,0.16)"],
  [0.28, 0.80, 0.26, "rgba(255,197,61,0.14)"],
];
const BLOB_CSS = BLOBS
  .map(([x, y, r, c]) => `radial-gradient(${r * 100}% ${r * 100}% at ${x * 100}% ${y * 100}%, ${c}, transparent 70%)`)
  .join(", ");

/* --------------------------------------------------------------- audio */

/** Bref éclat de verre synthétisé : bruit blanc passe-haut à décroissance
 *  rapide + 3 tintements sinusoïdaux aigus décalés. Aucun asset. */
function playGlassSound() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    const master = ac.createGain();
    master.gain.value = 0.5;
    master.connect(ac.destination);

    // Souffle de brisure.
    const dur = 0.32;
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2);
    }
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2400;
    noise.connect(hp).connect(master);
    noise.start();

    // Tintements.
    for (let i = 0; i < 3; i++) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const t0 = ac.currentTime + 0.02 + i * 0.05 + Math.random() * 0.04;
      osc.frequency.value = 2200 + Math.random() * 2800;
      g.gain.setValueAtTime(0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      osc.connect(g).connect(master);
      osc.start(t0);
      osc.stop(t0 + 0.2);
    }
    setTimeout(() => ac.close().catch(() => {}), 1200);
  } catch {
    /* audio indisponible : l'effet visuel suffit */
  }
}

/* ----------------------------------------------------------- composant */

export default function ShatterPortal() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"portal" | "shattering" | "revealed">("portal");
  const portalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => () => cleanupRef.current(), []);

  const shatter = useCallback((e: React.MouseEvent) => {
    if (phase !== "portal") return;
    if (reduce) {
      // Reduced motion : fondu croisé simple, aucun canvas, aucun son.
      setPhase("revealed");
      return;
    }
    const root = portalRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mobile = w < 640;

    // Texture = réplique de l'écran A, peinte AVANT de le masquer.
    const tex = document.createElement("canvas");
    tex.width = w * dpr;
    tex.height = h * dpr;
    paintReplica(tex, root, w, h, dpr);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const frags = buildFragments(w, h, e.clientX, e.clientY, mobile);
    playGlassSound();
    setPhase("shattering");

    const start = performance.now();
    let lastDraw = 0;
    let done = false;
    // Debug labo : /labo?freeze=600 fige l'effet à t=600ms (inspection des
    // fissures / captures). Jamais actif sans le paramètre.
    const freezeParam = parseInt(new URLSearchParams(window.location.search).get("freeze") ?? "", 10);
    const freeze = Number.isFinite(freezeParam) ? freezeParam : null;

    const step = () => {
      if (done) return;
      const now = performance.now();
      if (now - lastDraw < 15) return; // ~60fps max, idempotent
      lastDraw = now;
      const elapsed = freeze ?? now - start;

      ctx.clearRect(0, 0, w, h);
      const crackT = Math.min(elapsed / CRACK_MS, 1);

      for (const f of frags) {
        // Position analytique (balistique) — déterministe pour un elapsed donné.
        let dx: number, dy: number, rot: number, alpha: number;
        if (elapsed > f.delay) {
          const t = (elapsed - f.delay) / 1000;
          dx = f.gapX + f.vx * t;
          dy = f.gapY + f.vy * t + 0.5 * GRAVITY * t * t;
          rot = f.vr * t;
          const life = (elapsed - f.delay) / (TOTAL_MS - f.delay);
          alpha = life > 0.55 ? Math.max(0, 1 - (life - 0.55) / 0.45) : 1;
        } else {
          // Phase fissure : léger écartement radial → l'écran B transparaît.
          dx = f.gapX * crackT;
          dy = f.gapY * crackT;
          rot = 0;
          alpha = 1;
        }
        if (alpha <= 0 || f.cy + dy > h + 400) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(f.cx + dx, f.cy + dy);
        ctx.rotate(rot);
        ctx.translate(-f.cx, -f.cy);
        ctx.beginPath();
        ctx.moveTo(f.poly[0][0], f.poly[0][1]);
        for (let i = 1; i < f.poly.length; i++) ctx.lineTo(f.poly[i][0], f.poly[i][1]);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(tex, 0, 0, w, h);
        // Arête de la fissure (catch-light du verre).
        if (crackT < 1 || elapsed < f.delay + 200) {
          ctx.globalAlpha = alpha * 0.45;
          ctx.strokeStyle = "#FBF7EF";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Flash d'impact bref.
      if (elapsed < 130) {
        ctx.globalAlpha = 0.28 * (1 - elapsed / 130);
        ctx.fillStyle = "#FBF7EF";
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      if (freeze === null && elapsed >= TOTAL_MS) {
        done = true;
        cleanupRef.current();
        setPhase("revealed");
      }
    };

    // rAF en pilote + filet setInterval : les rAF sont suspendus quand
    // l'onglet passe en arrière-plan, l'effet doit quand même se terminer.
    let raf = 0;
    const loop = () => {
      step();
      if (!done) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const net = setInterval(step, 50);
    cleanupRef.current = () => {
      cancelAnimationFrame(raf);
      clearInterval(net);
    };
  }, [phase, reduce]);

  const replay = useCallback(() => {
    cleanupRef.current();
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setPhase("portal");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-lait text-encre">
      {/* -------- Écran B : le contenu révélé (toujours dans le DOM, dessous) */}
      <main
        aria-hidden={phase === "portal"}
        className={`absolute inset-0 flex min-h-screen flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${
          phase === "portal" ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-wide shadow-[2px_2px_0_#211D16]">
          <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
          Labo · expérience 01 — réussie
        </p>
        <h2 className="mt-6 max-w-2xl font-sans text-4xl font-extrabold tracking-tight sm:text-6xl">
          De l'autre côté du verre.
        </h2>
        <p className="mt-5 max-w-md font-sans text-lg text-encre/70">
          Fissures procédurales, fragments en chute libre, son synthétisé —
          aucun fichier, aucun plugin. Juste un canvas et un peu de physique.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={replay}
            className="rounded-xl border-2 border-encre bg-corail px-6 py-3 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
          >
            Rejouer l'expérience ↺
          </button>
          <a
            href="/"
            className="rounded-xl border-2 border-encre bg-white px-6 py-3 font-sans text-sm font-bold text-encre shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
          >
            Retour au vrai site
          </a>
        </div>
        <p className="mt-10 font-mono text-[0.6rem] uppercase tracking-wide text-encre/40">
          Page hors commerce · non indexée · les fissures changent à chaque essai
        </p>
      </main>

      {/* -------- Écran A : le portail (au-dessus tant que non brisé) */}
      {phase !== "revealed" && (
        <div
          ref={portalRef}
          className={`absolute inset-0 z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center ${
            phase === "shattering" ? "invisible" : ""
          } ${reduce ? "transition-opacity duration-500" : ""}`}
          style={{ backgroundColor: "#211D16", backgroundImage: BLOB_CSS }}
        >
          <p
            data-paint="text"
            className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-jaune"
          >
            K1000.studio / labo
          </p>
          <h1
            data-paint="text"
            className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-lait sm:text-6xl md:text-7xl"
          >
            Derrière cet écran,
          </h1>
          <span
            data-paint="text"
            className="font-sans text-4xl font-extrabold tracking-tight text-lait sm:text-6xl md:text-7xl"
          >
            autre chose.
          </span>
          <p data-paint="text" className="mt-6 font-sans text-lg text-lait/60">
            Un seul moyen de le savoir.
          </p>
          <button
            type="button"
            data-paint="button"
            onClick={shatter}
            className="mt-10 rounded-xl border-2 border-lait bg-corail px-8 py-4 font-sans text-lg font-bold text-white shadow-[4px_4px_0_#FBF7EF] transition-transform hover:-translate-y-0.5"
          >
            Entrer →
          </button>
          <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-wide text-lait/35">
            (l'écran ne survivra pas)
          </p>
        </div>
      )}

      {/* -------- Canvas de l'effet (au-dessus de tout pendant la casse) */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-20 h-full w-full ${
          phase === "shattering" ? "" : "hidden"
        }`}
      />
    </div>
  );
}
