/**
 * Persistance des jobs de relance avis (planifiés puis envoyés).
 *
 * Deux implémentations derrière la même interface `ReviewJobStore` :
 *   - `MemoryReviewStore` (défaut) : un tableau en mémoire, module-level.
 *     Fonctionne parfaitement en développement local (`next dev` garde un
 *     seul process Node vivant entre les requêtes) — c'est ce qui permet de
 *     tester le cycle complet en mode démo. ⚠️ NE SURVIT PAS à un déploiement
 *     serverless multi-instances (Vercel prod) : chaque invocation peut
 *     atterrir sur une instance différente, sans mémoire partagée.
 *   - `SupabaseReviewStore` (lib/reviews/supabase-store.ts) : vraie
 *     persistance, nécessaire dès qu'on quitte le poste de développement.
 *     Voir README-reviews.md.
 *
 * `REVIEWS_STORE_MODE` pilote le choix : "memory" (défaut) ou "supabase".
 * Absent → memory, jamais d'erreur.
 */

import { createSupabaseReviewStore } from "./supabase-store";
import type { ReviewJob, ReviewJobStore, SendResult } from "./types";

export function getReviewsStoreMode(): "memory" | "supabase" {
  return process.env.REVIEWS_STORE_MODE === "supabase" ? "supabase" : "memory";
}

class MemoryReviewStore implements ReviewJobStore {
  private jobs: ReviewJob[] = [];
  private unsubscribed = new Set<string>(); // clé = `${businessId}:${email}`

  async create(job: ReviewJob): Promise<void> {
    this.jobs.push(job);
  }

  async get(id: string): Promise<ReviewJob | null> {
    return this.jobs.find((j) => j.id === id) ?? null;
  }

  async listAll(): Promise<ReviewJob[]> {
    // Le plus récent d'abord — plus lisible pour un tableau de bord.
    return [...this.jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async listDue(now: Date): Promise<ReviewJob[]> {
    const nowMs = now.getTime();
    return this.jobs.filter(
      (j) => j.status === "scheduled" && new Date(j.sendAt).getTime() <= nowMs
    );
  }

  async markSent(id: string, result: SendResult): Promise<void> {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return;
    job.status = result.status;
    if (result.status === "sent" || result.status === "simulated") {
      job.sentAt = new Date().toISOString();
    }
    if (result.error) job.error = result.error;
  }

  async unsubscribe(id: string): Promise<void> {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return;
    job.unsubscribed = true;
    job.status = "canceled";
    this.unsubscribed.add(`${job.businessId}:${job.customerEmail.toLowerCase()}`);
  }

  async isUnsubscribed(businessId: string, email: string): Promise<boolean> {
    return this.unsubscribed.has(`${businessId}:${email.toLowerCase()}`);
  }
}

// Singleton porté par `globalThis`, PAS par une simple variable de module.
// Next.js (App Router, en dev comme en prod serverless) peut bundler chaque
// route handler comme une entrée distincte : deux routes qui importent ce
// même fichier peuvent chacune obtenir leur propre copie du module, avec un
// `let` module-level qui ne serait alors JAMAIS partagé entre elles — le
// job créé par /api/reservations resterait invisible depuis
// /api/reviews/status. `globalThis` est le seul point réellement partagé
// par tout le process Node. Même technique que le singleton Prisma
// recommandé par Next.js pour contourner ce problème en dev (HMR).
const g = globalThis as unknown as {
  __reviewsMemoryStore?: MemoryReviewStore;
  __reviewsSupabaseStore?: ReviewJobStore;
};

export function getReviewStore(): ReviewJobStore {
  if (getReviewsStoreMode() === "supabase") {
    // Instanciation paresseuse : aucune credential lue tant qu'une méthode
    // n'est pas appelée → l'import du module ne peut jamais casser le build.
    g.__reviewsSupabaseStore ??= createSupabaseReviewStore();
    return g.__reviewsSupabaseStore;
  }
  g.__reviewsMemoryStore ??= new MemoryReviewStore();
  return g.__reviewsMemoryStore;
}
