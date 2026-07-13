"use client";

import { useEffect, useRef, useState } from "react";
import {
  DELIVERY_TIMELINE,
  STATUS_LABELS,
  type DeliveryStatus,
} from "@/lib/delivery/types";

/**
 * Suivi de course : timeline Préparation → Coursier en route → Livré, avec ETA.
 * Interroge /api/delivery/status toutes les 2 s jusqu'à livraison.
 * Habillage : DA v3 (fenêtre sticker, pastilles teal).
 */
export default function DeliveryTracker({ deliveryId }: { deliveryId: string }) {
  const [status, setStatus] = useState<DeliveryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch(
          `/api/delivery/status?id=${encodeURIComponent(deliveryId)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Suivi indisponible.");
        if (!active) return;
        setStatus(data as DeliveryStatus);
        if (data.status === "delivered" || data.status === "canceled") {
          if (timer.current) clearInterval(timer.current);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Suivi indisponible.");
      }
    }

    poll();
    timer.current = setInterval(poll, 2000);
    return () => {
      active = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, [deliveryId]);

  const currentIndex = status
    ? DELIVERY_TIMELINE.indexOf(status.status)
    : -1;

  return (
    <div className="v3-window">
      <div className="v3-window-bar">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-encre bg-corail" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-encre bg-jaune" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-encre bg-teal" aria-hidden />
        <span className="ml-2 font-mono text-[0.62rem] font-bold uppercase tracking-wide text-encre/70">
          Suivi de votre commande
        </span>
        {status?.etaMinutes != null && status.status !== "delivered" && (
          <span className="ml-auto rounded-full border-2 border-encre bg-jaune px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-encre">
            ETA ~ {status.etaMinutes} min
          </span>
        )}
      </div>

      <div className="bg-white p-6 sm:p-7">
        {error && <p className="mb-4 font-sans text-sm font-bold text-corail">{error}</p>}

        <ol className="space-y-4">
          {DELIVERY_TIMELINE.map((step, i) => {
            const done = currentIndex >= 0 && i <= currentIndex;
            const active = i === currentIndex;
            return (
              <li key={step} className="flex items-center gap-4">
                <span
                  aria-hidden
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-encre transition-colors ${
                    done
                      ? "bg-teal text-white shadow-[2px_2px_0_#211D16]"
                      : "bg-lait text-encre/30"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={`font-sans transition-colors ${
                    active
                      ? "font-bold text-encre"
                      : done
                      ? "text-encre/80"
                      : "text-encre/40"
                  }`}
                >
                  {STATUS_LABELS[step]}
                </span>
              </li>
            );
          })}
        </ol>

        {status?.mode === "demo" && (
          <p className="mt-6 border-t-2 border-dashed border-encre/15 pt-4 font-mono text-[0.6rem] uppercase tracking-wide text-encre/45">
            Démo — statut simulé, aucune vraie course déclenchée
          </p>
        )}
      </div>
    </div>
  );
}
