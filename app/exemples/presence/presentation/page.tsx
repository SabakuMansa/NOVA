import { presenceDemo } from "@/content/exemples/presence";

export default function PresencePresentationPage() {
  const { presentation } = presenceDemo;

  return (
    <section className="bg-fleur-bg-alt px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div
          className="aspect-[4/5] rounded-md bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&q=80&auto=format&fit=crop')",
          }}
          role="img"
          aria-label="Atelier floral de Maison Verdure"
        />
        <div>
          <span className="font-fleur-sans text-[13px] uppercase tracking-[3px] text-fleur-olive">
            {presentation.eyebrow}
          </span>
          <h1 className="mt-4 font-fleur-display text-3xl font-medium leading-tight text-fleur-ink-dark sm:text-4xl">
            {presentation.title}
          </h1>
          <div className="mt-6 space-y-4">
            {presentation.body.map((p, i) => (
              <p
                key={i}
                className="font-fleur-sans text-[17px] leading-relaxed text-fleur-muted"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {presentation.values.map((v) => (
              <div key={v.title}>
                <h3 className="font-fleur-display text-xl font-medium text-fleur-ink-dark">
                  {v.title}
                </h3>
                <p className="mt-2 font-fleur-sans text-sm leading-relaxed text-fleur-muted">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
