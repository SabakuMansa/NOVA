/**
 * Contenu du site fictif "Chez Fernand" — exemple concret du plan
 * **Machine** (dès 1990€, voir `v3plans` dans content/v3.ts).
 *
 * Univers recréé le 21/07 à partir du design handoff hifi (bistrot parisien
 * traditionnel, palette bordeaux/or/ardoise) — voir
 * .design-handoff-tmp/design_handoff_pages_demo/README.md. Le nom de la
 * maquette source était « Chez Margot » ; conformément à la convention déjà
 * établie sur ce projet (ne jamais reprendre le nom littéral d'une
 * maquette), le commerce fictif s'appelle ici **Chez Fernand**. Changement
 * d'identité commerçante complet (l'ancien "Au Poil", toiletteur canin, ne
 * pouvait pas raisonnablement héberger une ardoise de plats bistrot) — voir
 * le comparatif Autonome/Machine ci-dessous, qui reste inchangé.
 *
 * Différenciateur avec Autonome : ici le commerçant n'agit plus, le
 * système agit à sa place. Seules des automatisations réellement
 * livrables aujourd'hui (stack Resend + Supabase) sont mises en scène :
 * relance avis Google post-réservation, confirmation automatique de
 * réservation, réponse automatique à une demande de contact, tableau de
 * bord basé sur des données réellement collectées par le site (jamais une
 * fausse synchronisation Google). Ne JAMAIS ajouter ici : le module
 * Uber Direct/livraison (vendu séparément), un nombre d'avis Google
 * synchronisé (non branché techniquement), un filtrage des avis par
 * satisfaction (illégal, review gating), ou e-commerce / panier /
 * paiement (→ module Boutique en ligne).
 */

// Événements des automatisations réellement livrables aujourd'hui (Resend +
// Supabase) : relance avis post-réservation, confirmation auto de
// réservation, réponse auto à une demande de contact. Partagé entre le flux
// de l'accueil et l'onglet "Automatisations" de l'espace admin — 6 entrées
// pour que les 4 lignes visibles de NotifFeed ne se répètent jamais dans la
// même fenêtre.
const automationEvents = [
  {
    icon: "⭐",
    text: "Relance avis envoyée à Camille D. — 2 min après son repas",
    tag: "avis",
  },
  {
    icon: "✅",
    text: "Réservation confirmée automatiquement pour Julien M.",
    tag: "résa",
  },
  {
    icon: "📩",
    text: "Réponse automatique envoyée à une demande de contact",
    tag: "contact",
  },
  {
    icon: "⭐",
    text: "Relance avis envoyée à Sophie B. — 2 min après son repas",
    tag: "avis",
  },
  {
    icon: "✅",
    text: "Réservation confirmée automatiquement pour Nadia K.",
    tag: "résa",
  },
  {
    icon: "📩",
    text: "Accusé de réception envoyé à une nouvelle demande de contact",
    tag: "contact",
  },
];

export const machineDemo = {
  business: {
    name: "Chez Fernand",
    tagline: "Bistrot de quartier, cuisine du marché",
    address: "21 rue de Paris, 94300 Vincennes",
    hours: "Mardi–samedi · 12h–14h30, 19h–22h30",
    googleRating: "4,9/5",
    googleReviews: 211,
  },

  nav: [
    { label: "Accueil", href: "/exemples/machine" },
    { label: "La carte", href: "/exemples/machine/prestations" },
    { label: "Galerie", href: "/exemples/machine/galerie" },
    { label: "À propos", href: "/exemples/machine/a-propos" },
    { label: "Réserver", href: "/exemples/machine/contact" },
    { label: "Espace admin", href: "/exemples/machine/espace-admin" },
  ],

  accueil: {
    eyebrow: "Bistrot de quartier",
    title: "La table des habitués, à deux pas de chez vous.",
    subtitle:
      "Cuisine de bistrot généreuse et desserts maison, au cœur de Vincennes.",
    cta: "Voir la carte",
    highlights: [
      { icon: "🍷", text: "Cave et produits sélectionnés avec soin" },
      { icon: "🕒", text: "Horaires toujours à jour" },
      { icon: "📍", text: "En plein centre-ville de Vincennes" },
    ],
    // Ce qui distingue ce plan d'Autonome : ici, c'est le système qui agit.
    // Affiché en évidence sur l'accueil, à côté du flux d'activité, pour
    // que le contraste avec /exemples/autonome saute aux yeux.
    philosophy:
      "Ici, vous ne faites rien — le site travaille pendant que vous êtes ailleurs.",

    // Hero immersif "bistrot parisien traditionnel" (design handoff du
    // 21/07) — recréation fidèle du hero du zip (mêmes proportions/textes),
    // adaptée à l'identité fictive Chez Fernand / Vincennes plutôt qu'au
    // "Chez Margot · Paris 11ᵉ" de la maquette.
    heroBadge: "Cuisine de comptoir · Vincennes",
    heroTitleRest: "La table",
    heroTitleAccent: "des habitués",
    heroQuote: "On y mange comme à la maison, en un peu mieux.",
    heroImage:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80&auto=format&fit=crop",
    heroImageAlt:
      "Salle du restaurant Chez Fernand, tables dressées en fin de service",

    // Petit indicateur d'activité automatique affiché juste sous l'ardoise
    // du jour — le module clé du zip est purement décoratif (une carte de
    // menu), il ne montre aucune automatisation. Cette ligne rend visible,
    // au plus près du module, que c'est le système qui agit seul (cf.
    // philosophy ci-dessus et le distinguo Autonome/Machine du header).
    automationHighlight: {
      text: "Relance avis envoyée automatiquement à un client",
      time: "il y a 2 min",
    },
  },

  // Module clé "Ardoise du jour" — recréation quasi verbatim du zip (vrai
  // contenu bistrot, directement réutilisable pour Chez Fernand). Date du
  // zip conservée telle quelle : elle tombe justement un vrai mardi 21
  // juillet.
  ardoiseDuJour: {
    title: "Ardoise du jour",
    date: "Mardi 21 juillet",
    items: [
      { name: "Œuf mayo maison", price: "6 €" },
      { name: "Blanquette de veau, riz", price: "19 €" },
      { name: "Entrecôte, frites maison", price: "24 €" },
      { name: "Tarte Tatin, crème", price: "8 €" },
    ],
    footer: "Menu déjeuner — 2 plats 23 € · 3 plats 29 €",
  },

  // Flux d'activité qui se remplit tout seul, sans clic — la mise en scène
  // centrale de cette page. Utilise le même composant NotifFeed que le
  // Hero du site principal (components/v3/NotifFeed.tsx).
  liveFeed: automationEvents,

  prestations: {
    eyebrow: "La carte",
    title: "Notre carte",
    subtitle:
      "Des prix clairs, affichés — et mis à jour directement par le restaurant.",
    // Le champ `duration` (hérité du plan grooming) sert ici de catégorie
    // de plat — voir app/exemples/machine/prestations/page.tsx, qui
    // l'affiche tel quel en sous-titre sous le nom du plat : aucune
    // modification de structure nécessaire côté page.
    services: [
      { name: "Œuf mayo maison", duration: "Entrée", price: "6€" },
      { name: "Soupe à l'oignon gratinée", duration: "Entrée", price: "8€" },
      { name: "Blanquette de veau, riz", duration: "Plat", price: "19€" },
      { name: "Entrecôte, frites maison", duration: "Plat", price: "24€" },
      { name: "Poulet rôti, purée maison", duration: "Plat", price: "18€" },
      { name: "Tarte Tatin, crème", duration: "Dessert", price: "8€" },
      { name: "Mousse au chocolat maison", duration: "Dessert", price: "7€" },
    ],
  },

  galerie: {
    eyebrow: "Galerie",
    title: "Un aperçu du restaurant",
    subtitle: "Quelques images de la salle et de nos assiettes.",
    items: [
      { icon: "🍽️", label: "La salle", color: "violet" },
      { icon: "🍷", label: "La cave à vins", color: "teal" },
      { icon: "🌿", label: "La terrasse", color: "corail" },
      { icon: "👨‍🍳", label: "En cuisine", color: "jaune" },
    ] as { icon: string; label: string; color: "violet" | "teal" | "corail" | "jaune" }[],
  },

  aPropos: {
    eyebrow: "À propos",
    title: "Qui sommes-nous ?",
    body: [
      "Chez Fernand, c'est une petite équipe passionnée installée à Vincennes depuis plusieurs années.",
      "On cuisine des produits frais, achetés au marché le matin même, pour une carte qui change avec les saisons.",
    ],
    values: [
      {
        title: "Cuisine maison",
        text: "Tout est préparé sur place, des sauces aux desserts, sans raccourci.",
      },
      {
        title: "Produits du marché",
        text: "Une carte qui suit les saisons et les arrivages, pas l'inverse.",
      },
      {
        title: "Ancrage local",
        text: "Un bistrot de quartier, ouvert toute l'année, six jours sur sept.",
      },
    ],
  },

  contact: {
    eyebrow: "Réservation",
    title: "Réservez votre table",
    subtitle: "Confirmation automatique et immédiate — sans attendre personne.",
    fields: {
      name: "Votre nom",
      email: "Email",
      service: "Nombre de couverts",
      message: "Une heure qui vous arrange ?",
    },
    submit: "Envoyer ma demande",
    successTitle: "Réservation confirmée automatiquement !",
    successText:
      "Vous recevez une confirmation immédiate par email — personne n'a eu besoin de la valider à la main.",
  },

  // Espace admin — mockup VISUEL uniquement, sans connexion réelle. Reprend
  // la même mécanique que le plan Autonome (horaires/textes/tarifs/photos),
  // PLUS deux onglets spécifiques au plan Machine : automatisations
  // visibles et tableau de bord — la différence clé à mettre en valeur.
  espaceAdmin: {
    eyebrow: "Espace admin",
    title: "Votre site, vos mains. Et le reste tourne tout seul.",
    subtitle:
      "Le même espace personnel que le plan Autonome — avec en plus les automatisations qui travaillent pour vous.",
    disclaimer:
      "Aperçu à titre de démonstration — cet espace n'est pas connecté à un vrai compte, rien n'est enregistré.",
    // Automatisations et Tableau de bord en premier, volontairement : sur
    // ce plan, c'est ce qu'il y a de plus important à montrer. Les onglets
    // manuels (horaires/textes/tarifs/photos, hérités du plan Autonome)
    // restent disponibles mais ne sont plus la vitrine de la page.
    tabs: [
      {
        id: "automatisations",
        label: "Automatisations",
        icon: "🔔",
        notifications: automationEvents,
      },
      {
        id: "tableau-de-bord",
        label: "Tableau de bord",
        icon: "📊",
        stats: [
          { icon: "📅", label: "Réservations confirmées automatiquement", value: "42" },
          { icon: "⭐", label: "Relances avis envoyées", value: "37" },
          { icon: "✅", label: "Taux de réponse aux demandes", value: "96 %" },
        ],
        statsNote:
          "Données collectées par le site — pas une synchronisation avec votre fiche Google Business.",
      },
      {
        id: "horaires",
        label: "Horaires",
        icon: "🕒",
        fields: [
          { label: "Lundi", value: "Fermé" },
          { label: "Mardi", value: "12h–14h30 / 19h–22h30" },
          { label: "Mercredi", value: "12h–14h30 / 19h–22h30" },
          { label: "Samedi", value: "12h–14h30 / 19h–22h30" },
        ],
      },
      {
        id: "textes",
        label: "Textes du site",
        icon: "📝",
        fields: [
          { label: "Titre d'accueil", value: "La table des habitués, à deux pas de chez vous." },
          { label: "Sous-titre", value: "Cuisine de bistrot généreuse et desserts maison, à Vincennes." },
        ],
      },
      {
        id: "tarifs",
        label: "Carte & tarifs",
        icon: "💶",
        fields: [
          { label: "Menu déjeuner (2 plats)", value: "23€" },
          { label: "Menu déjeuner (3 plats)", value: "29€" },
          { label: "Entrecôte, frites maison", value: "24€" },
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
