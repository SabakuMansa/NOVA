import { fileURLToPath } from "url";
import path from "path";

// Résout le chemin du fichier de config Tailwind par rapport à CE fichier,
// et non par rapport au cwd — indispensable quand `next dev` est lancé depuis
// un autre répertoire (aperçu intégré). Sur Vercel, le cwd est déjà la racine
// du projet, donc ce chemin reste correct.
const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: { config: path.join(here, "tailwind.config.ts") },
    autoprefixer: {},
  },
};

export default config;
