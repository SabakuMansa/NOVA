"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { process } from "@/content/site";
import Reveal from "./Reveal";

type Step = (typeof process.steps)[number];

// Une étape : s'allume (opacité 40 % → 100 %) quand la ligne de progression
// l'atteint. Pilotée par transform/opacity uniquement (pas de width/height).
function TimelineStep({
  step,
  index,
  total,
  progress,
  reduce,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const point = (index + 0.5) / total;
  const opacity = useTransform(progress, [point - 0.12, point], [0.4, 1]);

  return (
    <motion.li
      style={reduce ? undefined : { opacity }}
      className="relative grid grid-cols-[3rem_1fr] items-start gap-5"
    >
      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-moutarde/50 bg-cafe font-mono text-sm text-moutarde">
        {step.n}
      </span>
      <div className="pt-1.5">
        <h3 className="font-display text-2xl">{step.name}</h3>
        <p className="mt-1.5 max-w-md font-sans leading-relaxed text-nappe/70">
          {step.text}
        </p>
      </div>
    </motion.li>
  );
}

export default function Process() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Progression du scroll À L'INTÉRIEUR de cette section précise.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  const total = process.steps.length;

  return (
    <section id={process.id} className="relative bg-cafe text-nappe">
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

        {/* Timeline verticale à progression liée au scroll */}
        <div ref={ref} className="relative mt-16 max-w-2xl">
          {/* Rail de fond */}
          <span
            aria-hidden
            className="absolute bottom-6 left-6 top-6 w-px bg-nappe/15"
          />
          {/* Rail rempli (scaleY = progression) — transform only */}
          <motion.span
            aria-hidden
            className="absolute bottom-6 left-6 top-6 w-px origin-top bg-moutarde"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
          />

          <ol className="space-y-10">
            {process.steps.map((step, i) => (
              <TimelineStep
                key={step.n}
                step={step}
                index={i}
                total={total}
                progress={scrollYProgress}
                reduce={!!reduce}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
