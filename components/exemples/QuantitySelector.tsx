"use client";

import { useEffect, useState } from "react";

/**
 * Sélecteur de quantité "− [n] +" partagé entre le catalogue, la fiche
 * produit et le panier de la démo /exemples/boutique — un seul composant
 * pour garantir le même comportement partout. Le champ central est un vrai
 * input éditable au clavier (pas juste un affichage) ; la saisie est
 * filtrée aux chiffres en direct et clampée à [min, max] à la perte du
 * focus (vide/invalide → min). Boutons dimensionnés à 44px (h-11/w-11)
 * pour rester confortables au tactile.
 *
 * `variant` sélectionne l'habillage visuel uniquement (comportement
 * identique) : "arcade" (défaut, historique) ou "nord" (démo Boutique,
 * maquette "Atelier Nord" — jamais de token arcade-* dans cette démo).
 */
const VARIANTS = {
  arcade: {
    wrapper: "inline-flex items-center rounded-xl border-2 border-arcade-border-thick",
    button:
      "flex h-11 w-11 shrink-0 items-center justify-center font-mono text-lg font-bold text-arcade-cream transition-colors hover:text-arcade-gold",
    input:
      "h-11 w-12 shrink-0 bg-transparent text-center font-mono text-base font-bold text-arcade-cream focus:bg-arcade-bg-alt focus:outline-none",
  },
  nord: {
    wrapper: "inline-flex items-center border border-nord-border",
    button:
      "flex h-11 w-11 shrink-0 items-center justify-center font-nord-sans text-lg text-nord-ink transition-colors hover:text-nord-camel",
    input:
      "h-11 w-12 shrink-0 bg-transparent text-center font-nord-sans text-base font-medium text-nord-ink focus:bg-nord-bg-alt focus:outline-none",
  },
} as const;

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  variant = "arcade",
}: {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  variant?: keyof typeof VARIANTS;
}) {
  const [text, setText] = useState(String(value));
  const styles = VARIANTS[variant];

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    const clamped = Number.isFinite(parsed)
      ? Math.min(max, Math.max(min, parsed))
      : min;
    setText(String(clamped));
    if (clamped !== value) onChange(clamped);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={styles.button}
        aria-label="Diminuer la quantité"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={(e) => setText(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        aria-label="Quantité"
        className={styles.input}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={styles.button}
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
