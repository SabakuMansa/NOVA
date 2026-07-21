"use client";

import { useState } from "react";
import Link from "next/link";
import { productPhotoUrl } from "@/components/exemples/boutique/productPhotos";
import QuantitySelector from "@/components/exemples/QuantitySelector";
import { boutiqueDemo } from "@/content/exemples/boutique";

// Mono flourish (Space Mono) appliqué en inline style — jamais de token
// Tailwind dédié, cf. app/exemples/boutique/layout.tsx.
const monoStyle = { fontFamily: "var(--font-nord-mono)" };

export default function BoutiqueAccueilPage() {
  const { accueil, business, produitVedette, products } = boutiqueDemo;
  const [qty, setQty] = useState(1);

  const featured = products.find((p) => p.slug === produitVedette.slug)!;
  const cartExtra = products.find(
    (p) => p.slug === produitVedette.panierApercu.itemSlug,
  )!;
  // Total de l'aperçu panier statique — calculé depuis le vrai catalogue
  // (jamais de montant codé en dur), indépendant du sélecteur de quantité
  // interactif ci-dessous (mockup de design, pas un vrai panier).
  const cartTotal =
    featured.price * 1 + cartExtra.price * produitVedette.panierApercu.itemQty;

  return (
    <>
      {/* HERO — recréation fidèle du design handoff "Unit—9" (21/07),
          adaptée à l'identité déjà établie du Petit Atelier (savonnerie/
          bougies, pas de streetwear). Univers sombre + vert acide,
          intentionnellement en rupture avec la palette claire "nord-*" du
          reste de la démo (catalogue/panier/produit/confirmation, laissés
          inchangés) — cf. brief du 21/07. */}
      <section className="relative min-h-[480px] overflow-hidden bg-[#18181c] sm:h-[540px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.62]"
          style={{ backgroundImage: `url('${accueil.heroImage}')` }}
          role="img"
          aria-label={accueil.heroImageAlt}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,16,18,0.45), rgba(16,16,18,0.3) 40%, rgba(16,16,18,0.95))",
          }}
        />
        <div
          className="absolute right-5 top-5 text-right text-[10px] leading-[1.8] text-[#c8ff3d] sm:right-6 sm:top-6"
          style={monoStyle}
        >
          {accueil.heroCoordinates}
          <br />
          {accueil.heroLocation}
        </div>
        <div className="absolute inset-x-0 bottom-0 px-6 pb-9 sm:px-12 sm:pb-12">
          <div
            className="mb-3 text-[11px] tracking-[0.1em] text-[#c8ff3d] sm:mb-3.5"
            style={monoStyle}
          >
            {accueil.heroBadge}
          </div>
          <h1 className="font-nord-display text-[15vw] font-bold leading-[0.86] tracking-[-0.03em] text-[#f2f2f0] sm:text-6xl md:text-7xl lg:text-[78px]">
            {accueil.heroTitleLine1}
            <br />
            {accueil.heroTitleLine2}
          </h1>
          <p className="mt-4 max-w-[380px] font-nord-sans text-sm leading-relaxed text-[#a9a9ad] sm:mt-5">
            {accueil.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-6">
            <Link
              href="#produit-du-moment"
              className="motion-safe:transition-transform bg-[#c8ff3d] px-7 py-3.5 font-nord-display text-[12px] font-bold tracking-[0.04em] text-[#101012] motion-safe:hover:-translate-y-0.5"
            >
              {accueil.heroCtaPrimary}
            </Link>
            <Link
              href="/exemples/boutique/catalogue"
              className="lowercase border border-[#3a3a40] px-6 py-3.5 text-[12px] text-[#f2f2f0] transition-colors hover:border-[#f2f2f0]"
              style={monoStyle}
            >
              {accueil.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* MODULE CLÉ — recréation fidèle de la fiche produit + aperçu panier
          du zip, avec un vrai produit du catalogue (bougie) et un
          sélecteur de quantité (composant partagé QuantitySelector, variant
          "unit9" — pas de sélecteur de taille, sans objet pour du savon/
          des bougies). Aperçu panier composé de 2 produits réels, total
          calculé depuis le catalogue. */}
      <section
        id="produit-du-moment"
        className="bg-[#101012] px-5 py-14 sm:px-11 sm:py-16"
      >
        <div className="mx-auto max-w-content">
          <div className="flex flex-col gap-7 sm:flex-row sm:gap-6">
            <div
              className="h-[280px] w-full shrink-0 rounded-[4px] bg-cover bg-center sm:h-[250px] sm:w-[200px]"
              style={{
                backgroundImage: `url('${productPhotoUrl(featured.slug, 500)}')`,
              }}
              role="img"
              aria-label={featured.name}
            />
            <div className="flex flex-1 flex-col">
              <div
                className="text-[10px] tracking-[0.06em] text-[#c8ff3d]"
                style={monoStyle}
              >
                {produitVedette.label}
              </div>
              <div className="mt-1.5 font-nord-display text-2xl font-semibold tracking-[-0.01em] text-[#f2f2f0]">
                {featured.name}
              </div>
              <div className="mb-4 mt-1 font-nord-display text-[22px] font-bold text-[#c8ff3d]">
                {featured.price} €
              </div>
              <div className="mb-5">
                <QuantitySelector value={qty} onChange={setQty} variant="unit9" />
              </div>
              <Link
                href={`/exemples/boutique/produit/${featured.slug}`}
                className="block bg-[#c8ff3d] py-3.5 text-center font-nord-display text-[12px] font-bold uppercase tracking-[0.04em] text-[#101012] transition-opacity hover:opacity-90"
              >
                {produitVedette.ctaLabel}
              </Link>
            </div>
          </div>

          {/* Aperçu panier — mockup visuel statique, non branché sur le
              CartContext réel (cf. brief : recréation de design, pas
              d'intégration panier fonctionnelle sur ce module). */}
          <div className="mt-6 rounded-[6px] border border-[#26262a] p-4 sm:p-[18px]">
            <div className="mb-2.5 flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.08em] text-[#8a8a90]"
                style={monoStyle}
              >
                {produitVedette.panierApercu.label}
              </span>
              <span className="font-nord-display text-xl font-bold text-[#f2f2f0]">
                {cartTotal} €
              </span>
            </div>
            <div className="flex items-center gap-3 border-t border-[#1c1c20] pt-2">
              <div
                className="h-11 w-11 shrink-0 rounded-[4px] bg-cover bg-center"
                style={{
                  backgroundImage: `url('${productPhotoUrl(cartExtra.slug, 200)}')`,
                }}
                role="img"
                aria-label={cartExtra.name}
              />
              <div className="flex-1">
                <div className="font-nord-display text-[13px] text-[#f2f2f0]">
                  {cartExtra.name}
                </div>
                <div
                  className="text-[10px] text-[#8a8a90]"
                  style={monoStyle}
                >
                  QTY {produitVedette.panierApercu.itemQty}
                </div>
              </div>
              <span className="font-nord-display text-sm text-[#c8ff3d]">
                {cartExtra.price * produitVedette.panierApercu.itemQty} €
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Points forts + fiche Google Business — hors du périmètre de la
          recréation hero+module (accueil.highlights inchangé) : reste sur
          la palette claire "nord-*" existante, comme le reste des
          sous-pages de la démo. */}
      <section className="mx-auto max-w-content px-5 pt-12 pb-2 md:px-8">
        <ul className="mb-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {accueil.highlights.map((h) => (
            <li
              key={h.text}
              className="flex items-center gap-2 font-nord-sans text-[15px] text-nord-muted"
            >
              <span className="text-lg" aria-hidden>
                {h.icon}
              </span>
              {h.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-content px-5 pb-16 md:px-8 md:pb-24">
        <div className="flex flex-wrap items-center gap-4 border border-nord-border bg-nord-bg-alt p-5 sm:p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-nord-camel text-xl text-nord-bg"
            aria-hidden
          >
            ⭐
          </span>
          <div>
            <p className="font-nord-display text-lg text-nord-ink">
              Fiche Google Business
            </p>
            <p className="font-nord-sans text-[15px] text-nord-muted">
              {business.googleRating} · {business.googleReviews} avis — mise
              en avant directement depuis le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
