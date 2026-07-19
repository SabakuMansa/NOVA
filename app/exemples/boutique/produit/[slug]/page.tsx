import { notFound } from "next/navigation";
import ProductPhoto from "@/components/exemples/boutique/ProductPhoto";
import { boutiqueDemo } from "@/content/exemples/boutique";
import AddToCartButton from "./AddToCartButton";

export function generateStaticParams() {
  return boutiqueDemo.products.map((p) => ({ slug: p.slug }));
}

export default function BoutiqueProduitPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = boutiqueDemo.products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <ProductPhoto
          slug={product.slug}
          label={product.name}
          width={1000}
          className="aspect-square w-full"
        />
        <div>
          <span className="font-nord-sans text-[13px] uppercase tracking-[0.22em] text-nord-camel">
            {product.category}
          </span>
          <h1 className="mt-5 font-nord-display text-3xl text-nord-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 font-nord-sans text-2xl font-semibold text-nord-ink">
            {product.price}€
          </p>
          <p className="mt-5 max-w-md font-nord-sans text-lg leading-relaxed text-nord-muted">
            {product.description}
          </p>

          <AddToCartButton slug={product.slug} />
        </div>
      </div>
    </section>
  );
}
