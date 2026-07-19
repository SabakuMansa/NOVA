import { machineDemo } from "@/content/exemples/machine";

export default function MachinePrestationsPage() {
  const { prestations } = machineDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
        {prestations.eyebrow}
      </span>
      <h1 className="mt-4 font-braise-display text-3xl leading-tight text-braise-ink sm:text-4xl">
        {prestations.title}
      </h1>
      <p className="mt-4 max-w-xl font-braise-sans text-lg text-braise-muted">
        {prestations.subtitle}
      </p>

      <div className="mt-10 divide-y divide-braise-ink/10 overflow-hidden rounded-xl border border-braise-ink/10 bg-white">
        {prestations.services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-4 p-5 sm:p-6"
          >
            <div>
              <p className="font-braise-display text-xl text-braise-ink">
                {s.name}
              </p>
              <p className="mt-1 font-braise-sans text-sm text-braise-muted">
                {s.duration}
              </p>
            </div>
            <span className="font-braise-sans text-lg font-semibold text-braise-rust">
              {s.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
