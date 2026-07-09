"use client";

import { useEffect } from "react";

/**
 * Frontière d'erreur (App Router). Si un composant client lève une erreur,
 * l'utilisateur voit cette page sobre — aux couleurs du site — au lieu d'un
 * écran blanc, avec un bouton pour réessayer.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Trace en console pour le debug (visible en dev et via les logs).
    console.error("NOVA Studio — erreur de rendu :", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-nappe px-6 text-center">
      <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
        Une erreur est survenue
      </p>
      <h1 className="mt-5 max-w-lg font-display text-4xl leading-tight text-cafe sm:text-5xl">
        Quelque chose n'a pas fonctionné.
      </h1>
      <p className="mt-4 max-w-md font-sans text-lg text-cafe/70">
        Pas d'inquiétude, ça arrive. Réessayez, ou revenez à l'accueil.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-lie px-7 py-3.5 font-sans text-base font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="rounded-full border border-cafe/25 px-7 py-3.5 font-sans text-base text-cafe transition-colors hover:border-cafe hover:bg-craie/60"
        >
          Retour à l'accueil
        </a>
      </div>
    </main>
  );
}
