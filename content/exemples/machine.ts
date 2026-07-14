/**
 * Contenu du site fictif "Au Poil" — exemple concret du plan
 * **Machine** (dès 1990€, voir `v3plans` dans content/v3.ts).
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
    text: "Relance avis envoyée à Camille D. — 2 min après son rendez-vous",
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
    text: "Relance avis envoyée à Sophie B. — 2 min après son rendez-vous",
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
    name: "Au Poil",
    tagline: "Toilettage canin, en douceur",
    address: "21 rue de Paris, 94300 Vincennes",
    hours: "Mardi–samedi · 9h–18h",
    googleRating: "4,9/5",
    googleReviews: 211,
  },

  nav: [
    { label: "Accueil", href: "/exemples/machine" },
    { label: "Prestations", href: "/exemples/machine/prestations" },
    { label: "Galerie", href: "/exemples/machine/galerie" },
    { label: "À propos", href: "/exemples/machine/a-propos" },
    { label: "Contact", href: "/exemples/machine/contact" },
    { label: "Espace admin", href: "/exemples/machine/espace-admin" },
  ],

  accueil: {
    eyebrow: "Toilettage canin",
    title: "Votre compagnon mérite le meilleur accueil.",
    subtitle:
      "Bain, tonte et soins pour chiens de toutes tailles, dans un cadre calme, au cœur de Vincennes.",
    cta: "Prendre rendez-vous",
    highlights: [
      { icon: "🐾", text: "Toiletteurs formés, gestes doux" },
      { icon: "🕒", text: "Horaires toujours à jour" },
      { icon: "📍", text: "En plein centre-ville de Vincennes" },
    ],
    // Ce qui distingue ce plan d'Autonome : ici, c'est le système qui agit.
    // Affiché en évidence sur l'accueil, à côté du flux d'activité, pour
    // que le contraste avec /exemples/autonome saute aux yeux.
    philosophy:
      "Ici, vous ne faites rien — le site travaille pendant que vous êtes ailleurs.",
  },

  // Flux d'activité qui se remplit tout seul, sans clic — la mise en scène
  // centrale de cette page. Utilise le même composant NotifFeed que le
  // Hero du site principal (components/v3/NotifFeed.tsx).
  liveFeed: automationEvents,

  prestations: {
    eyebrow: "Prestations",
    title: "Nos prestations",
    subtitle:
      "Des tarifs clairs, affichés — et mis à jour directement par le salon.",
    services: [
      { name: "Bain complet", duration: "30 min", price: "25€" },
      { name: "Toilettage intégral", duration: "1h", price: "48€" },
      { name: "Tonte", duration: "45 min", price: "38€" },
      { name: "Démêlage", duration: "20 min", price: "15€" },
      { name: "Coupe des griffes", duration: "10 min", price: "10€" },
    ],
  },

  galerie: {
    eyebrow: "Galerie",
    title: "Un aperçu du salon",
    subtitle: "Quelques images de l'espace et de nos réalisations.",
    items: [
      { icon: "🐩", label: "L'espace toilettage", color: "violet" },
      { icon: "🛁", label: "Nos réalisations", color: "teal" },
      { icon: "✂️", label: "Matériel de soin", color: "corail" },
      { icon: "🧴", label: "Produits utilisés", color: "jaune" },
    ] as { icon: string; label: string; color: "violet" | "teal" | "corail" | "jaune" }[],
  },

  aPropos: {
    eyebrow: "À propos",
    title: "Qui sommes-nous ?",
    body: [
      "Au Poil, c'est une petite équipe de toiletteurs passionnés installée à Vincennes depuis plusieurs années.",
      "On prend le temps de rassurer chaque animal avant de le manipuler — jamais dans la précipitation.",
    ],
    values: [
      {
        title: "Douceur avant tout",
        text: "Chaque rendez-vous commence par un temps d'adaptation, à l'écoute de l'animal.",
      },
      {
        title: "Équipe formée en continu",
        text: "Techniques et bonnes pratiques suivies de près, race après race.",
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
    subtitle: "Confirmation automatique et immédiate — sans attendre personne.",
    fields: {
      name: "Votre nom",
      email: "Email",
      service: "Prestation souhaitée",
      message: "Un horaire qui vous arrange ?",
    },
    submit: "Envoyer ma demande",
    successTitle: "Confirmée automatiquement !",
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
          { label: "Mardi", value: "9h00 – 18h00" },
          { label: "Mercredi", value: "9h00 – 18h00" },
          { label: "Samedi", value: "9h00 – 17h00" },
        ],
      },
      {
        id: "textes",
        label: "Textes du site",
        icon: "📝",
        fields: [
          { label: "Titre d'accueil", value: "Votre compagnon mérite le meilleur accueil." },
          { label: "Sous-titre", value: "Bain, tonte et soins pour chiens de toutes tailles, à Vincennes." },
        ],
      },
      {
        id: "tarifs",
        label: "Prestations & tarifs",
        icon: "💶",
        fields: [
          { label: "Bain complet", value: "25€" },
          { label: "Toilettage intégral", value: "48€" },
          { label: "Tonte", value: "38€" },
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
