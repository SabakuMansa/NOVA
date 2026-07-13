/**
 * Point d'entrée fournisseur d'email du module "Relance avis Google".
 *
 * Le reste du projet ne dépend QUE de ce fichier (jamais des implémentations).
 * Le mode est piloté par la variable d'environnement `EMAIL_MODE` :
 *   - "demo" (défaut, y compris si la variable est absente) → aucun envoi
 *     réel, simulation loggée.
 *   - "live" → vrai envoi via Resend (nécessite RESEND_API_KEY + domaine
 *     vérifié — voir README-reviews.md).
 *
 * Le site fonctionne normalement même si `EMAIL_MODE` n'est pas configuré.
 */

import { renderReviewRequestEmail } from "./templates/review-request";
import type { BusinessProfile, EmailMode, EmailProvider, ReviewJob, SendResult } from "./types";

export function getEmailMode(): EmailMode {
  return process.env.EMAIL_MODE === "live" ? "live" : "demo";
}

export function isEmailLive(): boolean {
  return getEmailMode() === "live";
}

/** Mode démo : aucun appel réseau. Log clair en console (mode "simulé"). */
const demoEmailProvider: EmailProvider = {
  mode: "demo",
  async sendReviewRequest(job: ReviewJob, business: BusinessProfile): Promise<SendResult> {
    const { subject } = renderReviewRequestEmail(job, business);
    // eslint-disable-next-line no-console
    console.log(
      `[reviews:demo] Email simulé → ${job.customerEmail} · "${subject}" ` +
        `· commerce=${business.name} · avis=${business.googleReviewUrl}`
    );
    return { status: "simulated", providerId: `demo-${job.id}` };
  },
};

/** Mode live : Resend, appelé en REST brut (pas de SDK — même logique que le
 *  client Uber Direct : une seule dépendance de moins à maintenir). */
const RESEND_API_URL = "https://api.resend.com/emails";

function createResendEmailProvider(): EmailProvider {
  return {
    mode: "live",
    async sendReviewRequest(job: ReviewJob, business: BusinessProfile): Promise<SendResult> {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM_EMAIL;
      if (!apiKey || !from) {
        throw new Error(
          "EMAIL_MODE=live demandé mais RESEND_API_KEY / RESEND_FROM_EMAIL sont " +
            "absentes. Renseignez-les dans .env.local — voir README-reviews.md " +
            "(domaine d'envoi vérifié requis)."
        );
      }
      const { subject, html } = renderReviewRequestEmail(job, business);

      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: job.customerEmail,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        return {
          status: "error",
          error: `Resend: ${res.status} — ${detail.slice(0, 300)}`,
        };
      }
      const data = (await res.json()) as { id: string };
      return { status: "sent", providerId: data.id };
    },
  };
}

let liveProvider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (getEmailMode() === "live") {
    // Instanciation paresseuse : aucune credential lue tant qu'on n'envoie pas
    // un email → l'import du module ne peut jamais casser le build.
    liveProvider ??= createResendEmailProvider();
    return liveProvider;
  }
  return demoEmailProvider;
}
