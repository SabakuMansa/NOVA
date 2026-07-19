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
        <QuantitySelector value={qty} onChange={setQty} variant="nord" />
        <button
          type="button"
          onClick={() => {
            addItem(slug, qty);
            setAdded(true);
          }}
          className="flex-1 border border-nord-ink bg-nord-ink px-6 py-3 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink"
        >
          {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
      {added && (
        <Link
          href="/exemples/boutique/panier"
          className="mt-3 block text-center font-nord-sans text-sm font-semibold text-nord-ink underline underline-offset-2"
        >
          Voir le panier →
        </Link>
      )}
    </div>
  );
}
