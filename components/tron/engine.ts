import { CAMERA, FLIGHT, QUALITY, SHIP } from "./config";
import { createFlightState, stepFlight, type FlightState } from "./flightModel";
import { createKeyboardInput } from "./input/keyboardInput";
import { createTouchInput, type TouchInput } from "./input/touchInput";
import { createCombinedInput } from "./input/combinedInput";
import { disposeCaches, loadImage, prerender } from "./assets";
import {
  drawBackground,
  drawBoundary,
  drawPlanet,
  drawPlanetAsset,
  drawShipAsset,
  drawShipAt,
  drawTrail,
  toScreen,
  type TrailParticle,
  type View,
} from "./render";
import { NEUTRAL_INPUT, type InputSource, type TronEngineOptions, type World } from "./types";

/**
 * Moteur Tron — possède la boucle `requestAnimationFrame`, gère DPR/resize,
 * lit l'entrée fusionnée (clavier + tactile), avance la physique, suit à la
 * caméra, détecte la proximité, et dessine (assets pré-rendus, fallback
 * procédural). Découplé de React : le composant preview le crée, l'écoute via
 * callbacks, et appelle `dispose()`.
 */
export interface TronEngine {
  start: () => void;
  stop: () => void;
  dispose: () => void;
  recenter: () => void;
  triggerInteract: () => void;
  touch: TouchInput;
}

export function createTronEngine(
  canvas: HTMLCanvasElement,
  opts: TronEngineOptions,
): TronEngine {
  const ctx = canvas.getContext("2d")!;
  const q = QUALITY[opts.quality ?? "high"];
  const reduced = opts.reducedMotion ?? false;
  const worlds = opts.worlds;
  const state: FlightState = createFlightState(0, 0);

  // Entrées : clavier + tactile fusionnés (le tactile est inerte tant que le
  // HUD mobile ne le pilote pas). `pending*` = fronts externes (clic/boutons).
  const keyboard = createKeyboardInput();
  const touch = createTouchInput();
  const input: InputSource = createCombinedInput([keyboard, touch]);
  let pendingInteract = false;
  let pendingRecenter = false;

  const cam = { x: state.x, y: state.y, zoom: CAMERA.BASE_ZOOM };

  // — ASSETS — images chargées + caches offscreen pré-rendus (dessinés/frame).
  let disposed = false;
  const loadedImg = new Map<string, HTMLImageElement>();
  const planetCache = new Map<World, HTMLCanvasElement>();
  let shipCache: HTMLCanvasElement | null = null;

  // DPR / resize.
  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  function fit() {
    const newDpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    cssW = rect.width;
    cssH = rect.height;
    canvas.width = Math.round(cssW * newDpr);
    canvas.height = Math.round(cssH * newDpr);
    ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0); // tout se dessine en px CSS
    // Le DPR a changé → reconstruire les caches à la bonne résolution.
    if (newDpr !== dpr) {
      dpr = newDpr;
      rebuildCaches();
    }
  }

  // Pré-rend le cache d'une planète : boîte monde = 2*radius, en px device × cacheScale.
  function buildPlanetCache(w: World, img: HTMLImageElement) {
    planetCache.set(w, prerender(img, 2 * w.radius * dpr * q.cacheScale));
  }
  function buildShipCache(img: HTMLImageElement) {
    shipCache = prerender(img, SHIP.SIZE * dpr * q.cacheScale);
  }
  function rebuildCaches() {
    for (const w of worlds) {
      const img = w.asset ? loadedImg.get(w.asset) : undefined;
      if (img) buildPlanetCache(w, img);
    }
    const simg = opts.shipAsset ? loadedImg.get(opts.shipAsset) : undefined;
    if (simg) buildShipCache(simg);
  }

  // Chargement asynchrone : chaque asset qui arrive construit son cache. Tant
  // qu'un asset n'est pas prêt (ou échoue), sa planète tombe sur le fallback
  // procédural — la scène n'est jamais cassée. (Robustesse.)
  async function loadAssets() {
    for (const w of worlds) {
      if (!w.asset) continue;
      try {
        const img = await loadImage(w.asset);
        loadedImg.set(w.asset, img);
        if (!disposed) buildPlanetCache(w, img);
      } catch (e) {
        console.warn(`[tron] planète "${w.name}" — asset non chargé, fallback néon.`, e);
      }
    }
    if (opts.shipAsset) {
      try {
        const img = await loadImage(opts.shipAsset);
        loadedImg.set(opts.shipAsset, img);
        if (!disposed) buildShipCache(img);
      } catch (e) {
        console.warn("[tron] vaisseau — asset non chargé, fallback delta.", e);
      }
    }
  }

  fit();
  window.addEventListener("resize", fit);
  loadAssets();

  // Proximité + traînée + FPS.
  let nearest: World | null = null;
  const trail: TrailParticle[] = [];
  const TRAIL_LIFE = 0.5; // s
  let emitAcc = 0;
  let fpsFrames = 0;
  let fpsTime = 0;

  let raf = 0;
  let last = 0;
  let running = false;

  function frame(now: number) {
    if (!running) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;

    // — ENTRÉE —
    const inp = { ...(input.read() ?? NEUTRAL_INPUT) };
    if (pendingInteract) {
      inp.interact = true;
      pendingInteract = false;
    }
    if (pendingRecenter) {
      inp.recenter = true;
      pendingRecenter = false;
    }

    // — PHYSIQUE —
    stepFlight(state, inp, dt);

    // — CAMÉRA SUIVEUSE — (lerp framerate-indépendant ; dézoom avec la vitesse)
    const kCam = 1 - Math.exp(-CAMERA.LERP * dt);
    cam.x += (state.x - cam.x) * kCam;
    cam.y += (state.y - cam.y) * kCam;
    const speedFrac = Math.min(1, state.speed / FLIGHT.MAX_SPEED);
    const targetZoom = reduced
      ? CAMERA.BASE_ZOOM
      : CAMERA.BASE_ZOOM - (CAMERA.BASE_ZOOM - CAMERA.MIN_ZOOM) * speedFrac;
    cam.zoom += (targetZoom - cam.zoom) * (1 - Math.exp(-CAMERA.ZOOM_LERP * dt));

    // — TRAÎNÉE — émise derrière le vaisseau à la poussée, s'estompe (cap = quality).
    if (inp.thrust > 0.05) {
      emitAcc += dt;
      const interval = 0.02;
      const bx = state.x - Math.cos(state.angle) * SHIP.SIZE * 0.35;
      const by = state.y - Math.sin(state.angle) * SHIP.SIZE * 0.35;
      while (emitAcc > interval) {
        emitAcc -= interval;
        trail.push({ x: bx, y: by, life: 1 });
        if (trail.length > q.trailMax) trail.shift();
      }
    }
    for (const p of trail) p.life -= dt / TRAIL_LIFE;
    while (trail.length && trail[0].life <= 0) trail.shift();

    // — PROXIMITÉ —
    let inRange: World | null = null;
    let bestD = Infinity;
    for (const w of worlds) {
      const d = Math.hypot(w.x - state.x, w.y - state.y);
      if (d < w.approachRadius && d < bestD) {
        bestD = d;
        inRange = w;
      }
    }
    if (inRange !== nearest) {
      nearest = inRange;
      opts.onProximity?.(nearest);
    }
    if (inp.interact && nearest) opts.onLand?.(nearest.route ?? nearest.slug);

    // — RENDU —
    const view: View = {
      w: cssW,
      h: cssH,
      camX: cam.x,
      camY: cam.y,
      zoom: cam.zoom,
      time: now / 1000,
      q,
      reduced,
    };
    drawBackground(ctx, view);
    for (const w of worlds) {
      const pulse = w === nearest ? 1 : 0;
      const cache = planetCache.get(w);
      if (cache) drawPlanetAsset(ctx, view, w, cache, pulse);
      else drawPlanet(ctx, view, w, pulse); // fallback procédural
    }
    drawTrail(ctx, view, trail);
    const [shipX, shipY] = toScreen(view, state.x, state.y);
    if (shipCache) {
      drawShipAsset(ctx, view, shipCache, shipX, shipY, state.angle, SHIP.SIZE, SHIP.CENTER_OFFSET);
    } else {
      drawShipAt(ctx, view, shipX, shipY, state.angle, inp.thrust > 0.01);
    }
    drawBoundary(ctx, view, state.boundary);

    // — FPS —
    fpsFrames++;
    fpsTime += dt;
    if (fpsTime >= 0.5) {
      opts.onFps?.(Math.round(fpsFrames / fpsTime));
      fpsFrames = 0;
      fpsTime = 0;
    }

    raf = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      input.dispose();
      window.removeEventListener("resize", fit);
      // Libère les caches offscreen (les images mémoïsées restent réutilisables).
      disposeCaches([...planetCache.values(), shipCache]);
      planetCache.clear();
      shipCache = null;
    },
    recenter() {
      pendingRecenter = true;
    },
    triggerInteract() {
      pendingInteract = true;
    },
    touch,
  };
}
