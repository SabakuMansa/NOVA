import V3Nav from "@/components/v3/Nav";
import V3Hero from "@/components/v3/Hero";
import SmoothScroll from "@/components/v2/SmoothScroll";
import {
  V3Constat,
  V3Contact,
  V3Fondateur,
  V3Footer,
  V3Moteur,
  V3Plans,
  V3Process,
  V3Verdict,
} from "@/components/v3/Sections";

// Import maquette Claude Design "arcade" du 15/07 : Constat/Moteur/Process
// redeviennent visibles (retirés temporairement le 14/07, code jamais
// supprimé) — la maquette et la règle de style les nomment explicitement.
export default function Home() {
  return (
    <div className="bg-arcade-bg text-arcade-cream">
      <SmoothScroll />
      <V3Nav />
      <main>
        <V3Verdict />
        <V3Hero />
        <V3Constat />
        <V3Moteur />
        <V3Plans />
        <V3Process />
        <V3Fondateur />
        <V3Contact />
      </main>
      <V3Footer />
    </div>
  );
}
