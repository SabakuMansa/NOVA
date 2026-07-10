/**
 * Contenu éditorial de NOVA Studio.
 * Tout le texte du site vit ici : pour modifier une phrase, un prix ou une offre,
 * il suffit d'éditer ce fichier — aucun composant à toucher.
 */

export const nav = {
  brand: "NOVA Studio",
  links: [
    { label: "L'approche", href: "#approche" },
    { label: "La méthode", href: "#methode" },
    { label: "La carte", href: "#carte" },
    { label: "Aperçu", href: "#apercu" },
    { label: "Process", href: "#process" },
    { label: "Avis", href: "#avis" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Audit gratuit", href: "#contact" },
};

export const hero = {
  eyebrow: "CONÇU PAR UN RESTAURATEUR, PAS PAR UNE AGENCE",
  // Le mot en italique display est mis en avant via {em}
  titleLead: "Un site qui ne travaille pas pour vous n'est pas gratuit. Il vous coûte des",
  titleEm: "clients",
  subtitle:
    "Je gère des restaurants en Île-de-France. Je conçois des sites et des outils numériques pour que le digital vous fasse gagner du temps et des clients — pas l'inverse.",
  ctaPrimary: { label: "Réserver un audit gratuit (15 min)", href: "#contact" },
  ctaSecondary: { label: "Voir comment ça marche", href: "#process" },
  // Éléments de "l'ardoise" du hero
  slate: {
    label: "AUJOURD'HUI À LA CARTE",
    items: [
      { name: "Visibilité Google", note: "être trouvé au bon moment" },
      { name: "Espace autonome", note: "vous gardez la main" },
      { name: "Automatisations", note: "le digital travaille pour vous" },
    ],
    stamp: "Par un restaurateur, pour les commerçants",
  },
};

export const approche = {
  id: "approche",
  eyebrow: "CRÉDIBILITÉ",
  title: "Ce n'est pas une agence qui a lu sur les restaurants. C'est moi qui les gère.",
  intro: "Chaque situation ci-dessus, je l'ai vécue avant de la résoudre pour d'autres.",
  proofs: [
    "Un dimanche soir, pas de webmaster à qui écrire pour changer un horaire.",
    "Un client qui appelle parce que le site affiche encore l'ancien menu.",
    "Une heure de moins avec l'équipe parce qu'il a fallu répondre à un avis Google.",
  ],
  closing:
    "Chaque outil que je construis part de ces situations-là. Pas d'un cahier des charges théorique.",
  credibility: [
    "Restaurateur en activité",
    "Basé en Île-de-France",
    "Pensé pour être géré sans vous",
  ],
};

export const problemes = {
  id: "problemes",
  eyebrow: "LE CONSTAT",
  title: "Le vrai coût d'un site qui ne travaille pas pour vous.",
  subtitle: "Ce ne sont pas des détails. Ce sont des clients qui partent ailleurs.",
  cards: [
    {
      tag: "Dimanche soir",
      text: "Un client cherche un endroit comme le vôtre un dimanche soir. Il tombe sur un site qui n'a pas changé depuis 2019. Il réserve ailleurs.",
    },
    {
      tag: "La moindre modif",
      text: "Vous voulez changer un prix ou une photo. Il faut appeler quelqu'un, attendre, relancer. Le temps que ce soit fait, ce n'est déjà plus d'actualité.",
    },
    {
      tag: "L'angle mort",
      text: "Vous avez un site. Vous ne savez toujours pas s'il vous amène un seul client par mois.",
    },
    {
      tag: "Google",
      text: "Vos concurrents passent avant vous sur Google. Pas parce qu'ils sont meilleurs. Parce que leur fiche, elle, est à jour.",
    },
    {
      tag: "La commission",
      text: "Chaque commande livrée via une plateforme, c'est une part de votre marge qui part avant même d'avoir couvert vos coûts. Et ce n'est même pas votre client — c'est celui de la plateforme.",
    },
  ],
};

export const methode = {
  id: "methode",
  eyebrow: "LA MÉTHODE",
  title: "Trois choses que votre digital doit faire. Rien de plus.",
  pillars: [
    {
      name: "Visibilité",
      text: "Être visible au moment où quelqu'un cherche un endroit comme le vôtre. Pas juste exister quelque part sur internet.",
    },
    {
      name: "Autonomie",
      text: "Changer un prix, une photo, un horaire vous-même, en deux minutes. Sans dépendre de personne.",
    },
    {
      name: "Automatisation",
      text: "Ne plus répondre deux fois à la même question. Ne plus courir après les avis clients.",
    },
  ],
};

export type Offre = {
  name: string;
  price: string;
  priceValue: string;
  tagline: string;
  features: string[];
  subscription: string;
  featured?: boolean;
  badge?: string;
};

export const carte = {
  id: "carte",
  eyebrow: "LES OFFRES",
  title: "La carte",
  subtitle: "Un investissement qui se rembourse. Pas une dépense de plus.",
  offres: [
    {
      name: "Vitrine Essentielle",
      price: "690€",
      priceValue: "690",
      tagline: "Si votre priorité, c'est d'exister en ligne, sérieusement et rapidement.",
      features: [
        "Site 3–4 pages, pensé mobile",
        "Fiche Google Business optimisée",
        "Formulaire de contact",
        "Mise en ligne rapide",
      ],
      subscription: "puis 25€/mois",
    },
    {
      name: "Site Autonome",
      price: "1490€",
      priceValue: "1490",
      tagline: "Si vous voulez ne plus jamais dépendre de quelqu'un d'autre pour votre propre site.",
      features: [
        "Site complet sur-mesure",
        "Espace admin : photos, menu, horaires",
        "Réservation / contact intégré",
        "SEO local travaillé",
      ],
      subscription: "puis 45€/mois",
      featured: true,
      badge: "Recommandé",
    },
    {
      name: "Croissance Digitale",
      price: "dès 1990€",
      priceValue: "1990",
      tagline: "Si votre digital doit vous faire gagner du temps chaque semaine, pas juste exister.",
      features: [
        "Tout le Site Autonome",
        "Automatisations : relance d'avis, notifications",
        "Tableau de bord simple",
        "Accompagnement renforcé",
      ],
      subscription: "puis 95€/mois",
    },
  ] as Offre[],
  footnote: "Une question sur la formule qu'il vous faut ? Quinze minutes suffisent pour le savoir.",
  footnoteCta: { label: "Réserver 15 minutes", href: "#contact" },
  // Module optionnel présenté comme un add-on de « Croissance Digitale »
  // (pas une offre à part entière). ⚠️ Ne jamais nommer la marque technique.
  addon: {
    badge: "Add-on · Croissance Digitale",
    name: "Commande directe",
    tagline:
      "Vos clients commandent chez vous. La livraison suit, sans commission de plateforme.",
    description:
      "Vos clients commandent directement sur votre site. La livraison est prise en charge par un réseau de coursiers professionnels. Vous gardez votre client, ses données, et l'intégralité de votre marge — vous ne payez qu'une course, jamais un pourcentage sur la vente.",
    // Formulation prudente, sans chiffre non vérifié (cf. consigne).
    comparison:
      "Les plateformes de livraison prélèvent une commission sur chaque vente. Ici, vous ne payez que le coût réel de la course — jamais un pourcentage.",
  },
};

// --- Configurateur (section Aperçu) ---

export type CommerceType = "Restaurant" | "Boutique" | "Artisan" | "Association";
export type StyleType = "Chaleureux" | "Épuré" | "Premium";

export type PreviewCombo = {
  headline: string;
  tagline: string;
  cta: string;
  category: string;
  // palette de la maquette
  bg: string;
  surface: string;
  ink: string;
  accent: string;
  // rendu typographique du titre de la maquette
  titleFont: "serif" | "sans" | "mono";
  // motif d'illustration SVG
  motif: "plate" | "bag" | "tools" | "heart";
};

export const apercu = {
  id: "apercu",
  eyebrow: "DÉMONSTRATION",
  title: "Voyez, plutôt qu'on vous le décrive.",
  subtitle: "Choisissez votre activité et un style. L'aperçu s'ajuste en direct.",
  commerceTypes: ["Restaurant", "Boutique", "Artisan", "Association"] as CommerceType[],
  styleTypes: ["Chaleureux", "Épuré", "Premium"] as StyleType[],
  disclaimer:
    "Ceci reste un aperçu simplifié. Votre vrai site sera pensé pour votre commerce, pas pour une démo.",
  cta: { label: "Discuter du mien", href: "#contact" },
  // Option facultative du configurateur : ajoute un bouton "Commander" + un
  // badge dans l'aperçu. Aucune marque technique visible.
  deliveryOption: {
    label: "Avec commande directe",
    cta: "Commander",
    badge: "Livraison sans commission",
  },
};

// 12 combinaisons pré-écrites (4 commerces × 3 styles), 100% en dur.
export const previewCombos: Record<
  CommerceType,
  Record<StyleType, PreviewCombo>
> = {
  Restaurant: {
    Chaleureux: {
      headline: "La table qui vous ressemble",
      tagline: "Cuisine de saison, ambiance de quartier. Réservez votre table en deux clics.",
      cta: "Réserver une table",
      category: "BISTROT · SAINT-MAUR",
      bg: "#F5EEE1",
      surface: "#EDE2CE",
      ink: "#2E2521",
      accent: "#7A2E2E",
      titleFont: "serif",
      motif: "plate",
    },
    Épuré: {
      headline: "Bien manger, simplement",
      tagline: "Une carte courte, des produits justes. Ouvert du mardi au samedi.",
      cta: "Voir la carte",
      category: "RESTAURANT",
      bg: "#FBFAF7",
      surface: "#F1EFE9",
      ink: "#2E2521",
      accent: "#6E7B58",
      titleFont: "sans",
      motif: "plate",
    },
    Premium: {
      headline: "Une expérience à table",
      tagline: "Gastronomie, accords mets & vins, service d'exception. Sur réservation.",
      cta: "Réserver une expérience",
      category: "TABLE GASTRONOMIQUE",
      bg: "#211C1A",
      surface: "#2E2521",
      ink: "#F5EEE1",
      accent: "#C89B3C",
      titleFont: "serif",
      motif: "plate",
    },
  },
  Boutique: {
    Chaleureux: {
      headline: "Vos trouvailles de quartier",
      tagline: "Une sélection choisie avec soin. Poussez la porte, on vous attend.",
      cta: "Découvrir la boutique",
      category: "CONCEPT STORE",
      bg: "#F5EEE1",
      surface: "#EDE2CE",
      ink: "#2E2521",
      accent: "#C89B3C",
      titleFont: "serif",
      motif: "bag",
    },
    Épuré: {
      headline: "L'essentiel, bien choisi",
      tagline: "Des pièces qui durent, sans superflu. Nouvelle collection en boutique.",
      cta: "Voir la sélection",
      category: "BOUTIQUE",
      bg: "#FBFAF7",
      surface: "#F1EFE9",
      ink: "#2E2521",
      accent: "#2E2521",
      titleFont: "sans",
      motif: "bag",
    },
    Premium: {
      headline: "La sélection d'exception",
      tagline: "Pièces rares et conseil personnalisé. Sur rendez-vous ou en boutique.",
      cta: "Prendre rendez-vous",
      category: "MAISON · SÉLECTION",
      bg: "#211C1A",
      surface: "#2E2521",
      ink: "#F5EEE1",
      accent: "#C89B3C",
      titleFont: "serif",
      motif: "bag",
    },
  },
  Artisan: {
    Chaleureux: {
      headline: "Le savoir-faire, près de chez vous",
      tagline: "Un métier, une passion, un contact direct. Demandez votre devis.",
      cta: "Demander un devis",
      category: "ATELIER · ÎLE-DE-FRANCE",
      bg: "#F5EEE1",
      surface: "#EDE2CE",
      ink: "#2E2521",
      accent: "#7A2E2E",
      titleFont: "serif",
      motif: "tools",
    },
    Épuré: {
      headline: "Un travail bien fait",
      tagline: "Devis clair, délais tenus, finitions soignées. Parlons de votre projet.",
      cta: "Parler de mon projet",
      category: "ARTISAN",
      bg: "#FBFAF7",
      surface: "#F1EFE9",
      ink: "#2E2521",
      accent: "#6E7B58",
      titleFont: "sans",
      motif: "tools",
    },
    Premium: {
      headline: "L'artisanat d'exception",
      tagline: "Pièces sur-mesure et matériaux nobles. Un accompagnement de A à Z.",
      cta: "Débuter un projet",
      category: "ATELIER · SUR-MESURE",
      bg: "#211C1A",
      surface: "#2E2521",
      ink: "#F5EEE1",
      accent: "#C89B3C",
      titleFont: "serif",
      motif: "tools",
    },
  },
  Association: {
    Chaleureux: {
      headline: "Ensemble, on va plus loin",
      tagline: "Rejoignez une équipe engagée près de chez vous. Adhérez en ligne.",
      cta: "Nous rejoindre",
      category: "ASSOCIATION LOCALE",
      bg: "#F5EEE1",
      surface: "#EDE2CE",
      ink: "#2E2521",
      accent: "#6E7B58",
      titleFont: "serif",
      motif: "heart",
    },
    Épuré: {
      headline: "Agir, simplement",
      tagline: "Nos actions, nos rendez-vous, comment participer. Tout est clair.",
      cta: "Voir nos actions",
      category: "ASSOCIATION",
      bg: "#FBFAF7",
      surface: "#F1EFE9",
      ink: "#2E2521",
      accent: "#6E7B58",
      titleFont: "sans",
      motif: "heart",
    },
    Premium: {
      headline: "Un engagement qui compte",
      tagline: "Soutenez nos projets et suivez leur impact en toute transparence.",
      cta: "Soutenir la cause",
      category: "FONDATION · MÉCÉNAT",
      bg: "#211C1A",
      surface: "#2E2521",
      ink: "#F5EEE1",
      accent: "#C89B3C",
      titleFont: "serif",
      motif: "heart",
    },
  },
};

export const process = {
  id: "process",
  eyebrow: "COMMENT ÇA SE PASSE",
  title: "Ce qui se passe après que vous ayez cliqué sur ce bouton.",
  steps: [
    { n: "01", name: "Audit", text: "15 minutes pour comprendre votre activité. Pas un argumentaire de vente déguisé." },
    { n: "02", name: "Proposition", text: "Un devis clair sous 48h. Un prix, pas une fourchette." },
    { n: "03", name: "Conception", text: "Vous validez avant qu'une seule ligne de code soit écrite." },
    { n: "04", name: "Développement", text: "Des points d'étape réguliers. Jamais trois semaines de silence." },
    { n: "05", name: "Livraison", text: "On configure votre espace ensemble, en direct. Pas un tutoriel PDF." },
    { n: "06", name: "Suivi", text: "Je reste disponible après la mise en ligne. Pas seulement pendant le projet." },
  ],
};

export const contact = {
  id: "contact",
  eyebrow: "CONTACT",
  title: "Parlons de votre commerce, pas de technique.",
  subtitle: "Audit gratuit, sans engagement. Réponse sous 24h.",
  intro:
    "Dites-m'en un peu sur votre commerce. Le reste, on le voit ensemble.",
  email: "bonjour@nova-studio.fr",
  phone: "06 12 34 56 78",
  fields: {
    name: "Votre nom",
    business: "Nom du commerce",
    city: "Ville",
    email: "Email",
    phone: "Téléphone",
    message: "Parlez-moi de votre projet",
  },
  submit: "Réserver mon audit gratuit",
};

export const footer = {
  brand: "NOVA Studio",
  tagline: "Studio digital local — Île-de-France",
  blurb:
    "Des sites et des outils digitaux pensés pour les commerces locaux, par un restaurateur en activité.",
  columns: [
    {
      title: "Le studio",
      links: [
        { label: "L'approche", href: "#approche" },
        { label: "La méthode", href: "#methode" },
        { label: "La carte", href: "#carte" },
      ],
    },
    {
      title: "Aller plus loin",
      links: [
        { label: "Aperçu interactif", href: "#apercu" },
        { label: "Le process", href: "#process" },
        { label: "Réserver un audit", href: "#contact" },
      ],
    },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  legal: [
    { label: "Mentions légales", href: "#" },
    { label: "Confidentialité", href: "#" },
  ],
  copyright: "© 2026 NOVA Studio. Conçu en Île-de-France.",
};

/* ------------------------------------------------------------------ *
 * SEO / identité — ⚠️ « NOVA Studio » est un nom de code.            *
 * Remplace ces valeurs par les vraies (domaine, nom, email…) avant   *
 * la mise en ligne. Aucune adresse postale n'est inventée ici.       *
 * ------------------------------------------------------------------ */
export const seo = {
  // ⚠️ Domaine placeholder — à remplacer par le vrai nom de domaine.
  siteUrl: "https://nova-studio.fr",
  name: "NOVA Studio",
  legalName: "NOVA Studio",
  shortDescription:
    "Studio digital local qui conçoit des sites et outils numériques pour les commerces de proximité d'Île-de-France.",
  areaServed: "Île-de-France",
  languages: ["fr-FR"],
  email: contact.email,
  phone: contact.phone,
  // Ordre d'affichage pour le sitemap (ancres de la page unique).
  sections: [
    "approche",
    "methode",
    "carte",
    "apercu",
    "process",
    "avis",
    "contact",
  ],
};

/* ------------------------------------------------------------------ *
 * Preuve sociale.                                                     *
 * ⚠️ PLACEHOLDERS — ce sont des exemples pour la maquette.           *
 * NE PAS publier de faux avis : remplace chaque entrée par un vrai   *
 * témoignage client (avec accord) avant la mise en ligne.            *
 * ------------------------------------------------------------------ */
export type Temoignage = {
  quote: string;
  author: string;
  business: string;
  city: string;
  rating: number; // sur 5
};

export const temoignages = {
  id: "avis",
  eyebrow: "PREUVE SOCIALE",
  title: "Ce qu'en disent les commerçants.",
  subtitle:
    "Des retours de commerçants accompagnés par le studio. À personnaliser avec vos vrais avis.",
  items: [
    {
      quote:
        "Enfin quelqu'un qui comprend qu'un resto n'a pas le temps de gérer un site. Je modifie mon menu moi-même en deux minutes, entre deux services.",
      author: "Placeholder — Prénom N.",
      business: "Exemple : bistrot",
      city: "Saint-Maur-des-Fossés",
      rating: 5,
    },
    {
      quote:
        "On m'a livré exactement ce qui avait été promis, dans les délais, sans jargon. Et surtout : on me répond quand j'ai une question.",
      author: "Placeholder — Prénom N.",
      business: "Exemple : boutique",
      city: "Suresnes",
      rating: 5,
    },
    {
      quote:
        "Mon ancien site ne m'apportait rien. Là, je reçois des demandes de devis toutes les semaines via le formulaire.",
      author: "Placeholder — Prénom N.",
      business: "Exemple : artisan",
      city: "Vincennes",
      rating: 5,
    },
  ] as Temoignage[],
  note: "Exemples de mise en page — à remplacer par de vrais témoignages avant publication.",
};
