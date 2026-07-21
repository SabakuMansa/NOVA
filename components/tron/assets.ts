/**
 * Chargement + mise en cache des assets image (PNG néon, glow déjà « cuit »).
 *
 * Choix PNG : le glow est baké dans l'image → aucun filtre/blur à recalculer,
 * chargement canvas-natif via `Image()`. Règle de perf ABSOLUE : on ne
 * `drawImage` JAMAIS le 2048² brut par frame. On charge chaque image une fois,
 * on la **pré-rend une fois** sur un petit canvas offscreen à la taille
 * d'affichage cible, et c'est CE cache qu'on dessine à chaque frame.
 */

// Mémoïsation des images chargées (par src) — partagée entre planètes/vaisseau.
const imageCache = new Map<string, Promise<HTMLImageElement>>();

/** Charge une image (mémoïsé). Rejette si le chargement échoue (→ fallback appelant). */
export function loadImage(src: string): Promise<HTMLImageElement> {
  const existing = imageCache.get(src);
  if (existing) return existing;
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Asset introuvable : ${src}`));
    img.src = src;
  });
  imageCache.set(src, p);
  return p;
}

/**
 * Pré-rend une image sur un canvas offscreen carré de `sizePx` (pixels device).
 * Réutilisé ensuite tel quel à chaque frame (mise à l'échelle vers le bas =
 * net). Renvoie le canvas cache.
 */
export function prerender(img: HTMLImageElement, sizePx: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(sizePx));
  c.height = Math.max(1, Math.round(sizePx));
  const cx = c.getContext("2d")!;
  cx.imageSmoothingEnabled = true;
  cx.imageSmoothingQuality = "high";
  cx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/**
 * Libère un ensemble de canvas caches (met à 0 leur taille pour aider le GC).
 * Les `HTMLImageElement` mémoïsés restent (légers, réutilisables) ; on ne vide
 * pas `imageCache` pour permettre un remontage rapide de la scène.
 */
export function disposeCaches(caches: (HTMLCanvasElement | null)[]): void {
  for (const c of caches) {
    if (!c) continue;
    c.width = 0;
    c.height = 0;
  }
}
