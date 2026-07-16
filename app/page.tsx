import V3Nav from "@/components/v3/Nav";
import V3Hero from "@/components/v3/Hero";
import SmoothScroll from "@/components/v2/SmoothScroll";
import { V3Fondateur, V3Plans, V3Verdict } from "@/components/v3/Sections";

// Réduit le 16/07 à la structure de référence : page d'accueil unique avec
// seulement 4 blocs (question défilante, titre, Les plans, Qui suis-je), plus
// les 4 démos /exemples/*. Le constat, Ce que ça fait, Le process, Contact et
// Footer sont retirés de cette page (voir CHANGELOG.md pour le détail).
export default function Home() {
  return (
    <div className="bg-arcade-bg text-arcade-cream">
      <SmoothScroll />
      <V3Nav />
      <main>
        <V3Verdict />
        <V3Hero />
        <V3Plans />
        <V3Fondateur />
      </main>
    </div>
  );
}
