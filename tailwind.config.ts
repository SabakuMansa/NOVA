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
      },
      fontFamily: {
        display: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-worksans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plexmono)", "ui-monospace", "monospace"],
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
