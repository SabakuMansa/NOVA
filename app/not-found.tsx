import Link from "next/link";

// 404 personnalisée — DA v3, cohérente avec le reste du site.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-lait px-6 text-center text-encre">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-wide shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        Erreur 404
      </p>
      <h1 className="mt-6 font-sans text-5xl font-extrabold tracking-tight sm:text-6xl">
        Cette page n'est pas à la carte.
      </h1>
      <p className="mt-4 max-w-md font-sans text-lg text-encre/70">
        L'adresse a peut-être changé, ou elle n'a jamais existé. Le reste du
        site, lui, tourne.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl border-2 border-encre bg-corail px-7 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
      >
        Retour à l'accueil →
      </Link>
    </main>
  );
}
