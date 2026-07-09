import { process } from "@/content/site";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id={process.id} className="bg-cafe text-nappe">
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-moutarde">
            {process.eyebrow}
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-[3.4rem]">
            Ce qui se passe après que vous ayez cliqué sur{" "}
            <span className="display-em text-moutarde">ce bouton</span>.
          </h2>
        </Reveal>

        {/* Timeline : verticale mobile / grille desktop */}
        <ol className="mt-16 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {process.steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 0.06}>
              <div className="relative h-full">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-moutarde/40 font-mono text-sm text-moutarde">
                    {step.n}
                  </span>
                  <span className="h-px flex-1 bg-nappe/15" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{step.name}</h3>
                <p className="mt-2 font-sans leading-relaxed text-nappe/70">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
