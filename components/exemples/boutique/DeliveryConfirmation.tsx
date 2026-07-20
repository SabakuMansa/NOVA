"use client";

import { useEffect, useState } from "react";
import DeliveryTracking, { DELIVERY_STORAGE_KEY } from "./DeliveryTracking";

/**
 * Îlot client isolé : lit (et consomme) l'id de course déposé au panier
 * avant redirection Stripe/mock. N'affiche rien si le client a choisi le
 * retrait en boutique (aucune clé stockée dans ce cas).
 */
export default function DeliveryConfirmation() {
  const [deliveryId, setDeliveryId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const id = sessionStorage.getItem(DELIVERY_STORAGE_KEY);
      if (id) {
        setDeliveryId(id);
        sessionStorage.removeItem(DELIVERY_STORAGE_KEY);
      }
    } catch {
      // sessionStorage indisponible (navigation privée, etc.) — pas de
      // suivi affiché, ce n'est pas bloquant pour la confirmation.
    }
  }, []);

  if (!deliveryId) return null;
  return <DeliveryTracking deliveryId={deliveryId} />;
}
