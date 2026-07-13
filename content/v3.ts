/**
 * Contenu de la refonte v3 — direction « geek coloré » (univers AppSignal).
 * Carte blanche validée le 13/07/2026 : copy réécrit, signature « menu de
 * resto » remplacée par « le site qui bosse pendant le service ».
 * Les FAITS sont inchangés : prix, offres, villes, process, légitimité
 * restaurateur. Vouvoiement partout.
 */

export const v3nav = {
  links: [
    { label: "Le constat", href: "#constat" },
    { label: "Ce que ça fait", href: "#moteur" },
    { label: "Les plans", href: "#plans" },
    { label: "Le process", href: "#process" },
    { label: "Qui suis-je", href: "#fondateur" },
  ],
  cta: { label: "Audit gratuit", href: "#contact" },
};

export const v3hero = {
  eyebrow: "Studio digital · Île-de-France",
  titleA: "Pendant que vous êtes",
  titleEm: "en plein service",
  titleB: "votre site bosse.",
  subtitle:
    "Je gère des restaurants entre Saint-Maur-des-Fossés et Suresnes, et je construis des sites et des outils qui tournent tout seuls — réservations, avis, commandes — pendant que vous faites votre vrai métier.",
  ctaPrimary: { label: "Réserver un audit gratuit (15 min)", href: "#contact" },
  ctaSecondary: { label: "Voir les plans", href: "#plans" },
  // Flux de notifications simulé dans la fenêtre du hero.
  terminalTitle: "votre-commerce.fr — en service",
  events: [
    { icon: "📅", text: "Nouvelle réservation — 4 couverts, 20h30", tag: "résa" },
    { icon: "⭐", text: "Avis Google 5★ — réponse envoyée automatiquement", tag: "avis" },
    { icon: "🛵", text: "Commande #214 confirmée — livraison en cours", tag: "commande" },
    { icon: "🕗", text: "Horaires du dimanche mis à jour depuis votre téléphone", tag: "admin" },
    { icon: "📅", text: "Réservation modifiée — 2 → 6 couverts", tag: "résa" },
    { icon: "⭐", text: "Nouvel avis client — 4,8/5 en moyenne", tag: "avis" },
  ],
};

export const v3ticker = {
  items: [
    "Saint-Maur-des-Fossés",
    "Suresnes",
    "Val-de-Marne",
    "Hauts-de-Seine",
    "restaurants",
    "boutiques",
    "artisans",
    "associations",
    "zéro jargon",
    "zéro commission",
  ],
};

export const v3constat = {
  id: "constat",
  eyebrow: "Le constat",
  title: "Votre site actuel, il fait quoi, là, tout de suite ?",
  subtitle:
    "Probablement rien. Et pendant ce temps, des clients passent — et vont ailleurs.",
  cards: [
    {
      emoji: "😴",
      color: "corail",
      title: "Il dort",
      text: "Un client vous cherche un dimanche soir. Il tombe sur un site figé depuis 2019. Il réserve ailleurs.",
    },
    {
      emoji: "🔒",
      color: "violet",
      title: "Il est verrouillé",
      text: "Changer un prix ou une photo = appeler quelqu'un, attendre, relancer. Votre propre site, et vous n'avez pas la main.",
    },
    {
      emoji: "🕳️",
      color: "teal",
      title: "Il est invisible",
      text: "Vos concurrents passent devant vous sur Google. Pas parce qu'ils sont meilleurs — parce que leur fiche est à jour.",
    },
    {
      emoji: "🧾",
      color: "jaune",
      title: "Il coûte sans compter",
      text: "Chaque commande passée par une plateforme, c'est une commission qui part avant même de couvrir vos coûts. Et le client n'est même pas le vôtre.",
    },
  ],
};

export const v3moteur = {
  id: "moteur",
  eyebrow: "Ce que ça fait",
  title: "Un site, trois moteurs qui tournent pour vous.",
  bento: [
    {
      size: "large",
      color: "violet",
      icon: "🔍",
      title: "Visibilité",
      text: "Être trouvé au moment exact où quelqu'un cherche un endroit comme le vôtre — Google, fiche à jour, avis suivis.",
      chip: "SEO local inclus",
    },
    {
      size: "small",
      color: "teal",
      icon: "🎛️",
      title: "Autonomie",
      text: "Prix, photos, horaires : vous changez tout vous-même, en deux minutes, depuis votre téléphone.",
      chip: "Sans coder",
    },
    {
      size: "small",
      color: "corail",
      icon: "⚡",
      title: "Automatisation",
      text: "Relances d'avis, notifications, réservations : les tâches répétitives tournent toutes seules.",
      chip: "Pendant le service",
    },
    {
      size: "large",
      color: "jaune",
      icon: "🛵",
      title: "Commande directe",
      text: "Vos clients commandent chez vous, un réseau de coursiers professionnels livre. Vous ne payez que la course — jamais un pourcentage sur la vente.",
      chip: "0 % de commission",
    },
  ],
};

export type V3Plan = {
  name: string;
  price: string;
  monthly: string;
  pitch: string;
  features: string[];
  featured?: boolean;
  badge?: string;
  color: "teal" | "violet" | "corail";
};

export const v3plans = {
  id: "plans",
  eyebrow: "Les plans",
  title: "Des prix affichés. Oui, vraiment.",
  subtitle:
    "Un investissement qui se rembourse, pas une dépense de plus. Devis précis après audit.",
  plans: [
    {
      name: "Présence",
      price: "690€",
      monthly: "+ 25€/mois",
      pitch: "Exister en ligne, proprement et vite.",
      features: [
        "Site 3–4 pages, pensé mobile",
        "Fiche Google Business optimisée",
        "Formulaire de contact",
        "Mise en ligne rapide",
      ],
      color: "teal",
    },
    {
      name: "Autonome",
      price: "1490€",
      monthly: "+ 45€/mois",
      pitch: "Votre site, vos mains. Plus jamais dépendant.",
      features: [
        "Site complet sur-mesure",
        "Espace admin : photos, menu, horaires",
        "Réservation / contact intégré",
        "SEO local travaillé",
      ],
      featured: true,
      badge: "Le plus choisi",
      color: "violet",
    },
    {
      name: "Machine",
      price: "dès 1990€",
      monthly: "+ 95€/mois",
      pitch: "Le digital qui vous rend du temps chaque semaine.",
      features: [
        "Tout le plan Autonome",
        "Automatisations : relances d'avis, notifications",
        "Tableau de bord simple",
        "Accompagnement renforcé",
      ],
      color: "corail",
    },
  ] as V3Plan[],
  addon: {
    name: "Module Commande & Livraison directe",
    price: "450€ à l'activation + 25€/mois",
    text: "Vos clients commandent directement chez vous, la livraison suit — sans commission de plateforme sur vos ventes. Disponible avec les plans Autonome et Machine, pour les commerces qui livrent.",
    note: "Le coût de chaque course est payé séparément par le commerçant à son prestataire de livraison, non inclus dans ce tarif.",
    demo: { label: "Essayer la démo de commande", href: "/demo/commande" },
  },
  footnote: "Pas sûr du bon plan ? Quinze minutes d'audit suffisent pour le savoir.",
};

export const v3process = {
  id: "process",
  eyebrow: "Le process",
  title: "De « on se parle » à « c'est en ligne », sans zone floue.",
  steps: [
    { n: "01", name: "Audit", text: "15 minutes pour comprendre votre activité. Pas un argumentaire déguisé." },
    { n: "02", name: "Proposition", text: "Un devis clair sous 48h. Un prix, pas une fourchette." },
    { n: "03", name: "Conception", text: "Vous validez avant la moindre ligne de code." },
    { n: "04", name: "Développement", text: "Des points d'étape réguliers. Jamais trois semaines de silence." },
    { n: "05", name: "Livraison", text: "On configure votre espace ensemble, en direct." },
    { n: "06", name: "Suivi", text: "Je reste disponible après la mise en ligne. Pas seulement pendant le projet." },
  ],
};

export const v3fondateur = {
  id: "fondateur",
  eyebrow: "Qui suis-je",
  title: "Pas une agence. Un restaurateur qui code sa propre solution.",
  points: [
    "Un dimanche soir, pas de webmaster à qui écrire pour changer un horaire.",
    "Un client qui appelle parce que le site affiche encore l'ancien menu.",
    "Une heure de moins avec l'équipe parce qu'il a fallu répondre à un avis.",
  ],
  closing:
    "Chaque outil que je construis part de ces situations-là — vécues derrière un comptoir, pas lues dans un cahier des charges.",
  badges: ["Restaurateur en activité", "Basé en Île-de-France", "Pensé pour être géré sans moi"],
};

export const v3contact = {
  id: "contact",
  eyebrow: "Contact",
  title: "On regarde votre commerce ensemble ?",
  subtitle: "Audit gratuit, sans engagement. Réponse sous 24h.",
  intro: "Dites-m'en un peu sur votre commerce — le reste, on le voit de vive voix.",
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

export const v3footer = {
  tagline: "Studio digital — Île-de-France",
  blurb:
    "Des sites et des outils qui bossent pour les commerces locaux, construits par un restaurateur en activité.",
  copyright: "© 2026 NOVA Studio. Fait avec sérieux (et un peu de sauce).",
};
