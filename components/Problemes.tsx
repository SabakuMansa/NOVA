import { problemes } from "@/content/site";
import Reveal from "./Reveal";

export default function Problemes() {
  return (
    <section id={problemes.id} className="bg-cafe text-nappe">
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-moutarde">
            {problemes.eyebrow}
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-[3.4rem]">
            Le vrai coût d'un site qui{" "}
            <span className="display-em text-moutarde">ne travaille pas pour vous</span>.
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-lg text-nappe/70">
            {problemes.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {problemes.cards.map((card, i) => (
            <Reveal key={card.tag} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-nappe/12 bg-nappe/[0.03] p-7 transition-colors hover:border-moutarde/50 hover:bg-nappe/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-moutarde">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-nappe/50">
                    {card.tag}
                  </span>
                </div>
                <p className="mt-4 font-sans text-lg leading-snug text-nappe/90">
                  {card.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
