import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { v3hero } from "@/content/v3";

// Image de partage (réseaux sociaux / messageries) — reflète l'identité
// pixel arcade réellement en place sur le site (V3Nav/V3Hero), pas
// l'ancienne identité "geek coloré" (fond clair, blobs aurora) désormais
// abandonnée. Polices réelles du site (Press Start 2P / VT323) chargées
// depuis des fichiers locaux — mêmes fontes que app/layout.tsx, jamais une
// police système de substitution. Générée au build, 100 % maison.
export const alt = "K1000 Studio — Votre site bosse pendant que vous servez";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette arcade (tailwind.config.ts) — dupliquée ici car ImageResponse
// (Satori) ne lit pas les classes Tailwind, uniquement des styles inline.
const ARCADE_BG = "#17130D";
const ARCADE_BG_ALT = "#0E0B07";
const ARCADE_BORDER = "#2C241A";
const ARCADE_BORDER_THICK = "#3A2F1E";
const ARCADE_ORANGE = "#FF7A00";
const ARCADE_GOLD = "#FFD23F";
const ARCADE_CREAM = "#F3EBDD";
const ARCADE_TAUPE = "#A99C88";

export default async function OpengraphImage() {
  const [pressStart2P, vt323] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/PressStart2P-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/VT323-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: ARCADE_BG,
          fontFamily: "VT323",
          position: "relative",
        }}
      >
        {/* Lueur radiale discrète derrière le wordmark — même traitement que
            le panneau Hero réel, pas les blobs aurora abandonnés. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(120% 100% at 50% 0%, #2A1C08 0%, " +
              ARCADE_BG +
              " 65%)",
          }}
        />

        {/* Bandeau bezel — même chrome décoratif que la Nav (1P / HI). */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `2px solid ${ARCADE_BORDER}`,
            padding: "18px 56px",
            fontFamily: "Press Start 2P",
            fontSize: 16,
            position: "relative",
          }}
        >
          <span style={{ display: "flex", color: ARCADE_ORANGE }}>
            1P <span style={{ color: ARCADE_CREAM, marginLeft: 10 }}>00000</span>
          </span>
          <span style={{ display: "flex", color: ARCADE_GOLD }}>
            INSERT COIN
          </span>
          <span style={{ display: "flex", color: ARCADE_ORANGE }}>
            HI <span style={{ color: ARCADE_CREAM, marginLeft: 10 }}>99999</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 64px 56px",
            position: "relative",
          }}
        >
          {/* Wordmark — identique à la Nav réelle : monogramme + K1000.studio */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                backgroundColor: ARCADE_GOLD,
                border: `4px solid ${ARCADE_BORDER_THICK}`,
                color: ARCADE_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Press Start 2P",
                fontSize: 26,
                boxShadow: `4px 4px 0 ${ARCADE_BORDER}`,
              }}
            >
              K
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Press Start 2P",
                fontSize: 26,
                color: ARCADE_CREAM,
              }}
            >
              K1000
              <span style={{ color: ARCADE_ORANGE, display: "flex" }}>
                .studio
              </span>
            </div>
          </div>

          {/* Eyebrow — même badge que le Hero réel. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 56,
              border: `2px solid ${ARCADE_BORDER_THICK}`,
              backgroundColor: ARCADE_BG_ALT,
              borderRadius: 999,
              padding: "10px 22px",
              alignSelf: "flex-start",
              fontFamily: "Press Start 2P",
              fontSize: 15,
              color: ARCADE_TAUPE,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: ARCADE_ORANGE,
                display: "flex",
              }}
            />
            {v3hero.eyebrow}
          </div>

          {/* Titre — texte réel du Hero (v3hero), jamais une phrase inventée.
              Deux lignes explicites (pas un seul paragraphe à retour à la
              ligne automatique) : Satori ne fait pas cohabiter proprement du
              texte brut et un <span> coloré imbriqué dans un seul flux — la
              phrase se coupe naturellement après le point de titleA de toute
              façon. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              fontFamily: "Press Start 2P",
              fontSize: 36,
              lineHeight: 1.6,
              color: ARCADE_CREAM,
              maxWidth: 1060,
              gap: 6,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {v3hero.titleA}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <span style={{ color: ARCADE_GOLD, display: "flex" }}>
                {v3hero.titleEm}
              </span>
              <span style={{ display: "flex" }}>{v3hero.titleB}</span>
            </div>
          </div>
        </div>

        {/* Pied — même mention que le footer du site. */}
        <div
          style={{
            display: "flex",
            borderTop: `1px solid ${ARCADE_BORDER}`,
            padding: "22px 64px",
            fontFamily: "VT323",
            fontSize: 26,
            color: ARCADE_TAUPE,
          }}
        >
          Sites &amp; outils pour commerces locaux — par un restaurateur,
          Île-de-France
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Press Start 2P", data: pressStart2P, style: "normal", weight: 400 },
        { name: "VT323", data: vt323, style: "normal", weight: 400 },
      ],
    },
  );
}
