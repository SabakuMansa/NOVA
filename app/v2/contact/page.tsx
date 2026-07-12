import type { Metadata } from "next";
import Contact from "@/components/Contact";
import PageHeader from "@/components/v2/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Réservez un audit gratuit et sans engagement. Réponse sous 24h.",
  alternates: { canonical: "/v2/contact" },
};

export default function V2ContactPage() {
  return (
    <main className="pt-20">
      <PageHeader label="Contact" />
      <Contact />
    </main>
  );
}
