import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeAProposPage() {
  const { aPropos } = autonomeDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="inline-flex items-center gap-2 font-metam-sans text-[13px] font-semibold uppercase tracking-[1.5px] text-metam-purple">
        <span className="h-2 w-2 rounded-full bg-metam-purple" aria-hidden />
        {aPropos.eyebrow}
      </span>
      <h1 className="mt-5 max-w-2xl font-metam-display text-4xl font-bold tracking-tight text-metam-ink sm:text-5xl">
        {aPropos.title}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-center">
        <div
          className="aspect-[4/3] w-full rounded-xl border border-metam-border bg-cover bg-center grayscale"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&auto=format&fit=crop')",
          }}
          role="img"
          aria-label="Photo de l'équipe / du lieu"
        />
        <div className="space-y-4">
          {aPropos.body.map((p, i) => (
            <p
              key={i}
              className="font-metam-sans text-lg leading-relaxed text-metam-muted"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {aPropos.values.map((v) => (
          <div
            key={v.title}
            className="h-full rounded-xl border border-metam-border bg-metam-bg-alt p-5"
          >
            <h3 className="font-metam-display text-base font-bold text-metam-ink">
              {v.title}
            </h3>
            <p className="mt-2 font-metam-sans text-[15px] leading-relaxed text-metam-muted">
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
