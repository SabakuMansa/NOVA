import { autonomeDemo } from "@/content/exemples/autonome";

// Photos libres de droit (Unsplash) reprises de la maquette Claude Design
// "02 - Salon de coiffure (Autonome)" — une par item réel de galerie.items.
const GALLERY_PHOTOS: Record<string, string> = {
  "L'espace salon":
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop",
  "Nos réalisations":
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80&auto=format&fit=crop",
  "Postes de coiffage":
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80&auto=format&fit=crop",
  "Produits utilisés":
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop",
};

export default function AutonomeGaleriePage() {
  const { galerie } = autonomeDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="inline-flex items-center gap-2 font-metam-sans text-[13px] font-semibold uppercase tracking-[1.5px] text-metam-purple">
        <span className="h-2 w-2 rounded-full bg-metam-purple" aria-hidden />
        {galerie.eyebrow}
      </span>
      <h1 className="mt-5 font-metam-display text-4xl font-bold tracking-tight text-metam-ink sm:text-5xl">
        {galerie.title}
      </h1>
      <p className="mt-4 max-w-xl font-metam-sans text-lg text-metam-muted">
        {galerie.subtitle}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {galerie.items.map((item) => (
          <div
            key={item.label}
            className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-metam-border bg-cover bg-center grayscale transition-[filter] metam-anim hover:grayscale-0"
            style={{
              backgroundImage: `url('${GALLERY_PHOTOS[item.label]}')`,
            }}
            role="img"
            aria-label={item.label}
          />
        ))}
      </div>
    </section>
  );
}
