import type { Config } from "tailwindcss";
import path from "path";

// Chemins absolus ancrés sur ce fichier : robuste même quand `next dev` est
// lancé depuis un autre répertoire de travail (cas de l'aperçu intégré).
const root = __dirname;

const config: Config = {
  content: [
    path.join(root, "app/**/*.{js,ts,jsx,tsx,mdx}"),
    path.join(root, "components/**/*.{js,ts,jsx,tsx,mdx}"),
  ],
  theme: {
    extend: {
      colors: {
        // Palette "terroir francilien" — cf. content/direction créative
        nappe: "#F5EEE1", // fond principal
        cafe: "#2E2521", // texte — café brûlé
        moutarde: "#C89B3C", // accent primaire — moutarde de Meaux
        lie: "#7A2E2E", // accent secondaire — lie-de-vin
        sauge: "#6E7B58", // accent tertiaire
        craie: "#EDE2CE", // surface carte
        // Palette v3 « geek coloré » (refonte AppSignal-like) — additive,
        // n'affecte pas les pages existantes.
        lait: "#FBF7EF", // fond v3
        encre: "#211D16", // texte v3
        corail: "#FF6B4A",
        violet: "#6C5CE7",
        teal: "#0EA88B",
        jaune: "#FFC53D",
        rose: "#F272BA",
        // Palette "arcade" — import maquette Claude Design du 15/07, réservée
        // à la homepage (voir components/v3/Sections.tsx). N'affecte jamais
        // /exemples/*, /labo, ni les archives : ces pages continuent d'utiliser
        // lait/encre/corail/violet/teal/jaune ci-dessus, inchangés.
        "arcade-bg": "#17130D", // fond principal (page, panneaux Hero/Carte)
        "arcade-bg-alt": "#0E0B07", // fond alterné (sections sobres)
        "arcade-card": "#1F1912", // carte élevée
        "arcade-card-featured": "#241D14", // carte plan mis en avant
        "arcade-border": "#2C241A", // bordure discrète
        "arcade-border-thick": "#3A2F1E", // bordure carte plan / bouton
        "arcade-orange": "#FF7A00", // accent primaire
        "arcade-gold": "#FFD23F", // accent secondaire
        "arcade-cream": "#F3EBDD", // texte primaire
        "arcade-tan": "#C9BEAA", // texte secondaire
        "arcade-taupe": "#A99C88", // texte tertiaire / eyebrow
        "arcade-muted": "#6F6555", // texte quaternaire, très discret

        // Palettes des 4 démos /exemples/* — import maquettes Claude Design
        // du 17/07 ("Designs Nova pour exemples"), une par démo, jamais
        // partagées entre elles ni avec l'arcade/homepage. Préfixes liés au
        // nom fictif de chaque maquette (pas au nom du plan) pour rester
        // lisibles indépendamment du contenu réel de la démo.

        // Présence / "Camille Fleurs" (fleuriste) → /exemples/presence
        "fleur-bg": "#F7F4EE",
        "fleur-bg-alt": "#EEF0E7",
        "fleur-ink": "#39433A",
        "fleur-ink-dark": "#2F382F",
        "fleur-sage": "#4A5D4E",
        "fleur-sage-light": "#5B6C5A",
        "fleur-olive": "#8A9A7B",
        "fleur-muted": "#5B6459",
        "fleur-border": "#E4DDD0",
        "fleur-footer": "#3A463A",

        // Autonome / "Studio.Métamorphose" (salon de coiffure) → /exemples/autonome
        "metam-bg": "#FFFFFF",
        "metam-bg-alt": "#F6F6F9",
        "metam-ink": "#14141A",
        "metam-purple": "#5B3DF5",
        "metam-purple-soft": "#8F7BFF",
        "metam-muted": "#55555F",
        "metam-muted-light": "#A5A5B0",
        "metam-border": "#EEEEF1",
        "metam-border-dark": "#D8D8DE",
        "metam-dark": "#14141A",
        "metam-footer": "#0D0D12",

        // Machine / "Table & Braise" (restaurant — appliqué visuellement à
        // "Au Poil", toilettage canin ; structure tableau de bord/notifs
        // reprise, vocabulaire "carte"/menu jamais importé) → /exemples/machine
        "braise-bg": "#F4ECE1",
        "braise-ink": "#1C1815",
        "braise-rust": "#C04A2B",
        "braise-orange": "#E8A06B",
        "braise-teal": "#3FB8A6",
        "braise-muted": "#6B6157",
        "braise-muted-light": "#A99F92",
        "braise-dark": "#1C1815",
        "braise-dark-card": "#26211C",
        "braise-border-dark": "#3A332C",
        "braise-footer": "#0F0D0B",

        // Boutique / "Atelier Nord" (mode — appliqué visuellement au "Petit
        // Atelier", savonnerie/bougies ; pas de sélecteur de taille, le
        // QuantitySelector existant reste l'UI d'ajout) → /exemples/boutique
        "nord-bg": "#F2EFE9",
        "nord-bg-alt": "#E7E1D6",
        "nord-ink": "#1A1A1A",
        "nord-camel": "#A97C50",
        "nord-muted": "#57534A",
        "nord-muted-light": "#8A8578",
        "nord-border": "#E2DDD3",
        "nord-border-light": "#D4CEC1",
        "nord-dark": "#1A1A1A",
      },
      fontFamily: {
        display: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-worksans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plexmono)", "ui-monospace", "monospace"],
        // Réservées au Hero + à "La Carte" (voir règle de style maquette) —
        // jamais utilisées ailleurs sur le site.
        pixel: ["var(--font-pressstart)", "monospace"],
        terminal: ["var(--font-vt323)", "monospace"],
        // Polices des 4 démos — chargées via next/font/google dans le layout
        // de chaque démo (pas le layout racine), donc scindées par route :
        // seule la démo concernée charge sa propre paire de polices.
        "fleur-display": ["var(--font-fleur-display)", "serif"],
        "fleur-sans": ["var(--font-fleur-sans)", "sans-serif"],
        "metam-display": ["var(--font-metam-display)", "sans-serif"],
        "metam-sans": ["var(--font-metam-sans)", "sans-serif"],
        "braise-display": ["var(--font-braise-display)", "serif"],
        "braise-sans": ["var(--font-braise-sans)", "sans-serif"],
        "braise-mono": ["var(--font-braise-mono)", "monospace"],
        "nord-display": ["var(--font-nord-display)", "serif"],
        "nord-sans": ["var(--font-nord-sans)", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
