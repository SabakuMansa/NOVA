import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomePrestationsPage() {
  const { prestations } = autonomeDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
        {prestations.eyebrow}
      </p>
      <h1 className="mt-6 font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
        {prestations.title}
      </h1>
      <p className="mt-4 max-w-xl font-terminal text-xl text-arcade-tan">
        {prestations.subtitle}
      </p>

      <div className="mt-10 divide-y divide-arcade-border overflow-hidden rounded-xl border border-arcade-border bg-arcade-card">
        {prestations.services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-4 p-5 sm:p-6"
          >
            <div>
              <p className="font-terminal text-lg font-bold text-arcade-cream">
                {s.name}
              </p>
              <p className="font-terminal text-base text-arcade-tan">
                {s.duration}
              </p>
            </div>
            <span className="font-pixel text-sm text-violet">{s.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
