import { ImageResponse } from "next/og";
import { seo } from "@/content/site";

// Image de partage (réseaux sociaux / messageries) générée par next/og.
// 100 % maison, aucune image externe. Générée statiquement au build (l'image
// ne change pas), donc mise en cache et sans coût par requête.
export const alt = "NOVA Studio — Studio digital local, Île-de-France";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F5EEE1",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Halo décoratif */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(200,155,60,0.45) 0%, rgba(245,238,225,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#2E2521",
              color: "#C89B3C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#7A2E2E",
              fontFamily: "monospace",
            }}
          >
            NOVA STUDIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              lineHeight: 1.08,
              color: "#2E2521",
              maxWidth: 960,
            }}
          >
            <div style={{ display: "flex" }}>Votre commerce mérite mieux</div>
            <div style={{ display: "flex", gap: "0.28em" }}>
              <span>qu'un site qui</span>
              <span style={{ fontStyle: "italic", color: "#7A2E2E" }}>dort.</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#2E2521",
              opacity: 0.72,
              fontFamily: "system-ui, sans-serif",
              display: "flex",
            }}
          >
            Studio digital local — Île-de-France
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
