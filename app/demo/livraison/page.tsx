"use client";

import { useState } from "react";
import DeliveryOptionSelector from "@/components/delivery/DeliveryOptionSelector";
import DeliveryTracker from "@/components/delivery/DeliveryTracker";
import type { Address, DeliveryQuote } from "@/lib/delivery/types";

/**
 * Page de démonstration (sandbox) du module Commande & Livraison.
 * Isolée et NON reliée à la navigation du site — montre le module en mode
 * démo. Aucune vraie course n'est déclenchée. Habillage : DA v3.
 */

const DEMO_PICKUP: Address = {
  street: "3 place du Marché",
  postalCode: "94100",
  city: "Saint-Maur-des-Fossés",
};

export default function DemoLivraisonPage() {
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm({
    quote,
    dropoff,
  }: {
    quote: DeliveryQuote;
    dropoff: Address;
  }) {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote.id,
          pickup: DEMO_PICKUP,
          dropoff,
          orderReference: "DEMO-001",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Création impossible.");
      setDeliveryId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Création impossible.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-lait px-5 py-16 text-encre md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border-2 border-encre bg-jaune px-5 py-3 shadow-[3px_3px_0_#211D16]">
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-eyebrow text-encre">
            Sandbox · mode démo — aucune vraie livraison
          </p>
        </div>

        <h1 className="mt-8 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
          Commande & livraison directe
        </h1>
        <p className="mt-4 font-sans text-lg text-encre/70">
          Démonstration du module : le client choisit son mode de réception,
          obtient une estimation, puis suit sa commande en direct.
        </p>

        <div className="mt-10 space-y-6">
          {!deliveryId ? (
            <>
              <DeliveryOptionSelector pickup={DEMO_PICKUP} onConfirm={handleConfirm} />
              {creating && (
                <p className="font-sans text-sm text-encre/60">
                  Création de la course…
                </p>
              )}
              {error && (
                <p className="font-sans text-sm font-bold text-corail">{error}</p>
              )}
            </>
          ) : (
            <>
              <DeliveryTracker deliveryId={deliveryId} />
              <button
                type="button"
                onClick={() => setDeliveryId(null)}
                className="font-mono text-xs font-bold uppercase tracking-wide text-violet underline underline-offset-4 hover:text-encre"
              >
                Relancer une démo
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
