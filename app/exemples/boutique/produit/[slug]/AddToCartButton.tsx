"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/exemples/CartContext";

export default function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border-2 border-encre">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 font-sans text-lg font-bold text-encre"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="min-w-[2ch] text-center font-sans text-base font-bold text-encre">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="px-3 py-2 font-sans text-lg font-bold text-encre"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(slug, qty);
            setAdded(true);
          }}
          className="flex-1 rounded-xl border-2 border-encre bg-jaune px-6 py-3 font-sans text-base font-bold text-encre shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
        >
          {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
      {added && (
        <Link
          href="/exemples/boutique/panier"
          className="mt-3 block text-center font-sans text-sm font-bold text-encre underline underline-offset-2"
        >
          Voir le panier →
        </Link>
      )}
    </div>
  );
}
