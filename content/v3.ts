/**
 * Contenu de la refonte v3 — direction « geek coloré » (univers AppSignal).
 * Repositionnement du 13/07/2026 : on ne vend plus « un site internet », on
 * fait réaliser au commerçant que son commerce est meilleur que ce qu'on en
 * voit en ligne — le déclic doit amener naturellement vers l'audit gratuit.
 * Reformulation clé : jamais « création de site » en accroche, toujours
 * « une vitrine numérique à la hauteur de votre commerce ». « Opportunités »
 * plutôt que « clients perdus » (plus juste, moins agressif).
 *
 * CIBLE : commerçants locaux qui n'ont PAS de site, ou un site vieillissant —
 * boutiques, artisans, restaurants, associations, petites entreprises. Les
 * exemples restent génériques (horaires, photos, avis Google, prise de contact)
 * et ne supposent jamais que le lecteur est restaurateur.
 * EXCEPTION : la légitimité du fondateur reste liée au fait qu'il gère lui-même
 * des restaurants (fait vécu, pas une promesse de ciblage) — développée en
 * détail sur /qui-je-suis. Vouvoiement partout.
 */

export const v3nav = {
  links: [
    { label: "Le constat", href: "/#constat" },
    { label: "Ce que ça fait", href: "/#moteur" },
    { label: "Les plans", href: "/#plans" },
    { label: "Le process", href: "/#process" },
    { label: "Qui suis-je", href: "/qui-je-suis" },
  ],
  cta: { label: "Audit gratuit", href: "/#contact" },
};

export const v3hero = {
  eyebrow: "Studio digital · Île-de-France",
  // Titre stratégique — phrase fournie, rendue « titleA <em>titleEm</em> titleB ».
  titleA: "Vos futurs clients vous cherchent déjà.",
  titleEm: "Assurez-vous",
  titleB: " qu'ils vous trouvent.",
  subtitle:
    "Je gère des restaurants en Île-de-France. J'y ai vu trop de commerces excellents avec une image en ligne qui ne leur ressemble pas. Je construis des vitrines numériques à la hauteur de votre commerce.",
  ctaPrimary: { label: "Réserver un audit gratuit (15 min)", href: "#contact" },
  ctaSecondary: { label: "Voir les plans", href: "#plans" },
  // Flux de notifications simulé dans la fenêtre du hero.
  terminalTitle: "votre-commerce.fr — en ligne",
  events: [
    { icon: "📅", text: "Nouveau rendez-vous — mardi 14h30", tag: "résa" },
    { icon: "⭐", text: "Avis Google 5★ — réponse envoyée automatiquement", tag: "avis" },
    { icon: "🛒", text: "Commande #214 confirmée — en préparation", tag: "commande" },
    { icon: "🕗", text: "Horaires mis à jour depuis votre téléphone", tag: "admin" },
    { icon: "📩", text: "Demande de contact — nouveau client", tag: "résa" },
    { icon: "⭐", text: "Note moyenne : 4,8/5 sur 126 avis", tag: "avis" },
  ],
};

export const v3ticker = {
  items: [
    "Saint-Maur-des-Fossés",
    "Suresnes",
    "Val-de-Marne",
    "Hauts-de-Seine",
    "boutiques",
    "artisans",
    "restaurants",
    "associations",
    "zéro jargon",
    "zéro commission",
  ],
};

export const v3constat = {
  id: "constat",
  eyebrow: "Le constat",
  title: "Que voit un nouveau client lorsqu'il découvre votre commerce sur internet ?",
  subtitle:
    "Probablement pas ce que vous méritez. Et pendant ce temps, des opportunités passent à côté.",
  // Ligne isolée, placée après la grille de cartes — rupture de rythme avant la section suivante.
  rupture: "Votre site actuel, il fait quoi, là, tout de suite ?",
  cards: [
    {
      emoji: "😴",
      color: "corail",
      title: "Il dort",
      text: "Un client vous cherche un dimanche soir. Il tombe sur un site figé depuis 2019. Une opportunité de plus qui s'en va.",
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
      text: "Chaque vente qui passe par une plateforme, c'est une commission prélevée. Et un client qui reste le sien, jamais le vôtre.",
    },
  ],
};

export const v3moteur = {
  id: "moteur",
  eyebrow: "Ce que ça fait",
  title: "Pas juste un site. Une vitrine à la hauteur de votre commerce.",
  bento: [
    {
      size: "small",
      color: "violet",
      icon: "🔍",
      title: "Visibilité",
      text: "Être trouvé au moment exact où quelqu'un cherche un commerce comme le vôtre — Google, fiche à jour, avis suivis.",
      chip: "SEO local inclus",
      hidden: false,
    },
    {
      size: "small",
      color: "teal",
      icon: "🎛️",
      title: "Autonomie",
      text: "Prix, photos, horaires : vous changez tout vous-même, en deux minutes, depuis votre téléphone.",
      chip: "Sans coder",
      hidden: false,
    },
    {
      size: "small",
      color: "corail",
      icon: "⚡",
      title: "Automatisation",
      text: "Relances d'avis, notifications, prises de contact : les tâches répétitives tournent toutes seules.",
      chip: "En continu",
      hidden: false,
    },
    // Module Commande & Livraison — masqué de l'affichage public (pas prioritaire
    // pour le moment). Code et contenu conservés intacts, simplement filtrés à
    // l'affichage dans V3Moteur (components/v3/Sections.tsx).
    {
      size: "large",
      color: "jaune",
      icon: "🛵",
      title: "Commande directe",
      text: "Vos clients commandent chez vous, un réseau de coursiers professionnels livre. Vous ne payez que la course — jamais un pourcentage sur la vente.",
      chip: "0 % de commission",
      hidden: true,
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
        "Espace admin : photos, textes, horaires",
        "Prise de contact / rendez-vous intégrés",
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
  // Teaser condensé pour la section homepage (renvoie vers /qui-je-suis).
  teaser:
    "Restaurateur en activité, pas une agence : chaque outil que je construis part de situations vécues derrière un comptoir.",
  ctaLabel: "Voir mon parcours",
  ctaHref: "/qui-je-suis",
  // Contenu complet — utilisé sur la page dédiée /qui-je-suis.
  pageIntro:
    "Je gère plusieurs restaurants en Île-de-France. NOVA Studio n'est pas né d'une étude de marché, mais d'un constat direct : gérer un commerce au quotidien avec des outils numériques mal pensés, ça use. Alors j'ai commencé par construire les miens — puis ceux d'autres commerçants.",
  points: [
    "Un dimanche soir, pas de webmaster à qui écrire pour changer un horaire.",
    "Un client qui appelle parce que le site affiche encore l'ancienne info.",
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
