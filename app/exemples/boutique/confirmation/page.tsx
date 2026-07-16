import Link from "next/link";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiqueConfirmationPage() {
  const { confirmation } = boutiqueDemo;

  return (
    <section className="mx-auto flex max-w-content flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-arcade-border-thick bg-teal text-3xl text-arcade-bg"
        aria-hidden
      >
        ✓
      </span>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {confirmation.eyebrow}
      </p>
      <h1 className="mt-6 font-pixel text-2xl tracking-tight text-arcade-cream sm:text-3xl">
        {confirmation.title}
      </h1>
      <p className="mt-4 max-w-md font-terminal text-xl text-arcade-tan">
        {confirmation.subtitle}
      </p>
      <Link
        href="/exemples/boutique/catalogue"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-jaune px-6 py-3.5 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
      >
        {confirmation.backCta} →
      </Link>
    </section>
  );
}
