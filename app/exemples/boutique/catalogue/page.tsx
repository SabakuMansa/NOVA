"use client";

import { useState } from "react";
import Link from "next/link";
import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import QuantitySelector from "@/components/exemples/QuantitySelector";
import { useCart } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiqueCataloguePage() {
  const { catalogue, products } = boutiqueDemo;
  const [activeCategory, setActiveCategory] =
    useState<(typeof catalogue.categories)[number]>("Tous");
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const visible =
    activeCategory === "Tous"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const qtyFor = (slug: string) => quantities[slug] ?? 1;

  const handleAdd = (slug: string) => {
    addItem(slug, qtyFor(slug));
    setQuantities((q) => ({ ...q, [slug]: 1 }));
    setJustAdded(slug);
    setTimeout(() => setJustAdded((s) => (s === slug ? null : s)), 1600);
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {catalogue.eyebrow}
      </p>
      <h1 className="mt-6 font-pixel text-2xl tracking-tight text-arcade-cream sm:text-3xl">
        {catalogue.title}
      </h1>
      <p className="mt-4 max-w-xl font-terminal text-xl text-arcade-tan">
        {catalogue.subtitle}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {catalogue.categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCategory(c)}
            className={`rounded-full border-2 border-arcade-border-thick px-4 py-1.5 font-mono text-sm font-bold transition-colors ${
              activeCategory === c
                ? "bg-jaune text-arcade-bg"
                : "bg-arcade-card text-arcade-tan hover:bg-arcade-bg-alt"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col rounded-xl border border-arcade-border bg-arcade-card p-4"
          >
            <Link href={`/exemples/boutique/produit/${p.slug}`}>
              <PlaceholderImage
                icon={p.icon}
                label={p.category}
                color={p.color}
                className="aspect-square w-full"
              />
            </Link>
            <Link
              href={`/exemples/boutique/produit/${p.slug}`}
              className="mt-4 font-terminal text-lg font-bold text-arcade-cream hover:underline"
            >
              {p.name}
            </Link>
            <p className="mt-1 font-terminal text-base text-arcade-taupe">
              {p.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="font-mono text-lg font-bold text-arcade-gold">
                {p.price}€
              </span>
              <QuantitySelector
                value={qtyFor(p.slug)}
                onChange={(qty) =>
                  setQuantities((q) => ({ ...q, [p.slug]: qty }))
                }
              />
            </div>
            <button
              type="button"
              onClick={() => handleAdd(p.slug)}
              className="mt-3 w-full rounded-xl border-2 border-arcade-border-thick bg-jaune px-4 py-2 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[3px_3px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
            >
              {justAdded === p.slug ? "✓ Ajouté" : "Ajouter"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
