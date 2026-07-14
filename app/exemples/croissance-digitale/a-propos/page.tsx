import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { croissanceDigitaleDemo } from "@/content/exemples/croissance-digitale";

export default function CroissanceDigitaleAProposPage() {
  const { aPropos } = croissanceDigitaleDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {aPropos.eyebrow}
      </p>
      <h1 className="mt-6 max-w-2xl font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {aPropos.title}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <PlaceholderImage
          icon="👥"
          label="Photo de l'équipe / du lieu"
          color="teal"
          className="aspect-[4/3] w-full"
        />
        <div className="space-y-4">
          {aPropos.body.map((p, i) => (
            <p
              key={i}
              className="font-sans text-lg leading-relaxed text-encre/80"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {aPropos.values.map((v) => (
          <div key={v.title} className="v3-card h-full p-5">
            <h3 className="font-sans text-lg font-extrabold text-encre">
              {v.title}
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-encre/75">
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
