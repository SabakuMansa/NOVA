import { machineDemo } from "@/content/exemples/machine";

// Photo d'ambiance restaurant (Unsplash, licence libre) — distincte des
// placeholders du design handoff "Restaurant-ChezMargot" (jamais réutilisés
// tels quels pour Chez Fernand).
const TEAM_PHOTO =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop";

export default function MachineAProposPage() {
  const { aPropos } = machineDemo;

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div
          className="aspect-[4/3] rounded-md bg-cover bg-center"
          style={{ backgroundImage: `url('${TEAM_PHOTO}')` }}
          role="img"
          aria-label="Ambiance en salle chez Chez Fernand"
        />
        <div>
          <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
            {aPropos.eyebrow}
          </span>
          <h1 className="mt-4 font-braise-display text-3xl leading-tight text-braise-ink sm:text-4xl">
            {aPropos.title}
          </h1>
          <div className="mt-6 space-y-4">
            {aPropos.body.map((p, i) => (
              <p
                key={i}
                className="font-braise-sans text-[17px] leading-relaxed text-braise-muted"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {aPropos.values.map((v) => (
              <div key={v.title}>
                <h3 className="font-braise-display text-xl text-braise-ink">
                  {v.title}
                </h3>
                <p className="mt-2 font-braise-sans text-sm leading-relaxed text-braise-muted">
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
