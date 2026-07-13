/**
 * Template de l'email "Relance avis Google" — envoyé quelques heures après
 * la réservation.
 *
 * RÈGLE DE CONFORMITÉ — NE JAMAIS CONTOURNER :
 * Le même email, avec le même unique bouton vers Google, est envoyé à TOUS
 * les clients ayant réservé — jamais de question de satisfaction en amont
 * pour orienter les clients mécontents vers un canal privé plutôt que
 * Google. Cette pratique ("review gating") est interdite par les conditions
 * d'utilisation de Google et risquée juridiquement. Un seul chemin, pour
 * tout le monde, toujours.
 *
 * Email HTML = styles INLINE uniquement, tables pour la mise en page (pas de
 * flex/grid) : la plupart des clients mail (Gmail en tête) ignorent ou
 * dégradent le CSS externe/moderne. Construit en template string plutôt
 * qu'en JSX+renderToStaticMarkup : évite toute ambiguïté avec le graphe de
 * build Next.js (Server/Client Components) pour un fichier qui ne rend
 * jamais une page — juste une string HTML consommée par l'API d'email.
 */

import type { BusinessProfile, ReviewJob } from "../types";

function formatReservationDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderReviewRequestEmail(
  job: ReviewJob,
  business: BusinessProfile
): { subject: string; html: string } {
  const { brand } = business;
  const subject = `Un avis sur votre visite chez ${business.name} ?`;
  const unsubscribeUrl = `${
    process.env.SITE_URL || "https://exemple-commerce.fr"
  }/api/reviews/unsubscribe?id=${job.id}`;
  const name = escapeHtml(business.name);

  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:${brand.fontFamily};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f2f2;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:${brand.background};border-radius:16px;overflow:hidden;max-width:480px;">
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${brand.primary};">${name}</p>
              <h1 style="margin:14px 0 0;font-size:22px;line-height:1.3;color:${brand.ink};">Merci pour votre visite !</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 32px 0;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:${brand.ink};opacity:0.85;">
                Vous avez réservé chez ${name} le ${formatReservationDate(job.reservationAt)}. On espère que tout s'est bien passé.
              </p>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${brand.ink};opacity:0.85;">
                Si vous avez deux minutes, un avis Google nous aide énormément — et aide aussi les prochains clients à nous trouver.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;text-align:center;">
              <a href="${business.googleReviewUrl}" style="display:inline-block;background-color:${brand.primary};color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:10px;">
                Laisser un avis Google
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;border-top:1px solid ${brand.ink}1A;">
              <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:${brand.ink};opacity:0.5;">
                Vous recevez cet email suite à votre réservation chez ${name}.
                <a href="${unsubscribeUrl}" style="color:${brand.ink};opacity:0.7;">Ne plus recevoir ce type d'email</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
