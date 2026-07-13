import type { Metadata } from "next";
import SignatureBackdrop from "@/components/signature/SignatureBackdrop";
import SignatureTitle from "@/components/signature/SignatureTitle";

// Pièce signature isolée — non indexée (page de test, hors site public).
export const metadata: Metadata = {
  title: "Pièce signature",
  robots: { index: false, follow: false },
};

export default function SignaturePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cafe text-nappe">
      {/* Fond WebGL / CSS / statique (dégradation gracieuse) */}
      <SignatureBackdrop />

      {/* Contenu — au-dessus du fond, réellement dans le DOM */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-5 py-24 md:px-10">
        <div className="mx-auto w-full max-w-content">
          <p className="sig-word font-mono text-[0.7rem] uppercase tracking-eyebrow text-moutarde">
            NOVA Studio · Pièce signature
          </p>

          <div className="mt-8">
            <SignatureTitle />
          </div>

          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-nappe/75">
            Conçu par un restaurateur, pour les commerçants d'Île-de-France.
            Un site qui bosse pour vous, même quand vous n'avez pas une minute.
          </p>

          <p className="mt-12 hidden font-mono text-[0.62rem] uppercase tracking-eyebrow text-nappe/40 md:block">
            Bougez le curseur — l'ardoise réagit
          </p>
        </div>
      </div>

      {/* Retour au site */}
      <a
        href="/"
        className="absolute left-5 top-6 z-10 font-mono text-[0.62rem] uppercase tracking-wide text-nappe/60 transition-colors hover:text-nappe md:left-10"
      >
        ← Retour au site
      </a>
    </main>
  );
}
