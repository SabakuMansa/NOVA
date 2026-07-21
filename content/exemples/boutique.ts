/**
 * Contenu du site fictif "Le Petit Atelier" — exemple concret du plan
 * **Boutique** (dès 3200€, voir `v3plans` dans content/v3.ts).
 *
 * Périmètre : tout ce qui est dans Autonome, PLUS catalogue produits,
 * fiches produits, panier et paiement en ligne (Stripe, mode test
 * uniquement sur cette démo), suivi de commandes.
 *
 * Le module Commande & Livraison directe (vendu séparément du plan
 * Boutique) est illustré au panier en mode démo (`DELIVERY_MODE=demo`,
 * cf. lib/delivery/) — décision prise le 20/07 pour montrer concrètement
 * à un prospect à quoi ressemblerait son intégration dans un vrai
 * parcours d'achat. Voir components/exemples/boutique/{DeliveryOption,
 * DeliveryTracking}.tsx.
 */

export type BoutiqueProduct = {
  slug: string;
  name: string;
  category: "Savons" | "Bougies" | "Soins";
  price: number;
  description: string;
  icon: string;
  color: "violet" | "corail" | "teal" | "jaune";
};

export const boutiqueDemo = {
  business: {
    name: "Le Petit Atelier",
    tagline: "Savonnerie & bougies artisanales",
    address: "14 rue Nationale, 92100 Boulogne-Billancourt",
    hours: "Mardi–samedi · 10h–19h",
    googleRating: "4,8/5",
    googleReviews: 133,
  },

  nav: [
    { label: "Accueil", href: "/exemples/boutique" },
    { label: "Catalogue", href: "/exemples/boutique/catalogue" },
    { label: "Panier", href: "/exemples/boutique/panier" },
  ],

  accueil: {
    eyebrow: "Savonnerie artisanale",
    title: "Des savons et bougies faits à la main, près de chez vous.",
    subtitle:
      "Fabrication artisanale, ingrédients choisis, livrés partout en France — commandez en ligne, 24h/24.",
    cta: "Voir le catalogue",
    highlights: [
      { icon: "🧼", text: "Fabrication artisanale, petites séries" },
      { icon: "🚚", text: "Livraison partout en France" },
      { icon: "🔒", text: "Paiement en ligne sécurisé" },
    ],
    // Hero immersif "Unit—9" (design handoff du 21/07) — recréation fidèle
    // du hero du zip (concept store urbain), adaptée à l'identité déjà
    // établie du Petit Atelier (savonnerie/bougies, pas de streetwear).
    // `cta` ci-dessus est réutilisé comme libellé du CTA secondaire (même
    // principe que presenceDemo.accueil.cta pour "Au Petit Marché").
    heroBadge: "// NOUVELLE FOURNÉE EN ATELIER",
    heroTitleLine1: "FAIT MAIN",
    heroTitleLine2: "SANS CHICHI",
    heroCtaPrimary: "VOIR LE PRODUIT",
    heroCoordinates: "48.83°N / 2.24°E",
    heroLocation: "BOULOGNE-BILLANCOURT · ATELIER",
    heroImage:
      "https://images.unsplash.com/photo-1546552768-9e3a94b38a59?w=1200&q=80&auto=format&fit=crop",
    heroImageAlt: "Savons artisanaux du Petit Atelier, mise en scène sombre",
  },

  // Module clé "Produit du moment" — recréation fidèle du module fiche
  // produit + panier du zip (hoodie + sneakers), avec un vrai produit du
  // catalogue (bougie) et un aperçu panier statique composé de 2 produits
  // réels (voir accueil/page.tsx pour le calcul du total à partir de
  // `products`, jamais de montant codé en dur ici).
  produitVedette: {
    label: "BOUGIE / CIRE DE SOJA",
    slug: "bougie-bois-de-santal",
    ctaLabel: "Ajouter au panier",
    panierApercu: {
      label: "PANIER · 2 ARTICLES",
      itemSlug: "savon-lavande-provence",
      itemQty: 2,
    },
  },

  catalogue: {
    eyebrow: "Catalogue",
    title: "Nos produits",
    subtitle: "Toute la gamme, organisée par catégorie.",
    categories: ["Tous", "Savons", "Bougies", "Soins"] as const,
  },

  panier: {
    eyebrow: "Panier",
    title: "Votre panier",
    empty: "Votre panier est vide pour l'instant.",
    emptyCta: "Voir le catalogue",
    submit: "Passer au paiement",
    testModeNote:
      "Démo en mode test Stripe — aucun vrai paiement n'est effectué. Utilisez la carte 4242 4242 4242 4242, une date future et n'importe quel CVC.",
  },

  confirmation: {
    eyebrow: "Commande",
    title: "Merci pour votre commande !",
    subtitle:
      "Un email de confirmation (fictif) vous serait envoyé avec le suivi de votre commande.",
    backCta: "Retour au catalogue",
  },

  products: [
    {
      slug: "savon-lavande-provence",
      name: "Savon Lavande de Provence",
      category: "Savons",
      price: 8,
      description:
        "Savon surgras à l'huile d'olive et à la lavande, séché 6 semaines. Sans huile de palme.",
      icon: "🧼",
      color: "violet",
    },
    {
      slug: "savon-argile-menthe",
      name: "Savon Argile verte & Menthe",
      category: "Savons",
      price: 8,
      description:
        "Savon purifiant à l'argile verte et aux huiles essentielles de menthe poivrée.",
      icon: "🧼",
      color: "teal",
    },
    {
      slug: "coffret-decouverte",
      name: "Coffret découverte (3 savons)",
      category: "Savons",
      price: 22,
      description:
        "Trois savons artisanaux au choix, présentés dans un coffret en carton recyclé.",
      icon: "🎁",
      color: "jaune",
    },
    {
      slug: "bougie-bois-de-santal",
      name: "Bougie Bois de santal",
      category: "Bougies",
      price: 18,
      description:
        "Bougie en cire de soja, mèche en coton, environ 40h de combustion.",
      icon: "🕯️",
      color: "corail",
    },
    {
      slug: "bougie-figuier",
      name: "Bougie Figuier",
      category: "Bougies",
      price: 18,
      description:
        "Notes boisées et fruitées, cire de soja, environ 40h de combustion.",
      icon: "🕯️",
      color: "violet",
    },
    {
      slug: "baume-miel-karite",
      name: "Baume à lèvres Miel & Karité",
      category: "Soins",
      price: 6,
      description: "Baume nourrissant au beurre de karité et au miel local.",
      icon: "🍯",
      color: "jaune",
    },
  ] as BoutiqueProduct[],
};
