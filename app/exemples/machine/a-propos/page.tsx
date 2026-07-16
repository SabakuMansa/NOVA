import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { machineDemo } from "@/content/exemples/machine";

export default function MachineAProposPage() {
  const { aPropos } = machineDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
        {aPropos.eyebrow}
      </p>
      <h1 className="mt-6 max-w-2xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
        {aPropos.title}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <PlaceholderImage
          icon="👥"
          label="Photo de l'équipe / du lieu"
          color="teal"
          className="aspect-[4/3] w-full"
        />
        <div className="space-y-4">
          {aPropos.body.map((p, i) => (
            <p
              key={i}
              className="font-terminal text-xl leading-relaxed text-arcade-tan"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {aPropos.values.map((v) => (
          <div
            key={v.title}
            className="h-full rounded-xl border border-arcade-border bg-arcade-card p-5"
          >
            <h3 className="font-pixel text-sm leading-relaxed text-arcade-cream">
              {v.title}
            </h3>
            <p className="mt-3 font-terminal text-base leading-relaxed text-arcade-tan">
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
