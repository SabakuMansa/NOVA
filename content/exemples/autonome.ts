/**
 * Contenu du site fictif "Salon Marguerite" — exemple concret du plan
 * **Autonome** (1490€, voir `v3plans` dans content/v3.ts).
 *
 * Périmètre STRICTEMENT limité à ce que couvre ce plan : site complet
 * sur-mesure, espace admin (mockup visuel, non connecté), prise de
 * contact / rendez-vous intégrés, SEO local. Ne JAMAIS ajouter ici :
 * automatisations / relances d'avis / notifications (→ plan Machine),
 * ou e-commerce / panier / paiement (→ module Boutique en ligne).
 */

type PlanningSlot = { text: string; free?: boolean; editable?: boolean };

export const autonomeDemo = {
  business: {
    name: "Salon Marguerite",
    tagline: "Coiffure & soins, dans une ambiance chaleureuse",
    address: "8 rue du Marché, 92150 Suresnes",
    hours: "Mardi–samedi · 9h30–18h30",
    googleRating: "4,9/5",
    googleReviews: 154,
  },

  nav: [
    { label: "Accueil", href: "/exemples/autonome" },
    { label: "Prestations", href: "/exemples/autonome/prestations" },
    { label: "Galerie", href: "/exemples/autonome/galerie" },
    { label: "À propos", href: "/exemples/autonome/a-propos" },
    { label: "Contact", href: "/exemples/autonome/contact" },
    { label: "Espace admin", href: "/exemples/autonome/espace-admin" },
  ],

  accueil: {
    eyebrow: "Salon de coiffure",
    title: "Un salon à votre image, du premier coup d'œil.",
    subtitle:
      "Coupes, couleurs et soins sur rendez-vous, au cœur de Suresnes. Toute l'équipe vous accueille du mardi au samedi.",
    cta: "Prendre rendez-vous",
    highlights: [
      { icon: "✂️", text: "Coiffeurs expérimentés, à l'écoute" },
      { icon: "🕒", text: "Horaires toujours à jour" },
      { icon: "📍", text: "En plein centre-ville de Suresnes" },
    ],
    // Ce qui distingue ce plan de Machine : ici, c'est le commerçant qui
    // agit. Affiché en évidence sur l'accueil pour que le contraste avec
    // /exemples/machine saute aux yeux dès le premier écran.
    philosophy:
      "Ici, c'est vous qui décidez et qui modifiez — en 2 minutes, sans coder.",

    // Hero immersif "Maison Doré" (design handoff du 21/07) — recréation
    // fidèle du hero du zip (salon haussmannien chic), adaptée à l'identité
    // déjà établie de Salon Marguerite (Suresnes, pas de fausse date de
    // fondation inventée — le zip mentionnait "depuis 1911", non repris).
    heroBadge: "Salon de coiffure · Suresnes",
    heroTitleRest: "L'élégance",
    heroTitleAccent: "se cultive",
    heroParagraph:
      "Sous la verrière et les miroirs biseautés, notre équipe imagine avec vous la coupe et la couleur qui vous ressemblent.",
    heroImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80&auto=format&fit=crop",
    heroImageAlt: "Intérieur chaleureux du salon Marguerite, à Suresnes",
  },

  // Module clé "Planning du mardi 21" — recréation fidèle du module
  // "Espace salon" du zip (planning + stats), avec l'identité de Salon
  // Marguerite. Aucun prénom de coiffeur n'étant déjà établi ailleurs dans
  // ce contenu, "Camille" et "Nadia" sont deux prénoms plausibles inventés
  // pour l'exemple (copie générique du zip, non liée à "Maison Doré").
  // Un seul créneau (10:00 / Camille) porte `editable: true` : c'est celui
  // recréé avec l'affordance d'édition manuelle (crayon → champ + bouton
  // "Enregistrer"), cf. PlanningSlot dans app/exemples/autonome/page.tsx.
  planningModule: {
    eyebrow: "Espace salon",
    title: "Planning du mardi 21",
    badge: "7 rendez-vous",
    staff: ["Camille", "Nadia"],
    rows: [
      {
        time: "10:00",
        slots: [
          { text: "Mme Rey — Balayage", editable: true },
          { text: "libre", free: true },
        ] as PlanningSlot[],
      },
      {
        time: "11:30",
        slots: [
          { text: "M. Aubert — Coupe" },
          { text: "Mme Costa — Chignon" },
        ] as PlanningSlot[],
      },
      {
        time: "14:00",
        slots: [
          { text: "libre", free: true },
          { text: "Mlle Ba — Coloration" },
        ] as PlanningSlot[],
      },
    ],
    stats: {
      encaisseLabel: "Encaissé aujourd'hui",
      encaisseValue: "1 240 €",
      tauxLabel: "Taux de remplissage",
      tauxValue: "92 %",
    },
  },

  prestations: {
    eyebrow: "Prestations",
    title: "Nos prestations",
    subtitle:
      "Des tarifs clairs, affichés — et mis à jour directement par le salon.",
    services: [
      { name: "Coupe femme", duration: "45 min", price: "45€" },
      { name: "Coupe homme", duration: "30 min", price: "28€" },
      { name: "Couleur", duration: "1h30", price: "68€" },
      { name: "Brushing", duration: "30 min", price: "25€" },
      { name: "Soin profond", duration: "20 min", price: "18€" },
    ],
  },

  galerie: {
    eyebrow: "Galerie",
    title: "Un aperçu du salon",
    subtitle: "Quelques images de l'espace et de nos réalisations.",
    items: [
      { icon: "💈", label: "L'espace salon", color: "violet" },
      { icon: "✂️", label: "Nos réalisations", color: "teal" },
      { icon: "🪞", label: "Postes de coiffage", color: "corail" },
      { icon: "🧴", label: "Produits utilisés", color: "jaune" },
    ] as { icon: string; label: string; color: "violet" | "teal" | "corail" | "jaune" }[],
  },

  aPropos: {
    eyebrow: "À propos",
    title: "Qui sommes-nous ?",
    body: [
      "Salon Marguerite, c'est une équipe de coiffeurs passionnés installée à Suresnes depuis plusieurs années.",
      "On prend le temps d'écouter chaque client avant de proposer une coupe ou une couleur — jamais l'inverse.",
    ],
    values: [
      {
        title: "Écoute avant tout",
        text: "Chaque rendez-vous commence par une vraie discussion sur ce que vous voulez.",
      },
      {
        title: "Équipe formée en continu",
        text: "Techniques et tendances suivies de près, saison après saison.",
      },
      {
        title: "Ancrage local",
        text: "Un salon de quartier, ouvert toute l'année, six jours sur sept.",
      },
    ],
  },

  contact: {
    eyebrow: "Rendez-vous",
    title: "Réservez votre créneau",
    subtitle: "Dites-nous ce que vous souhaitez, on confirme rapidement.",
    fields: {
      name: "Votre nom",
      email: "Email",
      service: "Prestation souhaitée",
      message: "Un horaire qui vous arrange ?",
    },
    submit: "Envoyer ma demande",
  },

  // Espace admin — mockup VISUEL uniquement : illustre ce que le commerçant
  // pourrait modifier lui-même (horaires, textes, tarifs, photos), sans
  // aucune connexion réelle à une base de données ou un compte.
  espaceAdmin: {
    eyebrow: "Espace admin",
    title: "Votre site, vos mains.",
    subtitle:
      "Un aperçu de l'espace personnel où vous modifiez vous-même votre site — sans coder, sans appeler personne.",
    disclaimer:
      "Aperçu à titre de démonstration — cet espace n'est pas connecté à un vrai compte, rien n'est enregistré.",
    tabs: [
      {
        id: "horaires",
        label: "Horaires",
        icon: "🕒",
        fields: [
          { label: "Lundi", value: "Fermé" },
          { label: "Mardi", value: "9h30 – 18h30" },
          { label: "Mercredi", value: "9h30 – 18h30" },
          { label: "Samedi", value: "9h00 – 17h00" },
        ],
      },
      {
        id: "textes",
        label: "Textes du site",
        icon: "📝",
        fields: [
          { label: "Titre d'accueil", value: "Un salon à votre image, du premier coup d'œil." },
          { label: "Sous-titre", value: "Coupes, couleurs et soins sur rendez-vous, au cœur de Suresnes." },
        ],
      },
      {
        id: "tarifs",
        label: "Prestations & tarifs",
        icon: "💶",
        fields: [
          { label: "Coupe femme", value: "45€" },
          { label: "Coupe homme", value: "28€" },
          { label: "Couleur", value: "68€" },
        ],
      },
      {
        id: "photos",
        label: "Photos",
        icon: "🖼️",
        note: "Glissez une nouvelle image pour remplacer une photo du site — aucune compétence technique requise.",
      },
    ],
    saveLabel: "Enregistrer les modifications",
    savedConfirm: "Modifications enregistrées (démonstration).",
  },
};
