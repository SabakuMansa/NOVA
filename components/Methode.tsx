import { methode } from "@/content/site";
import Reveal from "./Reveal";

const icons: Record<string, JSX.Element> = {
  Visibilité: (
    <>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  Autonomie: (
    <>
      <path d="M12 3v6m0 0 3-3m-3 3L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  Automatisation: (
    <>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 4v2m0 12v2m8-8h-2M6 12H4m12.5-5.5-1.4 1.4M8.9 15.1l-1.4 1.4m9-9-1.4 1.4M8.9 8.9 7.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export default function Methode() {
  return (
    <section id={methode.id} className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
          {methode.eyebrow}
        </p>
        <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-cafe sm:text-5xl md:text-[3.4rem]">
          Trois choses que votre digital doit faire.{" "}
          <span className="display-em text-lie">Rien de plus</span>.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {methode.pillars.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-cafe/10 bg-craie/50 p-8 transition-all hover:-translate-y-1 hover:border-moutarde/40 hover:shadow-[0_20px_40px_-24px_rgba(46,37,33,0.5)]">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-8 font-display text-[7rem] leading-none text-cafe/[0.05]"
              >
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cafe text-moutarde">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                  {icons[p.name]}
                </svg>
              </span>
              <h3 className="mt-6 font-display text-2xl text-cafe">{p.name}</h3>
              <p className="mt-3 font-sans leading-relaxed text-cafe/75">
                {p.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
