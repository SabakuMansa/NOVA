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
  // Réduit le 16/07 à la structure de référence : page d'accueil unique
  // (question défilante + titre + Les plans + Qui suis-je), plus les 4
  // démos /exemples/*. Le constat, Ce que ça fait et Le process sont
  // retirés de la nav avec leurs sections homepage correspondantes.
  links: [
    { label: "Les plans", href: "/#plans" },
    { label: "Qui suis-je", href: "/qui-je-suis" },
  ],
  // "#contact" n'existe plus (section retirée) — mailto direct vers le
  // vrai email déjà validé, pas de lien mort.
  cta: { label: "Audit gratuit", href: "mailto:bonjour@nova-studio.fr" },
};

export const v3hero = {
  eyebrow: "Studio digital · Île-de-France",
  // Titre stratégique — phrase fournie, rendue « titleA <em>titleEm</em> titleB ».
  titleA: "Vos futurs clients vous cherchent déjà.",
  titleEm: "Assurez-vous",
  titleB: " qu'ils vous trouvent.",
  subtitle:
    "Je gère des restaurants en Île-de-France. J'y ai vu trop de commerces excellents avec une image en ligne qui ne leur ressemble pas. Je construis des vitrines numériques à la hauteur de votre commerce.",
  ctaPrimary: {
    label: "Réserver un audit gratuit (15 min)",
    href: "mailto:bonjour@nova-studio.fr",
  },
  ctaSecondary: { label: "Voir les plans", href: "#plans" },
};

// Section dédiée, plein écran, juste après le Hero — PAS le titre du Hero
// (celui-ci reste v3hero.titleA/Em/B). Mécanique inspirée d'AppSignal :
// question fixe + réponse qui défile en boucle (effet glitch, voir V3Verdict
// dans components/v3/Sections.tsx).
export const v3verdict = {
  id: "verdict",
  question: "Votre site actuel, il fait quoi, là, tout de suite ?",
  answers: [
    "Rien. Absolument rien.",
    "Il dort.",
    "Il est invisible.",
    "Il fait fuir vos clients.",
    "Il tourne en rond.",
    "Il ment sur vos horaires.",
    "Il rate des opportunités.",
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

export type V3Plan = {
  name: string;
  price: string;
  monthly: string;
  pitch: string;
  features: string[];
  featured?: boolean;
  badge?: string;
  color: "teal" | "violet" | "corail" | "jaune";
  /** Lien vers une page /exemples/* montrant CE plan précis en situation
   *  (uniquement quand la démo existe — pas encore pour tous les plans). */
  exampleHref?: string;
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
      exampleHref: "/exemples/presence",
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
      exampleHref: "/exemples/autonome",
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
      exampleHref: "/exemples/machine",
    },
    {
      name: "Boutique",
      price: "dès 3200€",
      monthly: "+ 129€/mois",
      pitch: "Votre boutique, ouverte partout, tout le temps.",
      features: [
        "Tout le plan Autonome",
        "Catalogue produits organisé par catégorie",
        "Fiches produits enrichies (description, prix, média)",
        "Panier + paiement en ligne sécurisé (Stripe)",
        "Tableau de suivi des commandes",
      ],
      color: "jaune",
      exampleHref: "/exemples/boutique",
    },
  ] as V3Plan[],
  addon: {
    name: "Module Commande & Livraison directe",
    price: "450€ à l'activation + 25€/mois",
    text: "Vos clients commandent directement chez vous, la livraison suit — sans commission de plateforme sur vos ventes. Disponible avec les plans Autonome et Machine, pour les commerces qui livrent.",
    note: "Le coût de chaque course est payé séparément par le commerçant à son prestataire de livraison, non inclus dans ce tarif.",
    demo: { label: "Essayer la démo de commande", href: "/demo/commande" },
  },
  footnote:
    "Pas sûr du bon plan ? Quinze minutes d'audit suffisent pour le savoir.",
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
  badges: [
    "Restaurateur en activité",
    "Basé en Île-de-France",
    "Pensé pour être géré sans moi",
  ],
};

export const v3footer = {
  tagline: "Studio digital — Île-de-France",
  blurb:
    "Des sites et des outils qui bossent pour les commerces locaux, construits par un restaurateur en activité.",
  copyright: "© 2026 NOVA Studio. Fait avec sérieux (et un peu de sauce).",
};
