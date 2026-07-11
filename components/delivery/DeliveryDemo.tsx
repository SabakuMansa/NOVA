"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { carte } from "@/content/site";
import { mockProvider } from "@/lib/delivery/mock-provider";
import { EASE } from "@/components/Reveal";

const demo = carte.demo;
const MARKER = 30; // largeur du marqueur livreur (px)
const STEP_MS = 2500; // durée par étape de suivi

type Step = "cart" | "confirm" | "tracking";

export default function DeliveryDemo() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [orderNo, setOrderNo] = useState("");
  const [trackIndex, setTrackIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(0);

  const lastStep = demo.steps.length - 1;
  const delivered = step === "tracking" && trackIndex >= lastStep;

  // Confirmation → suivi (auto).
  useEffect(() => {
    if (step !== "confirm") return;
    const t = setTimeout(() => {
      setStep("tracking");
      setTrackIndex(0);
    }, 1800);
    return () => clearTimeout(t);
  }, [step]);

  // Progression automatique du suivi (2,5 s par étape) — s'arrête à « Livré ».
  useEffect(() => {
    if (step !== "tracking" || trackIndex >= lastStep) return;
    const t = setTimeout(() => setTrackIndex((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, trackIndex, lastStep]);

  // Mesure de la piste pour l'animation du livreur (transform only).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setTrackW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [step]);

  async function validate() {
    // Réutilise la logique de démo existante (mock-provider) — aucun réseau.
    const job = await mockProvider.createDelivery({
      quoteId: "demo",
      pickup: { street: "3 place du Marché", postalCode: "94100", city: "Saint-Maur" },
      dropoff: { street: "10 avenue Foch", postalCode: "94100", city: "Saint-Maur" },
    });
    setOrderNo(`CMD-${String(new Date(job.createdAt).getTime()).slice(-4)}`);
    setStep("confirm");
  }

  function replay() {
    setStep("cart");
    setTrackIndex(0);
  }
  function toggle(next: boolean) {
    setOpen(next);
    setStep("cart");
    setTrackIndex(0);
  }

  const travel = Math.max(0, trackW - MARKER);

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      {!open && (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => toggle(true)}
            className="inline-flex items-center gap-2 rounded-full border border-cafe/25 px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-wide text-cafe/80 transition-colors hover:border-cafe hover:bg-craie/60"
          >
            {demo.trigger}
            <span aria-hidden>→</span>
          </button>
          <a
            href="/demo/commande"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-lie underline underline-offset-4 transition-colors hover:text-cafe"
          >
            Ouvrir un exemple de commande complet ↗
          </a>
        </div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-cafe/12 bg-craie/40 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-lie">
                {demo.eyebrow}
              </p>
              <button
                type="button"
                onClick={() => toggle(false)}
                aria-label={demo.close}
                className="font-mono text-xs uppercase tracking-wide text-cafe/50 hover:text-cafe"
              >
                {demo.close} ✕
              </button>
            </div>

            {/* Étapes du parcours (remontée à chaque changement) */}
            <div className="mt-5 min-h-[16rem]">
              <motion.div
                key={step}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {step === "cart" && (
                  <div>
                    <p className="font-display text-xl text-cafe">{demo.restaurant}</p>
                    <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-wide text-cafe/50">
                      Votre panier
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {demo.items.map((it) => (
                        <li
                          key={it.name}
                          className="flex items-baseline justify-between border-b border-cafe/10 pb-2.5 font-sans text-cafe/85"
                        >
                          <span>{it.name}</span>
                          <span className="font-mono text-sm text-cafe">{it.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                        Total
                      </span>
                      <span className="font-mono text-lg font-medium text-cafe">
                        {demo.total}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={validate}
                      className="mt-6 w-full rounded-full bg-lie px-6 py-3.5 font-sans text-sm font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe"
                    >
                      {demo.validate}
                    </button>
                  </div>
                )}

                {step === "confirm" && (
                  <div className="flex flex-col items-center py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sauge text-nappe">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                        <path
                          d="m5 13 4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h4 className="mt-5 font-display text-2xl text-cafe">
                      {demo.confirmTitle}
                    </h4>
                    <p className="mt-2 font-mono text-sm uppercase tracking-wide text-lie">
                      {orderNo}
                    </p>
                    <p className="mt-1 font-sans text-sm text-cafe/70">{demo.etaLabel}</p>
                  </div>
                )}

                {step === "tracking" && (
                  <div>
                    <ol className="space-y-3.5">
                      {demo.steps.map((label, i) => {
                        const done = i <= trackIndex;
                        const active = i === trackIndex;
                        return (
                          <li key={label} className="flex items-center gap-3.5">
                            <span
                              aria-hidden
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                done
                                  ? "border-sauge bg-sauge text-nappe"
                                  : "border-cafe/25 text-cafe/40"
                              }`}
                            >
                              {done ? (
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                                  <path
                                    d="m5 13 4 4L19 7"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              )}
                            </span>
                            <span
                              className={`font-sans transition-colors duration-300 ${
                                active
                                  ? "font-medium text-cafe"
                                  : done
                                  ? "text-cafe/80"
                                  : "text-cafe/45"
                              }`}
                            >
                              {label}
                            </span>
                          </li>
                        );
                      })}
                    </ol>

                    {/* Piste livreur : restaurant → domicile (transform only) */}
                    <div className="mt-7">
                      <div
                        ref={trackRef}
                        className="relative h-10 rounded-full bg-nappe/70"
                      >
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" aria-hidden>
                          🍽️
                        </span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" aria-hidden>
                          🏠
                        </span>
                        <motion.span
                          aria-hidden
                          className="absolute top-1/2 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full bg-moutarde"
                          animate={{ x: trackIndex >= 1 ? travel : 0 }}
                          transition={{
                            duration: reduce ? 0 : STEP_MS / 1000,
                            ease: EASE,
                          }}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 text-cafe" fill="none" aria-hidden>
                            <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="17" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                            <path
                              d="M8 18h6l3-6h2M6 12h5l2 6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.span>
                      </div>
                    </div>

                    {delivered && (
                      <button
                        type="button"
                        onClick={replay}
                        className="mt-6 font-mono text-xs uppercase tracking-wide text-lie underline underline-offset-4 hover:text-cafe"
                      >
                        {demo.replay}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            <p className="mt-6 border-t border-cafe/10 pt-4 font-sans text-xs leading-relaxed text-cafe/55">
              {demo.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
