import { ImageResponse } from "next/og";

// Image de partage (réseaux sociaux / messageries) — identité v3 « geek coloré ».
// Générée statiquement au build, 100 % maison.
export const alt = "K1000 Studio — Votre site bosse pendant que vous servez";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FBF7EF",
        padding: "64px 72px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Blobs colorés (identité aurora) */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 460,
          height: 460,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(108,92,231,0.40) 0%, rgba(251,247,239,0) 70%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -60,
          width: 420,
          height: 420,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,107,74,0.38) 0%, rgba(251,247,239,0) 70%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -140,
          right: 160,
          width: 480,
          height: 480,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(14,168,139,0.32) 0%, rgba(251,247,239,0) 70%)",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            backgroundColor: "#FFC53D",
            border: "4px solid #211D16",
            color: "#211D16",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          K
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#211D16",
            display: "flex",
          }}
        >
          K1000<span style={{ color: "#6C5CE7" }}>.studio</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 62,
            fontWeight: 800,
            lineHeight: 1.08,
            color: "#211D16",
            maxWidth: 980,
          }}
        >
          <div style={{ display: "flex" }}>Pendant que vous êtes</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: "#FFC53D",
                padding: "0 14px",
                borderRadius: 10,
                display: "flex",
              }}
            >
              en plein service,
            </span>
          </div>
          <div style={{ display: "flex" }}>votre site bosse.</div>
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#211D16",
            opacity: 0.7,
            display: "flex",
          }}
        >
          Sites & outils pour commerces locaux — par un restaurateur,
          Île-de-France
        </div>
      </div>
    </div>,
    { ...size },
  );
}
