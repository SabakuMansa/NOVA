"use client";

import { useState } from "react";
import type { Address, DeliveryQuote } from "@/lib/delivery/types";

/**
 * Le client choisit « Retrait » ou « Livraison ».
 * En livraison, il saisit son adresse et obtient un devis (coût + délai estimé).
 * Aucune mention de la marque technique : c'est « une livraison de proximité ».
 */
export default function DeliveryOptionSelector({
  pickup,
  onConfirm,
}: {
  pickup: Address;
  onConfirm: (payload: { quote: DeliveryQuote; dropoff: Address }) => void;
}) {
  const [mode, setMode] = useState<"pickup" | "delivery">("delivery");
  const [dropoff, setDropoff] = useState<Address>({
    street: "",
    postalCode: "",
    city: "",
  });
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canQuote =
    dropoff.street.trim() && dropoff.postalCode.trim() && dropoff.city.trim();

  async function fetchQuote() {
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const res = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Devis indisponible.");
      setQuote(data as DeliveryQuote);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Devis indisponible.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-cafe/20 bg-nappe px-4 py-3 font-sans text-cafe placeholder-cafe/40 transition-colors focus:border-lie focus:bg-white";

  return (
    <div className="rounded-2xl border border-cafe/12 bg-craie/50 p-6 sm:p-8">
      {/* Choix retrait / livraison */}
      <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Mode de réception">
        {(["pickup", "delivery"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-xl border px-4 py-3 font-sans text-sm transition-all ${
              mode === m
                ? "border-cafe bg-cafe text-nappe shadow-sm"
                : "border-cafe/20 bg-nappe text-cafe hover:border-cafe/50"
            }`}
          >
            {m === "pickup" ? "Retrait sur place" : "Livraison"}
          </button>
        ))}
      </div>

      {mode === "delivery" && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                Adresse
              </span>
              <input
                className={field}
                placeholder="12 rue du Marché"
                value={dropoff.street}
                onChange={(e) => setDropoff({ ...dropoff, street: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                Code postal
              </span>
              <input
                className={field}
                placeholder="94100"
                inputMode="numeric"
                value={dropoff.postalCode}
                onChange={(e) => setDropoff({ ...dropoff, postalCode: e.target.value })}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
              Ville
            </span>
            <input
              className={field}
              placeholder="Saint-Maur-des-Fossés"
              value={dropoff.city}
              onChange={(e) => setDropoff({ ...dropoff, city: e.target.value })}
            />
          </label>

          <button
            type="button"
            onClick={fetchQuote}
            disabled={!canQuote || loading}
            className="w-full rounded-full border border-cafe/25 px-6 py-3 font-sans text-sm text-cafe transition-colors hover:border-cafe hover:bg-craie/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Estimation…" : "Estimer la livraison"}
          </button>

          {error && (
            <p className="font-sans text-sm text-lie">{error}</p>
          )}

          {quote && (
            <div className="rounded-xl border border-sauge/30 bg-sauge/[0.08] px-5 py-4">
              <p className="font-sans text-sm text-cafe">
                Livraison estimée :{" "}
                <span className="font-medium">
                  {(quote.feeCents / 100).toFixed(2).replace(".", ",")} €
                </span>{" "}
                · environ {quote.etaMinutes} min
              </p>
              <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-wide text-sauge">
                Estimation — sans commission sur votre vente
              </p>
              <button
                type="button"
                onClick={() => onConfirm({ quote, dropoff })}
                className="mt-4 w-full rounded-full bg-lie px-6 py-3 font-sans text-sm font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe"
              >
                Commander en livraison
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "pickup" && (
        <p className="mt-6 font-sans text-sm leading-relaxed text-cafe/70">
          Votre commande vous attend sur place. Vous êtes prévenu dès qu'elle est
          prête.
        </p>
      )}
    </div>
  );
}
