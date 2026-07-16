import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeGaleriePage() {
  const { galerie } = autonomeDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
        {galerie.eyebrow}
      </p>
      <h1 className="mt-6 font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
        {galerie.title}
      </h1>
      <p className="mt-4 max-w-xl font-terminal text-xl text-arcade-tan">
        {galerie.subtitle}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {galerie.items.map((item) => (
          <PlaceholderImage
            key={item.label}
            icon={item.icon}
            label={item.label}
            color={item.color}
            className="aspect-[4/3] w-full"
          />
        ))}
      </div>
    </section>
  );
}
