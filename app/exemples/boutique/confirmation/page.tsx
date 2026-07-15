import Link from "next/link";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiqueConfirmationPage() {
  const { confirmation } = boutiqueDemo;

  return (
    <section className="mx-auto flex max-w-content flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-encre bg-teal text-3xl text-white"
        aria-hidden
      >
        ✓
      </span>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {confirmation.eyebrow}
      </p>
      <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {confirmation.title}
      </h1>
      <p className="mt-4 max-w-md font-sans text-lg text-encre/70">
        {confirmation.subtitle}
      </p>
      <Link
        href="/exemples/boutique/catalogue"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-encre bg-jaune px-6 py-3.5 font-sans text-base font-bold text-encre shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
      >
        {confirmation.backCta} →
      </Link>
    </section>
  );
}
