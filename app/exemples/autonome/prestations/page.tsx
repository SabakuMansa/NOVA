import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomePrestationsPage() {
  const { prestations } = autonomeDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
        {prestations.eyebrow}
      </p>
      <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {prestations.title}
      </h1>
      <p className="mt-4 max-w-xl font-sans text-lg text-encre/70">
        {prestations.subtitle}
      </p>

      <div className="v3-card mt-10 divide-y-2 divide-encre/10 overflow-hidden">
        {prestations.services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-4 p-5 sm:p-6"
          >
            <div>
              <p className="font-sans text-base font-bold text-encre">
                {s.name}
              </p>
              <p className="font-sans text-sm text-encre/60">{s.duration}</p>
            </div>
            <span className="font-sans text-lg font-extrabold text-violet">
              {s.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
