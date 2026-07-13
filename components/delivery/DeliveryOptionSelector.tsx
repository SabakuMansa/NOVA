"use client";

import { useState } from "react";
import type { Address, DeliveryQuote } from "@/lib/delivery/types";

/**
 * Le client choisit « Retrait » ou « Livraison ».
 * En livraison, il saisit son adresse et obtient un devis (coût + délai estimé).
 * Aucune mention de la marque technique : c'est « une livraison de proximité ».
 * Habillage : DA v3 (cartes sticker, encre/lait, accents teal/corail).
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
    "w-full rounded-xl border-2 border-encre bg-white px-4 py-3 font-sans text-encre placeholder-encre/35 transition-shadow focus:shadow-[3px_3px_0_#211D16] focus:outline-none";

  return (
    <div className="v3-card p-6 sm:p-8">
      {/* Choix retrait / livraison */}
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Mode de réception">
        {(["pickup", "delivery"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-xl border-2 border-encre px-4 py-3 font-sans text-sm font-bold transition-transform hover:-translate-y-0.5 ${
              mode === m
                ? "bg-encre text-lait shadow-[3px_3px_0_#6C5CE7]"
                : "bg-white text-encre shadow-[2px_2px_0_#211D16]"
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
              <span className="mb-1.5 block font-mono text-[0.62rem] font-bold uppercase tracking-wide text-encre/60">
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
              <span className="mb-1.5 block font-mono text-[0.62rem] font-bold uppercase tracking-wide text-encre/60">
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
            <span className="mb-1.5 block font-mono text-[0.62rem] font-bold uppercase tracking-wide text-encre/60">
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
            className="w-full rounded-xl border-2 border-encre bg-white px-6 py-3 font-sans text-sm font-bold text-encre shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Estimation…" : "Estimer la livraison"}
          </button>

          {error && (
            <p className="font-sans text-sm font-bold text-corail">{error}</p>
          )}

          {quote && (
            <div className="rounded-xl border-2 border-encre bg-teal/10 px-5 py-4 shadow-[3px_3px_0_#211D16]">
              <p className="font-sans text-sm">
                Livraison estimée :{" "}
                <span className="font-mono font-bold text-teal">
                  {(quote.feeCents / 100).toFixed(2).replace(".", ",")} €
                </span>{" "}
                · environ {quote.etaMinutes} min
              </p>
              <p className="mt-1 font-mono text-[0.6rem] font-bold uppercase tracking-wide text-teal">
                Estimation — sans commission sur votre vente
              </p>
              <button
                type="button"
                onClick={() => onConfirm({ quote, dropoff })}
                className="mt-4 w-full rounded-xl border-2 border-encre bg-corail px-6 py-3 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
              >
                Commander en livraison
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "pickup" && (
        <p className="mt-6 font-sans text-sm leading-relaxed text-encre/70">
          Votre commande vous attend sur place. Vous êtes prévenu dès qu'elle est
          prête.
        </p>
      )}
    </div>
  );
}
