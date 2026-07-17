"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/exemples/CartContext";
import QuantitySelector from "@/components/exemples/QuantitySelector";

export default function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} />
        <button
          type="button"
          onClick={() => {
            addItem(slug, qty);
            setAdded(true);
          }}
          className="flex-1 rounded-xl border-2 border-arcade-border-thick bg-jaune px-6 py-3 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
        >
          {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
      {added && (
        <Link
          href="/exemples/boutique/panier"
          className="mt-3 block text-center font-mono text-sm font-bold text-arcade-cream underline underline-offset-2"
        >
          Voir le panier →
        </Link>
      )}
    </div>
  );
}
