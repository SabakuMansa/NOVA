/**
 * Contenu du site fictif "Au Poil" — exemple concret du plan
 * **Machine** (dès 1990€, voir `v3plans` dans content/v3.ts).
 * Nommé "Croissance Digitale" dans la demande initiale — ce nom n'existe
 * pas dans le contenu actuel, il s'agit bien du plan "Machine" (dès 1990€,
 * corail, "automatisations : relances d'avis, notifications", "tableau de
 * bord simple"). L'URL de la route suit toutefois le nom demandé.
 *
 * Périmètre STRICTEMENT limité à ce que couvre ce plan : tout ce qui est
 * dans Autonome (site complet, espace admin, contact/rendez-vous, SEO
 * local), PLUS automatisations visibles (relance avis Google, tableau de
 * bord simple), en mockup visuel — pas de vraie connexion backend. Ne
 * JAMAIS ajouter ici : e-commerce / panier / paiement (→ module Boutique
 * en ligne).
 */

export const croissanceDigitaleDemo = {
  business: {
    name: "Au Poil",
    tagline: "Toilettage canin, en douceur",
    address: "21 rue de Paris, 94300 Vincennes",
    hours: "Mardi–samedi · 9h–18h",
    googleRating: "4,9/5",
    googleReviews: 211,
  },

  nav: [
    { label: "Accueil", href: "/exemples/croissance-digitale" },
    { label: "Prestations", href: "/exemples/croissance-digitale/prestations" },
    { label: "Galerie", href: "/exemples/croissance-digitale/galerie" },
    { label: "À propos", href: "/exemples/croissance-digitale/a-propos" },
    { label: "Contact", href: "/exemples/croissance-digitale/contact" },
    { label: "Espace admin", href: "/exemples/croissance-digitale/espace-admin" },
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
  },

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
    subtitle: "Dites-nous ce que vous souhaitez, on confirme rapidement.",
    fields: {
      name: "Votre nom",
      email: "Email",
      service: "Prestation souhaitée",
      message: "Un horaire qui vous arrange ?",
    },
    submit: "Envoyer ma demande",
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
    tabs: [
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
      {
        id: "automatisations",
        label: "Automatisations",
        icon: "🔔",
        notifications: [
          {
            icon: "⭐",
            text: "Avis Google 5★ reçu — relance de remerciement envoyée automatiquement",
            tag: "avis",
          },
          {
            icon: "📩",
            text: "Relance envoyée à un client 3 jours après son rendez-vous",
            tag: "avis",
          },
          {
            icon: "🔔",
            text: "Nouvelle demande de rendez-vous — notification envoyée au gérant",
            tag: "rdv",
          },
        ],
      },
      {
        id: "tableau-de-bord",
        label: "Tableau de bord",
        icon: "📊",
        stats: [
          { icon: "👀", label: "Visiteurs ce mois-ci", value: "1 284" },
          { icon: "⭐", label: "Avis Google générés", value: "18" },
          { icon: "✅", label: "Taux de réponse aux demandes", value: "96 %" },
        ],
      },
    ],
    saveLabel: "Enregistrer les modifications",
    savedConfirm: "Modifications enregistrées (démonstration).",
  },
};
