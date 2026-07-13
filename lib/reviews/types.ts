/**
 * Types du module "Relance avis Google" (marque blanche).
 * Volontairement agnostique du fournisseur d'email : le mode "demo" et le
 * mode "live" (Resend) implémentent tous deux l'interface `EmailProvider`.
 * Même logique de séparation que lib/delivery.
 */

export type EmailMode = "demo" | "live";

export type ReviewJobStatus =
  | "scheduled" // en attente de l'heure d'envoi
  | "sent"      // envoyé pour de vrai (mode live)
  | "simulated" // envoi simulé (mode demo), jamais parti réellement
  | "error"     // tentative d'envoi échouée
  | "canceled"; // désinscrit avant l'envoi

/** Jetons de marque du commerçant — l'email reprend SA charte, pas celle de NOVA. */
export interface BusinessBrand {
  primary: string;   // couleur d'accent (bouton CTA)
  ink: string;       // couleur de texte principale
  background: string;
  fontFamily: string; // pile de polices "email-safe" (web fonts non fiables en email)
}

export interface BusinessProfile {
  id: string;
  name: string;
  /** Lien DIRECT vers la fenêtre de notation Google (pas la fiche générale). */
  googleReviewUrl: string;
  brand: BusinessBrand;
  /** Délai avant envoi, propre à ce commerce (prime sur le défaut global). */
  reviewDelayHours?: number;
}

export interface ReviewJob {
  id: string;
  businessId: string;
  customerEmail: string;
  customerName?: string;
  /** Date/heure de la réservation (ISO 8601). */
  reservationAt: string;
  /** Date/heure calculée d'envoi de la relance (ISO 8601). */
  sendAt: string;
  status: ReviewJobStatus;
  createdAt: string;
  sentAt?: string;
  error?: string;
  mode: EmailMode;
  /** true si ce client a demandé à ne plus recevoir ce type d'email. */
  unsubscribed?: boolean;
}

export interface CreateReviewJobInput {
  businessId: string;
  customerEmail: string;
  customerName?: string;
  reservationAt: string;
  /** Override ponctuel du délai (minutes) — utilisé par la démo pour tester vite. */
  delayMinutesOverride?: number;
}

export interface SendResult {
  status: "sent" | "simulated" | "error";
  providerId?: string;
  error?: string;
}

/** Contrat commun aux fournisseurs d'email (démo et réel). */
export interface EmailProvider {
  readonly mode: EmailMode;
  sendReviewRequest(job: ReviewJob, business: BusinessProfile): Promise<SendResult>;
}

/** Contrat de persistance des jobs planifiés (mémoire en dev, Supabase en prod). */
export interface ReviewJobStore {
  create(job: ReviewJob): Promise<void>;
  get(id: string): Promise<ReviewJob | null>;
  listAll(): Promise<ReviewJob[]>;
  /** Jobs "scheduled" dont sendAt <= now, jamais désinscrits. */
  listDue(now: Date): Promise<ReviewJob[]>;
  markSent(id: string, result: SendResult): Promise<void>;
  unsubscribe(id: string): Promise<void>;
  isUnsubscribed(businessId: string, email: string): Promise<boolean>;
}
