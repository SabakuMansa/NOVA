import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/exemples/PlaceholderImage";
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
        <PlaceholderImage
          icon={product.icon}
          label={product.category}
          color={product.color}
          className="aspect-square w-full"
        />
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
            <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
            {product.category}
          </p>
          <h1 className="mt-6 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 font-mono text-2xl font-bold text-encre">
            {product.price}€
          </p>
          <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-encre/75">
            {product.description}
          </p>

          <AddToCartButton slug={product.slug} />
        </div>
      </div>
    </section>
  );
}
