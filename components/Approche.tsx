import { approche } from "@/content/site";
import Reveal from "./Reveal";

export default function Approche() {
  return (
    <section id={approche.id} className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Portrait typographique / signature */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
              {approche.eyebrow}
            </p>
            <div className="mt-8 aspect-[4/5] max-w-xs overflow-hidden rounded-2xl bg-craie ring-1 ring-cafe/10">
              {/* Devanture de bistrot (illustration maison, sans photo stock) :
                  enseigne, store à rayures festonné, vitrine éclairée, porte. */}
              <svg viewBox="0 0 320 400" className="h-full w-full" aria-hidden>
                {/* Façade */}
                <rect width="320" height="400" fill="#EDE2CE" />
                <rect x="0" y="150" width="320" height="250" fill="#E4D7BE" />

                {/* Bandeau enseigne */}
                <rect x="0" y="44" width="320" height="52" fill="#2E2521" />
                <text x="160" y="79" textAnchor="middle" fill="#C89B3C" fontFamily="Georgia, serif" fontSize="26" fontStyle="italic" letterSpacing="1">
                  Le Bistrot
                </text>

                {/* Store à rayures avec bord festonné */}
                <g>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <rect
                      key={i}
                      x={i * 40}
                      y="96"
                      width="40"
                      height="34"
                      fill={i % 2 === 0 ? "#7A2E2E" : "#F5EEE1"}
                    />
                  ))}
                  {/* festons */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M${i * 40} 130 Q${i * 40 + 20} 150 ${i * 40 + 40} 130 Z`}
                      fill={i % 2 === 0 ? "#7A2E2E" : "#F5EEE1"}
                    />
                  ))}
                </g>

                {/* Vitrine éclairée (gauche) */}
                <rect x="34" y="178" width="128" height="150" rx="4" fill="#2E2521" />
                <rect x="42" y="186" width="112" height="134" rx="2" fill="#F6E7C2" />
                <line x1="98" y1="186" x2="98" y2="320" stroke="#2E2521" strokeWidth="3" />
                <line x1="42" y1="252" x2="154" y2="252" stroke="#2E2521" strokeWidth="3" />
                {/* petite table + tasse en vitrine */}
                <circle cx="70" cy="300" r="9" fill="#6E7B58" />
                <rect x="120" y="292" width="18" height="14" rx="3" fill="#7A2E2E" />

                {/* Porte (droite) */}
                <rect x="180" y="178" width="106" height="150" rx="4" fill="#2E2521" />
                <rect x="188" y="186" width="90" height="134" rx="2" fill="#E4D7BE" />
                <rect x="196" y="196" width="74" height="54" rx="2" fill="#F6E7C2" />
                <circle cx="200" cy="258" r="4" fill="#C89B3C" />

                {/* Pancarte « Ouvert » suspendue */}
                <line x1="243" y1="196" x2="243" y2="206" stroke="#2E2521" strokeWidth="2" />
                <rect x="216" y="206" width="54" height="20" rx="4" fill="#7A2E2E" />
                <text x="243" y="220" textAnchor="middle" fill="#F5EEE1" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="1.5">
                  OUVERT
                </text>

                {/* Seuil / trottoir */}
                <rect x="0" y="328" width="320" height="14" fill="#2E2521" opacity="0.55" />
                <rect x="0" y="342" width="320" height="58" fill="#D8C9AC" />
              </svg>
            </div>
            <ul className="mt-6 space-y-2">
              {approche.credibility.map((c) => (
                <li key={c} className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wide text-cafe/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-sauge" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Texte */}
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl leading-tight text-cafe sm:text-5xl md:text-[3.4rem]">
            Ce n'est pas une agence qui a lu sur les restaurants. C'est{" "}
            <span className="display-em text-lie">moi qui les gère</span>.
          </h2>
          <p className="mt-8 font-sans text-lg leading-relaxed text-cafe/80">
            {approche.intro}
          </p>
          <ul className="mt-8 space-y-4">
            {approche.proofs.map((p, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lie" aria-hidden />
                <span className="font-sans text-lg leading-snug text-cafe/85">
                  {p}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border-l-4 border-moutarde bg-craie/60 px-6 py-5">
            <p className="font-display text-xl italic leading-snug text-cafe">
              {approche.closing}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
