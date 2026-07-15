"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { boutiqueDemo } from "@/content/exemples/boutique";

/**
 * Panier client de la démo /exemples/boutique — état en mémoire (Context)
 * + persistance localStorage (survit à un rechargement de page). Aucune
 * donnée envoyée nulle part tant que le client n'a pas cliqué "Passer au
 * paiement" : les prix ne sont de toute façon jamais fiables côté client,
 * ils sont recalculés côté serveur dans /api/checkout.
 */

type CartItem = { slug: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (slug: string, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nova-exemples-boutique-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponible (navigation privée, etc.) — panier en
      // mémoire seulement pour cette session d'onglet.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // idem
    }
  }, [items, hydrated]);

  const addItem = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.slug === slug);
      if (existing) {
        return prev.map((it) =>
          it.slug === slug ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((it) => it.slug !== slug);
      return prev.map((it) => (it.slug === slug ? { ...it, qty } : it));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, it) => s + it.qty, 0);
  const total = items.reduce((s, it) => {
    const product = boutiqueDemo.products.find((p) => p.slug === it.slug);
    return s + (product ? product.price * it.qty : 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>.");
  return ctx;
}
