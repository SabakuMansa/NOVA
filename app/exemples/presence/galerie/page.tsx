import { presenceDemo } from "@/content/exemples/presence";

// Photos de référence reprises de la maquette Claude Design (mêmes URLs
// Unsplash) — une par item réel de la galerie, dans l'ordre.
const PHOTOS = [
  "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=700&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=700&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=700&q=80&auto=format&fit=crop",
];

export default function PresenceGaleriePage() {
  const { galerie } = presenceDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="font-fleur-sans text-[13px] uppercase tracking-[3px] text-fleur-olive">
        {galerie.eyebrow}
      </span>
      <h1 className="mt-4 font-fleur-display text-3xl font-medium leading-tight text-fleur-ink-dark sm:text-4xl">
        {galerie.title}
      </h1>
      <p className="mt-4 max-w-xl font-fleur-sans text-lg text-fleur-muted">
        {galerie.subtitle}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {galerie.items.map((item, i) => (
          <figure key={item.label}>
            <div
              className="aspect-[4/3] rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url('${PHOTOS[i % PHOTOS.length]}')` }}
              role="img"
              aria-label={item.label}
            />
            <figcaption className="mt-3 flex items-center gap-2 font-fleur-sans text-sm text-fleur-muted">
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
