"use client";

import { useState } from "react";
import Link from "next/link";
import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { useCart } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiqueCataloguePage() {
  const { catalogue, products } = boutiqueDemo;
  const [activeCategory, setActiveCategory] =
    useState<(typeof catalogue.categories)[number]>("Tous");
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const visible =
    activeCategory === "Tous"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAdd = (slug: string) => {
    addItem(slug);
    setJustAdded(slug);
    setTimeout(() => setJustAdded((s) => (s === slug ? null : s)), 1600);
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {catalogue.eyebrow}
      </p>
      <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {catalogue.title}
      </h1>
      <p className="mt-4 max-w-xl font-sans text-lg text-encre/70">
        {catalogue.subtitle}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {catalogue.categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCategory(c)}
            className={`rounded-full border-2 border-encre px-4 py-1.5 font-sans text-sm font-bold transition-colors ${
              activeCategory === c
                ? "bg-encre text-lait"
                : "bg-white text-encre hover:bg-encre/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <div key={p.slug} className="v3-card flex flex-col p-4">
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
              className="mt-4 font-sans text-base font-bold text-encre hover:underline"
            >
              {p.name}
            </Link>
            <p className="mt-1 font-sans text-sm text-encre/60">
              {p.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-encre">
                {p.price}€
              </span>
              <button
                type="button"
                onClick={() => handleAdd(p.slug)}
                className="rounded-xl border-2 border-encre bg-jaune px-4 py-2 font-sans text-sm font-bold text-encre shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
              >
                {justAdded === p.slug ? "✓ Ajouté" : "Ajouter"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
