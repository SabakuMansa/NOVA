/**
 * Illustrations SVG maison (aucune photo stock), cohérentes avec la palette.
 * Utilisées dans le configurateur comme "image" de la maquette.
 */

type MotifProps = { color: string; ink: string };

export function MotifPlate({ color, ink }: MotifProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="200" height="140" fill={ink} opacity="0.04" />
      <circle cx="100" cy="70" r="46" stroke={ink} strokeWidth="2" opacity="0.35" />
      <circle cx="100" cy="70" r="32" fill={color} opacity="0.9" />
      <path d="M100 52c-8 0-12 8-12 18s5 16 12 16 12-6 12-16-4-18-12-18Z" fill={ink} opacity="0.22" />
      <rect x="42" y="40" width="4" height="60" rx="2" fill={ink} opacity="0.4" />
      <rect x="154" y="40" width="4" height="60" rx="2" fill={ink} opacity="0.4" />
      <rect x="150" y="40" width="12" height="26" rx="6" fill={ink} opacity="0.4" />
    </svg>
  );
}

export function MotifBag({ color, ink }: MotifProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="200" height="140" fill={ink} opacity="0.04" />
      <path d="M64 52h72l8 62a6 6 0 0 1-6 7H62a6 6 0 0 1-6-7l8-62Z" fill={color} opacity="0.9" />
      <path d="M82 58V44a18 18 0 0 1 36 0v14" stroke={ink} strokeWidth="3" opacity="0.5" strokeLinecap="round" />
      <circle cx="80" cy="70" r="3" fill={ink} opacity="0.5" />
      <circle cx="120" cy="70" r="3" fill={ink} opacity="0.5" />
    </svg>
  );
}

export function MotifTools({ color, ink }: MotifProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="200" height="140" fill={ink} opacity="0.04" />
      <path d="M70 44l30 30-14 14-30-30a10 10 0 0 1 14-14Z" fill={color} opacity="0.9" />
      <rect x="92" y="66" width="46" height="12" rx="6" transform="rotate(45 92 66)" fill={ink} opacity="0.35" />
      <circle cx="132" cy="52" r="12" stroke={ink} strokeWidth="3" opacity="0.45" />
      <path d="M124 96l20 20" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function MotifHeart({ color, ink }: MotifProps) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="200" height="140" fill={ink} opacity="0.04" />
      <path
        d="M100 106s-38-22-38-48a20 20 0 0 1 38-9 20 20 0 0 1 38 9c0 26-38 48-38 48Z"
        fill={color}
        opacity="0.9"
      />
      <path d="M100 58a20 20 0 0 0-18-9" stroke={ink} strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export function Motif({ name, color, ink }: MotifProps & { name: string }) {
  switch (name) {
    case "bag":
      return <MotifBag color={color} ink={ink} />;
    case "tools":
      return <MotifTools color={color} ink={ink} />;
    case "heart":
      return <MotifHeart color={color} ink={ink} />;
    default:
      return <MotifPlate color={color} ink={ink} />;
  }
}
