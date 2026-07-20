"use client";

import { useEffect } from "react";

/**
 * Frontière d'erreur (App Router) — habillage DA v3. Si un composant client
 * lève une erreur, l'utilisateur voit cette page au lieu d'un écran blanc.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("K1000 Studio — erreur de rendu :", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-lait px-6 text-center text-encre">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-wide shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
        Une erreur est survenue
      </p>
      <h1 className="mt-6 max-w-lg font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        Quelque chose n'a pas fonctionné.
      </h1>
      <p className="mt-4 max-w-md font-sans text-lg text-encre/70">
        Pas d'inquiétude, ça arrive. Réessayez, ou revenez à l'accueil.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border-2 border-encre bg-corail px-7 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="rounded-xl border-2 border-encre bg-white px-7 py-3.5 font-sans text-base font-bold text-encre shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
        >
          Retour à l'accueil
        </a>
      </div>
    </main>
  );
}
