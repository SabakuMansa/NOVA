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

  // Validation de la commande : on fige le devis + l'adresse et on passe à la
  // confirmation. La course n'est créée qu'à l'ouverture du suivi (ci-dessous),
  // pour que le visiteur voie toujours la progression en direct.
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

  // Ouverture du suivi : crée la course (horloge de démo remise à zéro) afin que
  // la timeline progresse pendant que le visiteur regarde.
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
    <div className="min-h-screen bg-nappe pb-28">
      {/* Bandeau sandbox */}
      <div className="bg-cafe px-5 py-2 text-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-moutarde">
          Démonstration · exemple de commande — aucune vraie commande n'est passée
        </p>
      </div>

      {/* En-tête restaurant */}
      <header className="paper-grain border-b border-cafe/10">
        <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
          <p className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-lie">
            Bistrot · {RESTAURANT.city}
          </p>
          <h1 className="mt-3 font-display text-4xl text-cafe sm:text-5xl">
            {RESTAURANT.name}
          </h1>
          <p className="mt-3 font-sans text-cafe/70">
            Cuisine de saison, à emporter ou en livraison de proximité.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        {/* ÉTAPE MENU */}
        {step === "menu" && (
          <>
            <h2 className="font-display text-2xl text-cafe">La carte</h2>
            <ul className="mt-6 space-y-3">
              {MENU.map((d) => {
                const qty = cart[d.id] || 0;
                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-4 rounded-2xl border border-cafe/10 bg-craie/40 p-4 sm:p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-display text-lg text-cafe">{d.name}</h3>
                        <span className="font-mono text-sm text-cafe/70">
                          {euro(d.price)}
                        </span>
                      </div>
                      <p className="mt-0.5 font-sans text-sm text-cafe/60">{d.desc}</p>
                    </div>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => setQty(d.id, 1)}
                        className="shrink-0 rounded-full border border-cafe/25 px-4 py-2 font-sans text-sm text-cafe transition-colors hover:border-cafe hover:bg-craie/60"
                      >
                        Ajouter
                      </button>
                    ) : (
                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Retirer un ${d.name}`}
                          onClick={() => setQty(d.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-cafe/25 text-cafe hover:bg-craie/60"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-mono text-sm text-cafe">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Ajouter un ${d.name}`}
                          onClick={() => setQty(d.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe text-nappe hover:bg-lie"
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
              className="font-mono text-xs uppercase tracking-wide text-cafe/60 hover:text-cafe"
            >
              ← Retour à la carte
            </button>
            <h2 className="mt-5 font-display text-2xl text-cafe">Votre commande</h2>

            <ul className="mt-5 space-y-2.5">
              {lines.map((l) => (
                <li
                  key={l.id}
                  className="flex items-baseline justify-between border-b border-cafe/10 pb-2.5 font-sans text-cafe/85"
                >
                  <span>
                    <span className="font-mono text-cafe/60">{l.qty}×</span> {l.name}
                  </span>
                  <span className="font-mono text-sm text-cafe">
                    {euro(l.price * l.qty)}
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between pt-1">
                <span className="font-mono text-[0.62rem] uppercase tracking-wide text-cafe/60">
                  Sous-total
                </span>
                <span className="font-mono text-lg font-medium text-cafe">
                  {euro(totalCents)}
                </span>
              </li>
            </ul>

            <h3 className="mt-8 font-display text-xl text-cafe">Livraison</h3>
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
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sauge text-nappe">
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
            <h2 className="mt-6 font-display text-3xl text-cafe">Commande confirmée</h2>
            <p className="mt-2 font-mono text-sm uppercase tracking-wide text-lie">
              {orderNo}
            </p>
            <p className="mt-3 max-w-sm font-sans text-cafe/70">
              {RESTAURANT.name} prépare votre commande. Un livreur passera la récupérer
              puis vous l'apportera.
            </p>
            <button
              type="button"
              onClick={startTracking}
              disabled={creating}
              className="mt-8 rounded-full bg-lie px-7 py-3.5 font-sans text-sm font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe disabled:opacity-60"
            >
              {creating ? "Ouverture du suivi…" : "Suivre ma commande"}
            </button>
            {error && <p className="mt-3 font-sans text-sm text-lie">{error}</p>}
          </div>
        )}

        {/* ÉTAPE SUIVI */}
        {step === "tracking" && deliveryId && (
          <>
            <h2 className="font-display text-2xl text-cafe">Suivi en direct</h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-wide text-cafe/60">
              Commande {orderNo} · {RESTAURANT.name}
            </p>
            <div className="mt-5">
              <DeliveryTracker deliveryId={deliveryId} />
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-6 font-mono text-xs uppercase tracking-wide text-lie underline underline-offset-4 hover:text-cafe"
            >
              Passer une nouvelle commande
            </button>
          </>
        )}

        <p className="mt-10 border-t border-cafe/10 pt-6 font-sans text-xs leading-relaxed text-cafe/50">
          Exemple de démonstration. Un vrai site s'adapte à votre menu, vos prix et votre
          zone de livraison. Aucune commande ni aucun paiement réels ne sont effectués ici.
        </p>
      </main>

      {/* Barre panier fixe (étape menu) */}
      {step === "menu" && itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-cafe/10 bg-nappe/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5">
            <span className="font-sans text-sm text-cafe">
              <span className="font-medium">{itemCount}</span> article
              {itemCount > 1 ? "s" : ""} ·{" "}
              <span className="font-mono">{euro(totalCents)}</span>
            </span>
            <button
              type="button"
              onClick={() => setStep("checkout")}
              className="rounded-full bg-lie px-6 py-2.5 font-sans text-sm font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe"
            >
              Commander →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
