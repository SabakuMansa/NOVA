import V3Nav from "@/components/v3/Nav";
import V3Hero from "@/components/v3/Hero";
import SmoothScroll from "@/components/v2/SmoothScroll";
import {
  V3Constat,
  V3Contact,
  V3Fondateur,
  V3Footer,
  // V3Moteur retiré du site (section "Ce que ça fait") — composant
  // conservé intact dans Sections.tsx, simplement plus importé ici.
  V3Plans,
  // V3Process retiré du site (section "Le process") — même traitement.
  V3Verdict,
} from "@/components/v3/Sections";

export default function Home() {
  return (
    <div className="bg-lait text-encre">
      <SmoothScroll />
      <V3Nav />
      <main>
        <V3Hero />
        <V3Verdict />
        <V3Constat />
        {/* <V3Moteur /> — retiré du site, code conservé */}
        <V3Plans />
        {/* <V3Process /> — retiré du site, code conservé */}
        <V3Fondateur />
        <V3Contact />
      </main>
      <V3Footer />
    </div>
  );
}
