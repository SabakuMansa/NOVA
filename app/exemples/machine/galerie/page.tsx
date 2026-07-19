import { machineDemo } from "@/content/exemples/machine";

// Photos d'ambiance salon de toilettage (Unsplash, licence libre), une par
// item réel de la galerie, dans l'ordre — recherche dédiée, jamais reprises
// de la maquette "Table & Braise" (hors sujet pour un salon de toilettage).
const PHOTOS = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544568100-847a948585b9?w=700&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=700&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&q=80&auto=format&fit=crop",
];

export default function MachineGaleriePage() {
  const { galerie } = machineDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
        {galerie.eyebrow}
      </span>
      <h1 className="mt-4 font-braise-display text-3xl leading-tight text-braise-ink sm:text-4xl">
        {galerie.title}
      </h1>
      <p className="mt-4 max-w-xl font-braise-sans text-lg text-braise-muted">
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
            <figcaption className="mt-3 flex items-center gap-2 font-braise-sans text-sm text-braise-muted">
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
