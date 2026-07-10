"use client";

import { useEffect, useRef, useState } from "react";
import {
  DELIVERY_TIMELINE,
  STATUS_LABELS,
  type DeliveryStatus,
} from "@/lib/delivery/types";

/**
 * Suivi de course : timeline simple Préparation → Coursier en route → Livré,
 * avec l'ETA. Interroge /api/delivery/status toutes les 2 s jusqu'à livraison.
 * En mode démo, le statut évolue automatiquement en une vingtaine de secondes.
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
    <div className="rounded-2xl border border-cafe/12 bg-craie/50 p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-lie">
          Suivi de votre commande
        </p>
        {status?.etaMinutes != null && status.status !== "delivered" && (
          <p className="font-sans text-sm text-cafe/70">
            ETA ~ {status.etaMinutes} min
          </p>
        )}
      </div>

      {error && <p className="mt-4 font-sans text-sm text-lie">{error}</p>}

      <ol className="mt-6 space-y-4">
        {DELIVERY_TIMELINE.map((step, i) => {
          const done = currentIndex >= 0 && i <= currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step} className="flex items-center gap-4">
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  done
                    ? "border-sauge bg-sauge text-nappe"
                    : "border-cafe/25 text-cafe/40"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
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
                    ? "font-medium text-cafe"
                    : done
                    ? "text-cafe/80"
                    : "text-cafe/45"
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>

      {status?.mode === "demo" && (
        <p className="mt-6 font-mono text-[0.58rem] uppercase tracking-wide text-cafe/45">
          Démo — statut simulé, aucune vraie course déclenchée
        </p>
      )}
    </div>
  );
}
