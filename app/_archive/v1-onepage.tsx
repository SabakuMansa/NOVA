import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Approche from "@/components/Approche";
import Problemes from "@/components/Problemes";
import Methode from "@/components/Methode";
import Carte from "@/components/Carte";
import Configurator from "@/components/Configurator";
import Process from "@/components/Process";
import Temoignages from "@/components/Temoignages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problemes />
        <Approche />
        <Methode />
        <Carte />
        <Configurator />
        <Process />
        <Temoignages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
