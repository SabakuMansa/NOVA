"use client";

import { useState } from "react";
import Link from "next/link";
import ProductPhoto from "@/components/exemples/boutique/ProductPhoto";
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
      <span className="font-nord-sans text-[13px] uppercase tracking-[0.22em] text-nord-camel">
        {catalogue.eyebrow}
      </span>
      <h1 className="mt-4 font-nord-display text-4xl text-nord-ink sm:text-5xl">
        {catalogue.title}
      </h1>
      <p className="mt-4 max-w-xl font-nord-sans text-lg text-nord-muted">
        {catalogue.subtitle}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {catalogue.categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCategory(c)}
            className={`border px-4 py-1.5 font-nord-sans text-[13px] uppercase tracking-[0.08em] transition-colors ${
              activeCategory === c
                ? "border-nord-ink bg-nord-ink text-nord-bg"
                : "border-nord-border text-nord-muted hover:border-nord-ink hover:text-nord-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <div key={p.slug} className="flex flex-col">
            <Link href={`/exemples/boutique/produit/${p.slug}`}>
              <ProductPhoto
                slug={p.slug}
                label={p.name}
                className="aspect-[4/5] w-full"
              />
            </Link>
            <Link
              href={`/exemples/boutique/produit/${p.slug}`}
              className="mt-4 font-nord-display text-lg text-nord-ink hover:underline"
            >
              {p.name}
            </Link>
            <p className="mt-1 font-nord-sans text-sm leading-relaxed text-nord-muted">
              {p.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="font-nord-sans text-base font-semibold text-nord-ink">
                {p.price}€
              </span>
              <QuantitySelector
                value={qtyFor(p.slug)}
                onChange={(qty) =>
                  setQuantities((q) => ({ ...q, [p.slug]: qty }))
                }
                variant="nord"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAdd(p.slug)}
              className="mt-3 w-full border border-nord-ink bg-nord-ink px-4 py-2.5 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink"
            >
              {justAdded === p.slug ? "✓ Ajouté" : "Ajouter"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
