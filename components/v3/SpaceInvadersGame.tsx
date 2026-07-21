"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mini-jeu Space Invaders jouable — vanilla Canvas 2D + requestAnimationFrame,
 * boucle update/render séparée, deltatime pour un mouvement indépendant du
 * framerate. Aucune dépendance externe. État de jeu "chaud" (positions,
 * tirs) gardé dans une ref mutée directement par la boucle — jamais dans du
 * state React — pour ne jamais déclencher de re-render à 60fps ; seuls le
 * score, les vies et la phase (affichés dans l'UI) passent par du state,
 * mis à jour uniquement quand ils changent réellement (kill, perte de vie,
 * game over), pas à chaque frame.
 */

const CANVAS_W = 320;
const CANVAS_H = 420;
const MARGIN = 16;

const ROWS = 4;
const COLS = 6;
const CELL = 3;
const GAP = 8;

const PLAYER_CELL = 2.5;
const PLAYER_SPEED = 220;
const SHOT_COOLDOWN = 0.32;
const PLAYER_BULLET_SPEED = 340;
const ENEMY_BULLET_SPEED = 150;
const BASE_INVADER_SPEED = 36;
const DROP_STEP = 16;
const BASE_FIRE_CHANCE = 0.5;
const WAVE_SPEED_MULTIPLIER = 1.18;
const WAVE_FIRE_MULTIPLIER = 1.12;
const START_LIVES = 3;
const SCORE_PER_KILL = 10;
const INVULNERABLE_DURATION = 1;
const MAX_DT = 0.05;

// Sprite pixel-art de l'envahisseur (1 = pixel plein).
const INVADER_BITMAP: number[][] = [
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
];
const INVADER_W = INVADER_BITMAP[0].length * CELL;
const INVADER_H = INVADER_BITMAP.length * CELL;
const ROW_COLORS = ["#FF7A00", "#FFD23F", "#FF7A00", "#FFD23F"];

// Sprite pixel-art du vaisseau du joueur.
const SHIP_BITMAP: number[][] = [
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const PLAYER_W = SHIP_BITMAP[0].length * PLAYER_CELL;
const PLAYER_H = SHIP_BITMAP.length * PLAYER_CELL;
const PLAYER_Y = CANVAS_H - 40;

const GRID_WIDTH = COLS * (INVADER_W + GAP) - GAP;
const MAX_OFFSET_X = CANVAS_W - MARGIN * 2 - GRID_WIDTH;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

interface Invader {
  row: number;
  col: number;
  alive: boolean;
}
interface Bullet {
  x: number;
  y: number;
}
interface GameState {
  playerX: number;
  keys: { left: boolean; right: boolean };
  invaders: Invader[];
  invaderDir: number;
  invaderOffsetX: number;
  invaderOffsetY: number;
  invaderSpeed: number;
  fireChance: number;
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  lastShotAt: number;
  clock: number;
  invulnerableUntil: number;
}

function createInvaderGrid(): Invader[] {
  const list: Invader[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) list.push({ row: r, col: c, alive: true });
  }
  return list;
}

function createInitialGameState(): GameState {
  return {
    playerX: CANVAS_W / 2 - PLAYER_W / 2,
    keys: { left: false, right: false },
    invaders: createInvaderGrid(),
    invaderDir: 1,
    invaderOffsetX: 0,
    invaderOffsetY: 0,
    invaderSpeed: BASE_INVADER_SPEED,
    fireChance: BASE_FIRE_CHANCE,
    playerBullets: [],
    enemyBullets: [],
    lastShotAt: -999,
    clock: 0,
    invulnerableUntil: 0,
  };
}

function updateGame(state: GameState, dt: number) {
  state.clock += dt;
  let scoreDelta = 0;
  let lifeLost = false;
  let invasionReachedBottom = false;

  const dir = (state.keys.left ? -1 : 0) + (state.keys.right ? 1 : 0);
  state.playerX = clamp(state.playerX + dir * PLAYER_SPEED * dt, 0, CANVAS_W - PLAYER_W);

  const aliveInvaders = state.invaders.filter((i) => i.alive);
  if (aliveInvaders.length === 0) {
    state.invaders = createInvaderGrid();
    state.invaderOffsetX = 0;
    state.invaderOffsetY = 0;
    state.invaderDir = 1;
    state.invaderSpeed *= WAVE_SPEED_MULTIPLIER;
    state.fireChance *= WAVE_FIRE_MULTIPLIER;
    return { scoreDelta, lifeLost, invasionReachedBottom };
  }

  state.invaderOffsetX += state.invaderDir * state.invaderSpeed * dt;
  if (state.invaderOffsetX <= 0 || state.invaderOffsetX >= MAX_OFFSET_X) {
    state.invaderOffsetX = clamp(state.invaderOffsetX, 0, MAX_OFFSET_X);
    state.invaderDir *= -1;
    state.invaderOffsetY += DROP_STEP;
  }

  if (MARGIN + state.invaderOffsetY + ROWS * (INVADER_H + GAP) >= PLAYER_Y) {
    return { scoreDelta, lifeLost, invasionReachedBottom: true };
  }

  if (Math.random() < state.fireChance * dt) {
    const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
    state.enemyBullets.push({
      x: MARGIN + state.invaderOffsetX + shooter.col * (INVADER_W + GAP) + INVADER_W / 2,
      y: MARGIN + state.invaderOffsetY + shooter.row * (INVADER_H + GAP) + INVADER_H,
    });
  }

  state.playerBullets.forEach((b) => (b.y -= PLAYER_BULLET_SPEED * dt));
  state.enemyBullets.forEach((b) => (b.y += ENEMY_BULLET_SPEED * dt));

  for (const bullet of state.playerBullets) {
    if (bullet.y < -20) continue;
    for (const inv of aliveInvaders) {
      if (!inv.alive) continue;
      const ix = MARGIN + state.invaderOffsetX + inv.col * (INVADER_W + GAP);
      const iy = MARGIN + state.invaderOffsetY + inv.row * (INVADER_H + GAP);
      if (
        bullet.x + 1.5 > ix &&
        bullet.x - 1.5 < ix + INVADER_W &&
        bullet.y > iy &&
        bullet.y < iy + INVADER_H
      ) {
        inv.alive = false;
        bullet.y = -9999;
        scoreDelta += SCORE_PER_KILL;
        break;
      }
    }
  }

  if (state.clock > state.invulnerableUntil) {
    for (const bullet of state.enemyBullets) {
      if (
        bullet.x + 1.5 > state.playerX &&
        bullet.x - 1.5 < state.playerX + PLAYER_W &&
        bullet.y + 5 > PLAYER_Y &&
        bullet.y < PLAYER_Y + PLAYER_H
      ) {
        bullet.y = 99999;
        lifeLost = true;
        state.invulnerableUntil = state.clock + INVULNERABLE_DURATION;
        break;
      }
    }
  }

  state.playerBullets = state.playerBullets.filter((b) => b.y > -20 && b.y < CANVAS_H + 20);
  state.enemyBullets = state.enemyBullets.filter((b) => b.y > -20 && b.y < CANVAS_H + 20);

  return { scoreDelta, lifeLost, invasionReachedBottom };
}

function createSpriteCanvas(bitmap: number[][], color: string, cell: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(bitmap[0].length * cell);
  c.height = Math.round(bitmap.length * cell);
  const cctx = c.getContext("2d")!;
  cctx.fillStyle = color;
  bitmap.forEach((row, ry) =>
    row.forEach((v, rx) => {
      if (v) cctx.fillRect(rx * cell, ry * cell, cell, cell);
    })
  );
  return c;
}

export default function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(createInitialGameState());
  const livesRef = useRef(START_LIVES);
  const spritesRef = useRef<{ invaders: HTMLCanvasElement[]; ship: HTMLCanvasElement } | null>(
    null
  );

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [phase, setPhase] = useState<"playing" | "gameover">("playing");

  const resetGame = useCallback(() => {
    gameRef.current = createInitialGameState();
    livesRef.current = START_LIVES;
    setScore(0);
    setLives(START_LIVES);
    setPhase("playing");
  }, []);

  const tryFire = useCallback(() => {
    const s = gameRef.current;
    if (s.clock - s.lastShotAt < SHOT_COOLDOWN) return;
    s.lastShotAt = s.clock;
    s.playerBullets.push({ x: s.playerX + PLAYER_W / 2, y: PLAYER_Y });
  }, []);

  // Clavier — flèches/Q/D pour bouger, Espace pour tirer. Écoute toujours
  // active tant que la partie est en cours (indépendant du focus canvas,
  // le canvas n'est pas interactif/focusable).
  useEffect(() => {
    if (phase !== "playing") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "KeyQ", "KeyD", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === "ArrowLeft" || e.code === "KeyQ") gameRef.current.keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") gameRef.current.keys.right = true;
      if (e.code === "Space" && !e.repeat) tryFire();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyQ") gameRef.current.keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") gameRef.current.keys.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [phase, tryFire]);

  // Boucle de jeu — update (logique/collisions) puis render (dessin),
  // séparés. dt plafonné pour éviter un saut massif si l'onglet perd le
  // focus (rAF se met en pause, le prochain timestamp peut être très loin).
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    if (!spritesRef.current) {
      spritesRef.current = {
        invaders: ROW_COLORS.map((color) => createSpriteCanvas(INVADER_BITMAP, color, CELL)),
        ship: createSpriteCanvas(SHIP_BITMAP, "#FFD23F", PLAYER_CELL),
      };
    }
    const sprites = spritesRef.current;

    const render = () => {
      const s = gameRef.current;
      ctx.fillStyle = "#0E0B07";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      for (const inv of s.invaders) {
        if (!inv.alive) continue;
        const x = MARGIN + s.invaderOffsetX + inv.col * (INVADER_W + GAP);
        const y = MARGIN + s.invaderOffsetY + inv.row * (INVADER_H + GAP);
        ctx.drawImage(sprites.invaders[inv.row % sprites.invaders.length], x, y);
      }

      const flashHidden =
        s.clock < s.invulnerableUntil && Math.floor(s.clock * 10) % 2 === 0;
      if (!flashHidden) {
        ctx.drawImage(sprites.ship, s.playerX, PLAYER_Y);
      }

      ctx.fillStyle = "#F3EBDD";
      s.playerBullets.forEach((b) => ctx.fillRect(b.x - 1.5, b.y, 3, 10));
      ctx.fillStyle = "#FF6B4A";
      s.enemyBullets.forEach((b) => ctx.fillRect(b.x - 1.5, b.y, 3, 10));
    };

    let last = 0;
    let rafId = 0;

    const loop = (t: number) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 1000, MAX_DT);
      last = t;

      const result = updateGame(gameRef.current, dt);
      if (result.scoreDelta) setScore((v) => v + result.scoreDelta);

      if (result.lifeLost) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          render();
          setPhase("gameover");
          return;
        }
      }

      if (result.invasionReachedBottom) {
        render();
        setPhase("gameover");
        return;
      }

      render();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between rounded-t-lg border-2 border-b-0 border-arcade-border-thick bg-arcade-bg px-3 py-2">
        <span className="font-pixel text-[0.55rem] text-arcade-orange">
          1P <span className="text-arcade-cream">{String(score).padStart(5, "0")}</span>
        </span>
        <span className="font-pixel text-[0.55rem] text-arcade-orange">
          VIES{" "}
          <span className="text-arcade-cream">{"♥".repeat(Math.max(0, lives))}</span>
        </span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", maxWidth: CANVAS_W, aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
          className="block rounded-b-lg border-2 border-arcade-border-thick bg-arcade-bg-alt"
          aria-hidden
        />
        {phase === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-b-lg bg-arcade-bg/95 p-6 text-center">
            <p className="font-pixel text-sm text-arcade-gold sm:text-base">Game over</p>
            <p className="font-terminal text-2xl text-arcade-cream">Score : {score}</p>
            <button
              type="button"
              onClick={resetGame}
              className="rounded-xl border-2 border-arcade-border-thick bg-arcade-orange px-6 py-3 font-sans text-[0.6rem] text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
            >
              Rejouer
            </button>
          </div>
        )}
      </div>

      {phase === "playing" && (
        <>
          <p className="mt-3 text-center font-mono text-[0.62rem] uppercase tracking-wide text-arcade-taupe">
            ← → ou Q D pour bouger · Espace pour tirer
          </p>
          <div className="mt-3 flex w-full items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onPointerDown={() => (gameRef.current.keys.left = true)}
                onPointerUp={() => (gameRef.current.keys.left = false)}
                onPointerLeave={() => (gameRef.current.keys.left = false)}
                onPointerCancel={() => (gameRef.current.keys.left = false)}
                aria-label="Déplacer à gauche"
                className="flex h-12 w-12 touch-none items-center justify-center rounded-xl border-2 border-arcade-border-thick bg-arcade-card font-sans text-arcade-cream active:bg-arcade-bg-alt"
              >
                ◀
              </button>
              <button
                type="button"
                onPointerDown={() => (gameRef.current.keys.right = true)}
                onPointerUp={() => (gameRef.current.keys.right = false)}
                onPointerLeave={() => (gameRef.current.keys.right = false)}
                onPointerCancel={() => (gameRef.current.keys.right = false)}
                aria-label="Déplacer à droite"
                className="flex h-12 w-12 touch-none items-center justify-center rounded-xl border-2 border-arcade-border-thick bg-arcade-card font-sans text-arcade-cream active:bg-arcade-bg-alt"
              >
                ▶
              </button>
            </div>
            <button
              type="button"
              onPointerDown={tryFire}
              aria-label="Tirer"
              className="flex h-12 touch-none items-center justify-center rounded-xl border-2 border-arcade-border-thick bg-arcade-orange px-6 font-sans text-[0.6rem] text-arcade-bg shadow-[3px_3px_0_#FFD23F] active:translate-y-0.5"
            >
              TIR
            </button>
          </div>
        </>
      )}
    </div>
  );
}
