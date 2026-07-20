"use client";

import { useEffect, useRef, useState } from "react";
import {
  DELIVERY_TIMELINE,
  STATUS_LABELS,
  type DeliveryStatus,
} from "@/lib/delivery/types";

/** Clé sessionStorage utilisée pour transmettre l'id de course du panier
 *  à la page de confirmation (survit à la redirection Stripe/mock, sans
 *  passer par une query string). */
export const DELIVERY_STORAGE_KEY = "nova-exemples-boutique-delivery";

/**
 * Suivi de course, réutilisant tel quel le module /lib/delivery (mêmes
 * types, même route /api/delivery/status, même fournisseur mock côté
 * serveur) — seul l'habillage change pour coller à la DA "nord" de
 * Boutique. Calque de components/delivery/DeliveryTracker.tsx.
 */
export default function DeliveryTracking({
  deliveryId,
}: {
  deliveryId: string;
}) {
  const [status, setStatus] = useState<DeliveryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch(
          `/api/delivery/status?id=${encodeURIComponent(deliveryId)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Suivi indisponible.");
        if (!active) return;
        setStatus(data as DeliveryStatus);
        if (data.status === "delivered" || data.status === "canceled") {
          if (timer.current) clearInterval(timer.current);
        }
      } catch (e) {
        if (active)
          setError(e instanceof Error ? e.message : "Suivi indisponible.");
      }
    }

    poll();
    timer.current = setInterval(poll, 2000);
    return () => {
      active = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, [deliveryId]);

  const currentIndex = status ? DELIVERY_TIMELINE.indexOf(status.status) : -1;
  const delivered = status?.status === "delivered";

  return (
    <div className="mt-10 w-full max-w-md border border-nord-border bg-nord-bg-alt p-6 text-left sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-nord-sans text-[11px] uppercase tracking-[0.18em] text-nord-camel">
          Suivi de votre livraison
        </span>
        {status?.etaMinutes != null && !delivered && (
          <span className="border border-nord-border px-2 py-0.5 font-nord-sans text-[10px] uppercase tracking-wide text-nord-muted">
            ~{status.etaMinutes} min
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 font-nord-sans text-sm text-red-700">{error}</p>
      )}

      <ol className="mt-5 space-y-3.5">
        {DELIVERY_TIMELINE.map((step, i) => {
          const isCurrent = i === currentIndex;
          const done =
            currentIndex >= 0 && (i < currentIndex || (isCurrent && delivered));
          const active = isCurrent && !delivered;
          const reached = done || isCurrent;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  reached
                    ? "border-nord-ink bg-nord-ink text-nord-bg"
                    : "border-nord-border text-nord-muted-light"
                }`}
              >
                {done ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`font-nord-sans text-sm transition-colors ${
                  active
                    ? "font-semibold text-nord-ink"
                    : reached
                      ? "text-nord-ink/80"
                      : "text-nord-muted-light"
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 border-t border-dashed border-nord-border pt-4 font-nord-sans text-[10px] uppercase tracking-wide text-nord-muted-light">
        Démo — statut simulé, aucune vraie course déclenchée
      </p>
    </div>
  );
}
