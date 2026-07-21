"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAirlock } from "./AirlockProvider";

const VISITED_KEY = "tron:visited";
const SPACE_ROUTE = "/labo/tron";

/**
 * Bouton flottant « retour à l'espace », monté globalement (dans
 * `AirlockProvider`, lui-même dans le layout racine) donc potentiellement
 * visible sur n'importe quelle page.
 *
 * Affiché UNIQUEMENT si le marqueur de session `tron:visited` est présent —
 * posé par `TronPreview` au moment d'un atterrissage réel depuis l'univers
 * Tron (cf. components/labo/TronPreview.tsx). Un visiteur arrivé directement
 * sur une page (lien externe, recherche) ne voit jamais ce bouton : additif,
 * aucune régression pour la navigation classique du site.
 *
 * Au clic (ou `Échap`) : rejoue le sas existant vers `/labo/tron` — pas de
 * transition dédiée, la mécanique fermeture→navigation→réouverture de
 * l'AirlockProvider est symétrique et fonctionne à l'identique dans les deux
 * sens.
 */
export default function ReturnToSpaceButton() {
  const pathname = usePathname();
  const airlock = useAirlock();
  const [visible, setVisible] = useState(false);

  // Lu côté client seulement (sessionStorage indisponible au rendu serveur) —
  // évite tout écart d'hydratation.
  useEffect(() => {
    if (pathname === SPACE_ROUTE) {
      setVisible(false);
      return;
    }
    try {
      setVisible(window.sessionStorage.getItem(VISITED_KEY) === "1");
    } catch {
      setVisible(false);
    }
  }, [pathname]);

  const goBack = useCallback(() => {
    if (airlock.active) return; // une transition à la fois
    airlock.enter(SPACE_ROUTE);
  }, [airlock]);

  // Raccourci clavier desktop : Échap déclenche le même retour.
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, goBack]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Retour à l'espace"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.4,
        color: "#8be9ff",
        background: "rgba(4,10,18,0.72)",
        backdropFilter: "blur(6px)",
        padding: "10px 16px",
        borderRadius: 999,
        border: "1px solid rgba(95,242,255,0.35)",
        boxShadow: "0 0 18px rgba(95,242,255,0.18)",
        cursor: "pointer",
      }}
    >
      <span aria-hidden style={{ fontSize: 15 }}>
        ↩
      </span>
      retour à l&apos;espace
    </button>
  );
}
