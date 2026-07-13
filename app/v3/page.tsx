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
  V3Ticker,
} from "@/components/v3/Sections";

export default function V3Page() {
  return (
    <>
      <SmoothScroll />
      <V3Nav />
      <main>
        <V3Hero />
        <V3Ticker />
        <V3Constat />
        <V3Moteur />
        <V3Plans />
        <V3Process />
        <V3Fondateur />
        <V3Contact />
      </main>
      <V3Footer />
    </>
  );
}
