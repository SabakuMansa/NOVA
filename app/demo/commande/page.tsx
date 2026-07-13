"use client";

import { useMemo, useState } from "react";
import DeliveryOptionSelector from "@/components/delivery/DeliveryOptionSelector";
import DeliveryTracker from "@/components/delivery/DeliveryTracker";
import type { Address, DeliveryQuote } from "@/lib/delivery/types";

/**
 * Page de commande SIMULÉE (sandbox) — parcours client complet d'un restaurant
 * fictif : menu → panier → commande → livraison suivie en direct.
 * Simule le service de livraison en coulisses (mock-provider) — aucune vraie
 * commande, aucun appel réseau externe, aucune marque de prestataire nommée.
 * Habillage : DA v3 « geek coloré » (lait/encre, cartes sticker).
 */

const RESTAURANT = {
  name: "La Table du Marché",
  city: "Saint-Maur-des-Fossés",
  address: {
    street: "3 place du Marché",
    postalCode: "94100",
    city: "Saint-Maur-des-Fossés",
  } as Address,
};

type Dish = { id: string; name: string; desc: string; price: number };

const MENU: Dish[] = [
  { id: "burger", name: "Burger maison & frites", desc: "Bœuf français, cheddar affiné, frites fraîches", price: 1450 },
  { id: "cesar", name: "Salade César", desc: "Poulet rôti, parmesan, croûtons maison", price: 1100 },
  { id: "poke", name: "Poke bowl saumon", desc: "Saumon, riz vinaigré, edamame, avocat", price: 1350 },
  { id: "risotto", name: "Risotto aux champignons", desc: "Arborio, champignons de Paris, parmesan", price: 1300 },
  { id: "tarte", name: "Tarte du jour", desc: "Pâte sablée, fruits de saison", price: 600 },
  { id: "limo", name: "Limonade artisanale", desc: "Citron pressé, menthe fraîche", price: 400 },
];

const euro = (cents: number) =>
  (cents / 100).toFixed(2).replace(".", ",") + " €";

type Step = "menu" | "checkout" | "confirm" | "tracking";

export default function CommandeDemoPage() {
  const [step, setStep] = useState<Step>("menu");
  const [cart, setCart] = useState<Record<string, number>>({ burger: 1, cesar: 1 });
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState("");
  const [pending, setPending] = useState<{ quote: DeliveryQuote; dropoff: Address } | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      MENU.filter((d) => cart[d.id] > 0).map((d) => ({ ...d, qty: cart[d.id] })),
    [cart]
  );
  const totalCents = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  const setQty = (id: string, delta: number) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      const copy = { ...c };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  // Validation : on fige devis + adresse, la course n'est créée qu'à
  // l'ouverture du suivi pour que la progression soit toujours visible.
  function handleConfirm({
    quote,
    dropoff,
  }: {
    quote: DeliveryQuote;
    dropoff: Address;
  }) {
    setPending({ quote, dropoff });
    setOrderNo(`CMD-${String(Date.now()).slice(-4)}`);
    setStep("confirm");
  }

  async function startTracking() {
    if (!pending) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: pending.quote.id,
          pickup: RESTAURANT.address,
          dropoff: pending.dropoff,
          orderReference: orderNo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Suivi indisponible.");
      setDeliveryId(data.id);
      setStep("tracking");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suivi indisponible.");
    } finally {
      setCreating(false);
    }
  }

  function reset() {
    setStep("menu");
    setCart({ burger: 1, cesar: 1 });
    setDeliveryId(null);
    setOrderNo("");
    setPending(null);
  }

  return (
    <div className="min-h-screen bg-lait pb-28 text-encre">
      {/* Bandeau sandbox */}
      <div className="border-b-2 border-encre bg-encre px-5 py-2 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-jaune">
          Démonstration · exemple de commande — aucune vraie commande n'est passée
        </p>
      </div>

      {/* En-tête restaurant */}
      <header className="border-b-2 border-encre bg-white">
        <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-lait px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
            <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
            Bistrot · {RESTAURANT.city}
          </p>
          <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
            {RESTAURANT.name}
          </h1>
          <p className="mt-3 font-sans text-encre/70">
            Cuisine de saison, à emporter ou en livraison de proximité.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        {/* ÉTAPE MENU */}
        {step === "menu" && (
          <>
            <h2 className="font-sans text-2xl font-extrabold tracking-tight">La carte</h2>
            <ul className="mt-6 space-y-4">
              {MENU.map((d) => {
                const qty = cart[d.id] || 0;
                return (
                  <li
                    key={d.id}
                    className="v3-card v3-card-hover flex items-center gap-4 p-4 sm:p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-sans text-lg font-bold">{d.name}</h3>
                        <span className="font-mono text-sm text-violet">
                          {euro(d.price)}
                        </span>
                      </div>
                      <p className="mt-0.5 font-sans text-sm text-encre/60">{d.desc}</p>
                    </div>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => setQty(d.id, 1)}
                        className="shrink-0 rounded-xl border-2 border-encre bg-white px-4 py-2 font-sans text-sm font-bold text-encre shadow-[2px_2px_0_#211D16] transition-transform hover:-translate-y-0.5"
                      >
                        Ajouter
                      </button>
                    ) : (
                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Retirer un ${d.name}`}
                          onClick={() => setQty(d.id, -1)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-encre bg-white font-bold text-encre shadow-[2px_2px_0_#211D16]"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-mono text-sm font-bold">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Ajouter un ${d.name}`}
                          onClick={() => setQty(d.id, 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-encre bg-jaune font-bold text-encre shadow-[2px_2px_0_#211D16]"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* ÉTAPE CHECKOUT */}
        {step === "checkout" && (
          <>
            <button
              type="button"
              onClick={() => setStep("menu")}
              className="font-mono text-xs font-bold uppercase tracking-wide text-encre/60 hover:text-encre"
            >
              ← Retour à la carte
            </button>
            <h2 className="mt-5 font-sans text-2xl font-extrabold tracking-tight">
              Votre commande
            </h2>

            <div className="v3-card mt-5 p-5 sm:p-6">
              <ul className="space-y-2.5">
                {lines.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-baseline justify-between border-b-2 border-dashed border-encre/15 pb-2.5 font-sans"
                  >
                    <span>
                      <span className="font-mono text-encre/50">{l.qty}×</span> {l.name}
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {euro(l.price * l.qty)}
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between pt-1">
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wide text-encre/60">
                    Sous-total
                  </span>
                  <span className="font-mono text-lg font-bold text-violet">
                    {euro(totalCents)}
                  </span>
                </li>
              </ul>
            </div>

            <h3 className="mt-8 font-sans text-xl font-extrabold tracking-tight">
              Livraison
            </h3>
            <div className="mt-4">
              <DeliveryOptionSelector
                pickup={RESTAURANT.address}
                onConfirm={handleConfirm}
              />
            </div>
          </>
        )}

        {/* ÉTAPE CONFIRMATION */}
        {step === "confirm" && (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-encre bg-teal text-white shadow-[3px_3px_0_#211D16]">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                <path
                  d="m5 13 4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="mt-6 font-sans text-3xl font-extrabold tracking-tight">
              Commande confirmée
            </h2>
            <p className="mt-2 inline-flex rounded-full border-2 border-encre bg-jaune px-3 py-1 font-mono text-sm font-bold uppercase tracking-wide shadow-[2px_2px_0_#211D16]">
              {orderNo}
            </p>
            <p className="mt-4 max-w-sm font-sans text-encre/70">
              {RESTAURANT.name} prépare votre commande. Un livreur passera la récupérer
              puis vous l'apportera.
            </p>
            <button
              type="button"
              onClick={startTracking}
              disabled={creating}
              className="mt-8 rounded-xl border-2 border-encre bg-corail px-6 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {creating ? "Ouverture du suivi…" : "Suivre ma commande"}
            </button>
            {error && <p className="mt-3 font-sans text-sm font-bold text-corail">{error}</p>}
          </div>
        )}

        {/* ÉTAPE SUIVI */}
        {step === "tracking" && deliveryId && (
          <>
            <h2 className="font-sans text-2xl font-extrabold tracking-tight">
              Suivi en direct
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-wide text-encre/60">
              Commande {orderNo} · {RESTAURANT.name}
            </p>
            <div className="mt-5">
              <DeliveryTracker deliveryId={deliveryId} />
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-6 font-mono text-xs font-bold uppercase tracking-wide text-violet underline underline-offset-4 hover:text-encre"
            >
              Passer une nouvelle commande
            </button>
          </>
        )}

        <p className="mt-10 border-t-2 border-dashed border-encre/15 pt-6 font-sans text-xs leading-relaxed text-encre/50">
          Exemple de démonstration. Un vrai site s'adapte à votre menu, vos prix et votre
          zone de livraison. Aucune commande ni aucun paiement réels ne sont effectués ici.
        </p>
      </main>

      {/* Barre panier fixe (étape menu) */}
      {step === "menu" && itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t-2 border-encre bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5">
            <span className="font-sans text-sm">
              <span className="font-bold">{itemCount}</span> article
              {itemCount > 1 ? "s" : ""} ·{" "}
              <span className="font-mono font-bold text-violet">{euro(totalCents)}</span>
            </span>
            <button
              type="button"
              onClick={() => setStep("checkout")}
              className="rounded-xl border-2 border-encre bg-corail px-6 py-2.5 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
            >
              Commander →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
