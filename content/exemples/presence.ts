/**
 * Contenu du site fictif "Maison Verdure" — exemple concret du plan
 * **Présence** (690€, voir `v3plans` dans content/v3.ts).
 *
 * Périmètre STRICTEMENT limité à ce que couvre ce plan : site 3-4 pages,
 * mobile, fiche Google Business mise en avant, formulaire de contact,
 * hébergement inclus (mention seulement). Ne JAMAIS ajouter ici :
 * espace admin / autonomie de contenu (→ plan Autonome), automatisations /
 * relances (→ plan Machine), e-commerce, ou système de réservation.
 */

export const presenceDemo = {
  business: {
    name: "Maison Verdure",
    tagline: "Plantes & décoration végétale",
    address: "12 rue des Tilleuls, 94100 Saint-Maur-des-Fossés",
    hours: "Mardi–samedi · 10h–19h",
    googleRating: "4,8/5",
    googleReviews: 92,
  },

  nav: [
    { label: "Accueil", href: "/exemples/presence" },
    { label: "Présentation", href: "/exemples/presence/presentation" },
    { label: "Galerie", href: "/exemples/presence/galerie" },
    { label: "Contact", href: "/exemples/presence/contact" },
  ],

  accueil: {
    eyebrow: "Boutique de plantes",
    title: "Des plantes qui font du bien à votre intérieur.",
    subtitle:
      "Sélection de plantes d'intérieur, poteries et conseils d'entretien, au cœur de Saint-Maur-des-Fossés.",
    cta: "Nous rendre visite",
    highlights: [
      { icon: "🌿", text: "Plantes sélectionnées à la main" },
      { icon: "🪴", text: "Conseils d'entretien personnalisés" },
      { icon: "📍", text: "En plein centre-ville" },
    ],
    // Hero immersif "Au Petit Marché" (design handoff du 21/07) — recréation
    // fidèle du hero du zip, adaptée à l'identité déjà établie de Maison
    // Verdure (boutique de plantes, pas un étal de fleurs coupées).
    heroBadge: "Sélection du moment · Toute la semaine",
    heroTitleAccent: "Vivantes",
    heroTitleRest: "toute l'année",
    heroImage:
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1000&q=80&auto=format",
    heroImageAlt: "Étal de plantes et fleurs de Maison Verdure",
  },

  // Module clé "La sélection du jour" — recréation fidèle du module "L'étal
  // du jour" du zip, avec de vraies références du catalogue plantes de
  // Maison Verdure (pas les fleurs coupées du zip).
  selectionDuJour: {
    title: "La sélection du jour",
    subtitle: "Arrivage mis à jour ce matin",
    items: [
      {
        name: "Monstera deliciosa",
        price: "32 €",
        image:
          "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=500&q=80&auto=format",
      },
      {
        name: "Pothos doré",
        price: "18 €",
        image:
          "https://images.unsplash.com/photo-1444930694458-01babf71870c?w=500&q=80&auto=format",
      },
      {
        name: "Ficus lyrata",
        price: "45 €",
        image:
          "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=500&q=80&auto=format",
      },
    ],
    mystery: {
      title: "Plante mystère du jour",
      text: "Le chouchou de la boutique, en quantité limitée.",
      price: "à partir de 9 €",
    },
  },

  presentation: {
    eyebrow: "Présentation",
    title: "Qui sommes-nous ?",
    body: [
      "Maison Verdure est née d'une passion simple : donner à chacun l'envie et les moyens de vivre avec des plantes, même en appartement.",
      "Notre sélection change au fil des saisons, toujours choisie pour sa robustesse autant que pour sa beauté.",
    ],
    values: [
      {
        title: "Sélection soignée",
        text: "Chaque plante est choisie pour sa qualité et sa facilité d'entretien.",
      },
      {
        title: "Conseil sincère",
        text: "On vous dit ce qui marchera vraiment chez vous, pas ce qui se vend le plus cher.",
      },
      {
        title: "Ancrage local",
        text: "Une boutique de quartier, ouverte toute l'année.",
      },
    ],
  },

  galerie: {
    eyebrow: "Galerie",
    title: "Un aperçu de la boutique",
    subtitle: "Quelques images de l'espace et de la sélection du moment.",
    items: [
      { icon: "🪴", label: "L'espace boutique", color: "violet" },
      { icon: "🌿", label: "La sélection du mois", color: "teal" },
      { icon: "🏺", label: "Poteries & accessoires", color: "corail" },
      { icon: "🌱", label: "Coin conseils", color: "jaune" },
    ] as { icon: string; label: string; color: "violet" | "teal" | "corail" | "jaune" }[],
  },

  contact: {
    eyebrow: "Contact",
    title: "Passez nous voir",
    subtitle: "Une question sur une plante ? Écrivez-nous, on répond vite.",
    fields: {
      name: "Votre nom",
      email: "Email",
      message: "Votre message",
    },
    submit: "Envoyer",
  },
};
