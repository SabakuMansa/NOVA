import type { Metadata } from "next";
import Carte from "@/components/Carte";
import PageHeader from "@/components/v2/PageHeader";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Trois formules pour votre commerce, plus le supplément Commande & Livraison directe. Prix clairs, sans jargon.",
  alternates: { canonical: "/v2/carte" },
};

export default function V2CartePage() {
  return (
    <main className="pt-20">
      <PageHeader label="La carte" />
      <Carte />
    </main>
  );
}
