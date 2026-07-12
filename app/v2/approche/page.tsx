import type { Metadata } from "next";
import Approche from "@/components/Approche";
import Methode from "@/components/Methode";
import Process from "@/components/Process";
import PageHeader from "@/components/v2/PageHeader";

export const metadata: Metadata = {
  title: "L'approche",
  description:
    "Un studio digital fondé par un restaurateur en activité. La méthode et le process, sans jargon technique.",
  alternates: { canonical: "/v2/approche" },
};

export default function V2ApprochePage() {
  return (
    <main className="pt-20">
      <PageHeader label="L'approche" />
      <Approche />
      <Methode />
      <Process />
    </main>
  );
}
