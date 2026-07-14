import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { presenceDemo } from "@/content/exemples/presence";

export default function PresenceGaleriePage() {
  const { galerie } = presenceDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
        {galerie.eyebrow}
      </p>
      <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {galerie.title}
      </h1>
      <p className="mt-4 max-w-xl font-sans text-lg text-encre/70">
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
