import { temoignages } from "@/content/site";
import Reveal from "./Reveal";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill={i < rating ? "#C89B3C" : "none"}
          stroke="#C89B3C"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="m10 1.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 20l-5.3 2.8 1-5.8L1.5 8.7l5.9-.9L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Temoignages() {
  return (
    <section id={temoignages.id} className="bg-sauge/[0.06] py-24 md:py-32">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-sauge">
              {temoignages.eyebrow}
            </p>
            <h2 className="mt-6 font-display text-4xl leading-tight text-cafe sm:text-5xl md:text-[3.4rem]">
              Ce qu'en disent les{" "}
              <span className="display-em text-lie">commerçants</span>.
            </h2>
            <p className="mt-4 font-sans text-lg text-cafe/70">
              {temoignages.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {temoignages.items.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-cafe/10 bg-nappe p-7 shadow-[0_18px_40px_-30px_rgba(46,37,33,0.5)]">
                <Stars rating={t.rating} />
                <blockquote className="mt-5 flex-1 font-display text-xl italic leading-snug text-cafe">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-6 border-t border-cafe/10 pt-4">
                  <p className="font-sans text-sm font-medium text-cafe">
                    {t.author}
                  </p>
                  <p className="font-mono text-[0.62rem] uppercase tracking-wide text-cafe/55">
                    {t.business} · {t.city}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
