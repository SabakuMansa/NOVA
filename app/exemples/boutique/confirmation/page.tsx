import Link from "next/link";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiqueConfirmationPage() {
  const { confirmation } = boutiqueDemo;

  return (
    <section className="mx-auto flex max-w-content flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full border border-nord-ink text-2xl text-nord-ink"
        aria-hidden
      >
        ✓
      </span>
      <span className="mt-6 font-nord-sans text-[13px] uppercase tracking-[0.22em] text-nord-camel">
        {confirmation.eyebrow}
      </span>
      <h1 className="mt-4 font-nord-display text-3xl text-nord-ink sm:text-4xl">
        {confirmation.title}
      </h1>
      <p className="mt-4 max-w-md font-nord-sans text-lg text-nord-muted">
        {confirmation.subtitle}
      </p>
      <Link
        href="/exemples/boutique/catalogue"
        className="mt-8 inline-flex items-center justify-center gap-2 border border-nord-ink bg-nord-ink px-6 py-3.5 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink"
      >
        {confirmation.backCta}
      </Link>
    </section>
  );
}
