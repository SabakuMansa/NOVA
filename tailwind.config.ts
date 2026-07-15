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
      },
      fontFamily: {
        display: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-worksans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plexmono)", "ui-monospace", "monospace"],
        // Réservées au Hero + à "La Carte" (voir règle de style maquette) —
        // jamais utilisées ailleurs sur le site.
        pixel: ["var(--font-pressstart)", "monospace"],
        terminal: ["var(--font-vt323)", "monospace"],
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
