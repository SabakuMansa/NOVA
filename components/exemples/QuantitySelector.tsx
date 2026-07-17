"use client";

import { useEffect, useState } from "react";

/**
 * Sélecteur de quantité "− [n] +" partagé entre le catalogue, la fiche
 * produit et le panier de la démo /exemples/boutique — un seul composant
 * pour garantir le même style et le même comportement partout. Le champ
 * central est un vrai input éditable au clavier (pas juste un affichage) ;
 * la saisie est filtrée aux chiffres en direct et clampée à [min, max] à
 * la perte du focus (vide/invalide → min). Boutons dimensionnés à 44px
 * (h-11/w-11) pour rester confortables au tactile.
 */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}) {
  const [text, setText] = useState(String(value));

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
    <div className="inline-flex items-center rounded-xl border-2 border-arcade-border-thick">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-11 w-11 shrink-0 items-center justify-center font-mono text-lg font-bold text-arcade-cream transition-colors hover:text-arcade-gold"
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
        className="h-11 w-12 shrink-0 bg-transparent text-center font-mono text-base font-bold text-arcade-cream focus:bg-arcade-bg-alt focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-11 w-11 shrink-0 items-center justify-center font-mono text-lg font-bold text-arcade-cream transition-colors hover:text-arcade-gold"
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
