import Reveal from "@/components/Reveal";

/**
 * En-tête de page minimal — assure UN SEUL <h1> par page /v2 (les sections
 * réutilisées du one-page n'ont que des <h2>). `label` reprend le libellé déjà
 * établi dans content.nav.links (aucune nouvelle formulation marketing).
 */
export default function PageHeader({ label }: { label: string }) {
  return (
    <div className="border-b border-cafe/10 bg-craie/30">
      <div className="mx-auto max-w-content px-5 py-10 md:px-8 md:py-14">
        <Reveal>
          <p className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-lie">
            NOVA Studio
          </p>
          <h1 className="mt-2 font-display text-3xl text-cafe sm:text-4xl">
            {label}
          </h1>
        </Reveal>
      </div>
    </div>
  );
}
