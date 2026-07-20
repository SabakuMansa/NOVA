import { seo } from "@/content/site";

/**
 * Données structurées Schema.org (JSON-LD).
 * Type ProfessionalService : activité de service, zone desservie Île-de-France.
 * Volontairement SANS adresse postale / SIRET pour l'instant — à compléter le
 * moment venu (address, priceRange, openingHours…).
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: seo.name,
    legalName: seo.legalName,
    description: seo.shortDescription,
    url: seo.siteUrl,
    email: seo.email,
    telephone: seo.phone,
    image: `${seo.siteUrl}/opengraph-image`,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Île-de-France" },
      { "@type": "AdministrativeArea", name: "Val-de-Marne" },
      { "@type": "AdministrativeArea", name: "Hauts-de-Seine" },
      { "@type": "City", name: "Saint-Maur-des-Fossés" },
      { "@type": "City", name: "Suresnes" },
    ],
    knowsLanguage: seo.languages,
    serviceType: [
      "Création de site internet",
      "SEO local",
      "Outils digitaux pour commerces",
    ],
    slogan:
      "Vos futurs clients vous cherchent déjà. Assurez-vous qu'ils vous trouvent.",
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
