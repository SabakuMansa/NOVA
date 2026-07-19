import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomePrestationsPage() {
  const { prestations } = autonomeDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="inline-flex items-center gap-2 font-metam-sans text-[13px] font-semibold uppercase tracking-[1.5px] text-metam-purple">
        <span className="h-2 w-2 rounded-full bg-metam-purple" aria-hidden />
        {prestations.eyebrow}
      </span>
      <h1 className="mt-5 font-metam-display text-4xl font-bold tracking-tight text-metam-ink sm:text-5xl">
        {prestations.title}
      </h1>
      <p className="mt-4 max-w-xl font-metam-sans text-lg text-metam-muted">
        {prestations.subtitle}
      </p>

      <div className="mt-10 divide-y divide-metam-border overflow-hidden rounded-xl border border-metam-border bg-metam-bg">
        {prestations.services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-4 p-5 sm:p-6"
          >
            <div>
              <p className="font-metam-display text-lg font-semibold text-metam-ink">
                {s.name}
              </p>
              <p className="font-metam-sans text-sm text-metam-muted-light">
                {s.duration}
              </p>
            </div>
            <span className="font-metam-display text-lg font-bold text-metam-purple">
              {s.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
