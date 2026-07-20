import { footer } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-cafe/10 bg-nappe">
      <div className="mx-auto max-w-content px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl leading-none">K1000</span>
              <span className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-lie">
                Studio
              </span>
            </div>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-cafe/70">
              {footer.blurb}
            </p>
            <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-wide text-cafe/50">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-cafe/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-sans text-sm text-cafe/75 transition-colors hover:text-lie"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cafe/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {footer.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="font-mono text-[0.65rem] uppercase tracking-wide text-cafe/60 transition-colors hover:text-lie"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {footer.legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-sans text-xs text-cafe/55 transition-colors hover:text-cafe"
              >
                {l.label}
              </a>
            ))}
            <span className="font-sans text-xs text-cafe/45">
              {footer.copyright}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
