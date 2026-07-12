import type { Metadata } from "next";
import Configurator from "@/components/Configurator";
import Temoignages from "@/components/Temoignages";
import PageHeader from "@/components/v2/PageHeader";

export const metadata: Metadata = {
  title: "Aperçu",
  description:
    "Essayez le configurateur : choisissez votre activité et votre style, et voyez votre site en direct.",
  alternates: { canonical: "/v2/apercu" },
};

export default function V2ApercuPage() {
  return (
    <main className="pt-20">
      <PageHeader label="Aperçu" />
      <Configurator />
      <Temoignages />
    </main>
  );
}
