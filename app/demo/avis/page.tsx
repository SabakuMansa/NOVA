"use client";

import { useEffect, useState } from "react";
import type { ReviewJob } from "@/lib/reviews/types";

/**
 * Sandbox du module "Relance avis Google" — parcours complet :
 * création d'une réservation fictive → planification → envoi (simulé en
 * mode démo) → statut visible. Isolée, non reliée à la navigation, désindexée
 * (même traitement que /demo/commande et /demo/livraison).
 */

const BUSINESS_ID = "la-table-du-marche";

function statusBadge(status: ReviewJob["status"]) {
  const map: Record<ReviewJob["status"], string> = {
    scheduled: "bg-jaune/20 text-encre",
    sent: "bg-teal/15 text-teal",
    simulated: "bg-violet/15 text-violet",
    error: "bg-corail/15 text-corail",
    canceled: "bg-encre/10 text-encre/60",
  };
  const label: Record<ReviewJob["status"], string> = {
    scheduled: "Planifiée",
    sent: "Envoyée",
    simulated: "Simulée",
    error: "Erreur",
    canceled: "Désinscrite",
  };
  return (
    <span className={`rounded-full border-2 border-encre px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default function AvisDemoPage() {
  const [name, setName] = useState("Camille D.");
  const [email, setEmail] = useState("camille.demo@example.com");
  const [delayMinutes, setDelayMinutes] = useState(2);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastJob, setLastJob] = useState<ReviewJob | null>(null);
  const [jobs, setJobs] = useState<ReviewJob[]>([]);
  const [running, setRunning] = useState(false);

  async function refresh() {
    const res = await fetch("/api/reviews/status", { cache: "no-store" });
    const data = await res.json();
    setJobs(data.jobs ?? []);
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4000);
    return () => clearInterval(t);
  }, []);

  async function createReservation(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: BUSINESS_ID,
          customerName: name,
          customerEmail: email,
          reservationAt: new Date().toISOString(),
          delayMinutesOverride: delayMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Création impossible.");
      setLastJob(data);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible.");
    } finally {
      setCreating(false);
    }
  }

  async function forceRun() {
    setRunning(true);
    try {
      await fetch("/api/reviews/run", { method: "POST" });
      await refresh();
    } finally {
      setRunning(false);
    }
  }

  const field =
    "w-full rounded-xl border-2 border-encre bg-white px-4 py-3 font-sans text-encre placeholder-encre/35 focus:outline-none";

  return (
    <div className="min-h-screen bg-lait pb-20 text-encre">
      <div className="border-b-2 border-encre bg-encre px-5 py-2 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-wide text-jaune">
          Démonstration · module Relance avis Google — aucun vrai email n'est envoyé en mode démo
        </p>
      </div>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight">
          Réservation → relance avis
        </h1>
        <p className="mt-2 font-sans text-encre/70">
          Créez une réservation fictive. La relance est planifiée à
          « réservation + délai » (ici en minutes pour tester vite), puis
          envoyée automatiquement — simulée en mode démo, réellement via
          Resend en mode live.
        </p>

        <form onSubmit={createReservation} className="v3-card mt-8 space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Nom du client"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
            />
            <input
              required
              type="email"
              placeholder="Email du client"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.62rem] font-bold uppercase tracking-wide text-encre/60">
              Délai avant envoi (minutes — remplace les heures réelles pour tester vite)
            </span>
            <input
              type="number"
              min={1}
              max={60}
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className={field}
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            className="w-full rounded-xl border-2 border-encre bg-corail px-6 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {creating ? "Création…" : "Créer la réservation"}
          </button>
          {error && <p className="font-sans text-sm font-bold text-corail">{error}</p>}
          {lastJob && (
            <p className="font-sans text-sm text-encre/70">
              Relance planifiée pour{" "}
              <span className="font-mono font-bold text-teal">
                {new Date(lastJob.sendAt).toLocaleTimeString("fr-FR")}
              </span>{" "}
              (job <span className="font-mono">{lastJob.id.slice(0, 8)}</span>).
            </p>
          )}
        </form>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-sans text-xl font-extrabold tracking-tight">
            Suivi des relances ({jobs.length})
          </h2>
          <button
            type="button"
            onClick={forceRun}
            disabled={running}
            className="rounded-xl border-2 border-encre bg-white px-4 py-2 font-sans text-sm font-bold text-encre shadow-[2px_2px_0_#211D16] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {running ? "Vérification…" : "Forcer la vérification ↻"}
          </button>
        </div>
        <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wide text-encre/40">
          Rafraîchi automatiquement toutes les 4s · un poller local vérifie aussi toutes les 15s
        </p>

        <ul className="mt-4 space-y-3">
          {jobs.length === 0 && (
            <p className="font-sans text-sm text-encre/50">Aucune réservation pour l'instant.</p>
          )}
          {jobs.map((j) => (
            <li key={j.id} className="v3-card flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-bold">
                  {j.customerName || j.customerEmail}
                </p>
                <p className="font-mono text-[0.65rem] text-encre/50">
                  envoi prévu {new Date(j.sendAt).toLocaleTimeString("fr-FR")}
                  {j.sentAt && ` · traité ${new Date(j.sentAt).toLocaleTimeString("fr-FR")}`}
                  {j.error && ` · ${j.error}`}
                </p>
              </div>
              {statusBadge(j.status)}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
