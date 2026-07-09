"use client";

import { useEffect, useState } from "react";
import {
  apercu,
  previewCombos,
  type CommerceType,
  type StyleType,
  type PreviewCombo,
} from "@/content/site";
import { Motif } from "./Motifs";

const brandLabel: Record<CommerceType, string> = {
  Restaurant: "La Table",
  Boutique: "La Boutique",
  Artisan: "L'Atelier",
  Association: "L'Association",
};

/* ------------------------------------------------------------------ *
 * Trois LANGAGES de design distincts (pas seulement une couleur).    *
 * Chaque style rend une maquette structurellement différente.        *
 * ------------------------------------------------------------------ */

// CHALEUREUX — arrondi, deux colonnes cosy, bouton plein en pilule.
function PreviewChaleureux({
  combo,
  commerce,
}: {
  combo: PreviewCombo;
  commerce: CommerceType;
}) {
  return (
    <div className="p-6 sm:p-8" style={{ backgroundColor: combo.bg, color: combo.ink }}>
      <div className="flex items-center justify-between">
        <span className="font-display text-lg" style={{ color: combo.ink }}>
          {brandLabel[commerce]}
        </span>
        <span
          className="rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase tracking-wide"
          style={{ backgroundColor: combo.accent, color: combo.bg }}
        >
          Menu
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
        <div>
          <p
            className="font-mono text-[0.58rem] uppercase tracking-eyebrow"
            style={{ color: combo.accent }}
          >
            {combo.category}
          </p>
          <h3
            className="mt-3 font-display text-2xl leading-tight sm:text-[1.7rem]"
            style={{ color: combo.ink }}
          >
            {combo.headline}
          </h3>
          <p
            className="mt-3 font-sans text-sm leading-relaxed"
            style={{ color: combo.ink, opacity: 0.75 }}
          >
            {combo.tagline}
          </p>
          <span
            className="mt-5 inline-block rounded-full px-5 py-2.5 font-sans text-xs font-medium shadow-sm"
            style={{ backgroundColor: combo.accent, color: combo.bg }}
          >
            {combo.cta}
          </span>
        </div>

        <div
          className="overflow-hidden rounded-2xl ring-1"
          style={{ backgroundColor: combo.surface, boxShadow: "none" }}
        >
          <Motif name={combo.motif} color={combo.accent} ink={combo.ink} />
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-dashed pt-4 font-mono text-[0.58rem] uppercase tracking-wide"
        style={{ borderColor: `${combo.ink}33`, color: `${combo.ink}99` }}
      >
        <span>Ouvert · 7j/7</span>
        <span>Île-de-France</span>
        <span>★ 4,8 / 5</span>
      </div>
    </div>
  );
}

// ÉPURÉ — angles francs, une colonne, beaucoup d'air, CTA en lien souligné.
function PreviewEpure({
  combo,
  commerce,
}: {
  combo: PreviewCombo;
  commerce: CommerceType;
}) {
  return (
    <div className="p-8 sm:p-11" style={{ backgroundColor: combo.bg, color: combo.ink }}>
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[0.62rem] uppercase tracking-[0.3em]"
          style={{ color: combo.ink }}
        >
          {brandLabel[commerce]}
        </span>
        <span
          className="font-mono text-[0.58rem] uppercase tracking-wide"
          style={{ color: combo.ink, opacity: 0.55, borderBottom: `1px solid ${combo.ink}` }}
        >
          Menu
        </span>
      </div>

      {/* hairline */}
      <div className="mt-8 h-px w-full" style={{ backgroundColor: `${combo.ink}22` }} />

      <div className="mt-8 max-w-md">
        <p
          className="font-mono text-[0.56rem] uppercase tracking-[0.28em]"
          style={{ color: combo.ink, opacity: 0.5 }}
        >
          {combo.category}
        </p>
        <h3
          className="mt-4 font-sans text-[1.6rem] font-medium leading-[1.15] tracking-tight"
          style={{ color: combo.ink }}
        >
          {combo.headline}
        </h3>
        <p
          className="mt-4 font-sans text-sm leading-relaxed"
          style={{ color: combo.ink, opacity: 0.6 }}
        >
          {combo.tagline}
        </p>
        <span
          className="mt-6 inline-flex items-center gap-1.5 pb-0.5 font-sans text-xs font-medium"
          style={{ color: combo.accent, borderBottom: `1.5px solid ${combo.accent}` }}
        >
          {combo.cta} <span aria-hidden>→</span>
        </span>
      </div>

      {/* motif discret, contour fin, aligné à droite */}
      <div className="mt-8 flex justify-end">
        <div className="w-28 opacity-80" style={{ filter: "grayscale(0.15)" }}>
          <Motif name={combo.motif} color={combo.accent} ink={combo.ink} />
        </div>
      </div>

      <div
        className="mt-8 flex gap-x-6 border-t pt-4 font-mono text-[0.56rem] uppercase tracking-wide"
        style={{ borderColor: `${combo.ink}18`, color: `${combo.ink}88` }}
      >
        <span>Ouvert</span>
        <span>Île-de-France</span>
      </div>
    </div>
  );
}

// PREMIUM — sombre, centré, filets dorés, serif, CTA doré tracké.
function PreviewPremium({
  combo,
  commerce,
}: {
  combo: PreviewCombo;
  commerce: CommerceType;
}) {
  return (
    <div
      className="p-6 sm:p-8"
      style={{ backgroundColor: combo.bg, color: combo.ink }}
    >
      <div
        className="rounded-lg p-6 text-center sm:p-8"
        style={{ border: `1px solid ${combo.accent}55` }}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-6" style={{ backgroundColor: `${combo.accent}88` }} />
          <span className="font-display text-lg italic" style={{ color: combo.ink }}>
            {brandLabel[commerce]}
          </span>
          <span className="h-px w-6" style={{ backgroundColor: `${combo.accent}88` }} />
        </div>

        <p
          className="mt-5 font-mono text-[0.56rem] uppercase tracking-[0.3em]"
          style={{ color: combo.accent }}
        >
          {combo.category}
        </p>
        <h3
          className="mx-auto mt-3 max-w-xs font-display text-[1.7rem] leading-tight sm:text-[1.9rem]"
          style={{ color: combo.ink }}
        >
          {combo.headline}
        </h3>
        <p
          className="mx-auto mt-3 max-w-xs font-sans text-sm leading-relaxed"
          style={{ color: combo.ink, opacity: 0.7 }}
        >
          {combo.tagline}
        </p>

        <div className="mx-auto mt-5 w-24 opacity-90">
          <Motif name={combo.motif} color={combo.accent} ink={combo.ink} />
        </div>

        <span
          className="mt-5 inline-block rounded-full px-6 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ backgroundColor: combo.accent, color: combo.bg }}
        >
          {combo.cta}
        </span>

        <div
          className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-x-4 border-t pt-4 font-mono text-[0.55rem] uppercase tracking-wide"
          style={{ borderColor: `${combo.accent}33`, color: `${combo.ink}99` }}
        >
          <span>Sur réservation</span>
          <span style={{ color: combo.accent }}>·</span>
          <span>★ 4,9</span>
        </div>
      </div>
    </div>
  );
}

function Preview({
  style,
  combo,
  commerce,
}: {
  style: StyleType;
  combo: PreviewCombo;
  commerce: CommerceType;
}) {
  if (style === "Épuré") return <PreviewEpure combo={combo} commerce={commerce} />;
  if (style === "Premium") return <PreviewPremium combo={combo} commerce={commerce} />;
  return <PreviewChaleureux combo={combo} commerce={commerce} />;
}

export default function Configurator() {
  const [commerce, setCommerce] = useState<CommerceType>("Restaurant");
  const [style, setStyle] = useState<StyleType>("Chaleureux");

  // Aperçu partageable : ?activite=Boutique&style=Épuré présélectionne la combo.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("activite");
    const s = p.get("style");
    if (c && (apercu.commerceTypes as string[]).includes(c)) {
      setCommerce(c as CommerceType);
    }
    if (s && (apercu.styleTypes as string[]).includes(s)) {
      setStyle(s as StyleType);
    }
  }, []);

  const combo = previewCombos[commerce][style];

  return (
    <section id={apercu.id} className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
          {apercu.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-cafe sm:text-5xl">
          <span className="display-em text-lie">Voyez</span>, plutôt qu'on vous le
          décrive.
        </h2>
        <p className="mt-4 font-sans text-lg text-cafe/70">{apercu.subtitle}</p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
        {/* Contrôles */}
        <div className="space-y-8">
          <fieldset>
            <legend className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-cafe/60">
              1 · Votre activité
            </legend>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {apercu.commerceTypes.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCommerce(c)}
                  aria-pressed={commerce === c}
                  className={`rounded-xl border px-4 py-3 text-left font-sans text-sm transition-all ${
                    commerce === c
                      ? "border-cafe bg-cafe text-nappe shadow-sm"
                      : "border-cafe/20 bg-craie/40 text-cafe hover:border-cafe/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-cafe/60">
              2 · Votre style
            </legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {apercu.styleTypes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  aria-pressed={style === s}
                  className={`rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-wide transition-all ${
                    style === s
                      ? "border-lie bg-lie text-nappe"
                      : "border-cafe/20 text-cafe/80 hover:border-cafe/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 font-sans text-xs italic text-cafe/55">
              Chaque style change la mise en page, la typo et le ton — pas
              seulement la couleur.
            </p>
          </fieldset>

          <p className="rounded-xl border border-cafe/10 bg-craie/40 px-5 py-4 font-sans text-sm leading-relaxed text-cafe/70">
            {apercu.disclaimer}
          </p>

          <a
            href={apercu.cta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-lie px-6 py-3.5 font-sans text-sm font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe"
          >
            {apercu.cta.label}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Preview — cadre navigateur */}
        <div className="rounded-2xl border border-cafe/15 bg-craie/30 p-3 shadow-[0_30px_60px_-35px_rgba(46,37,33,0.5)] sm:p-4">
          {/* Barre du navigateur */}
          <div className="flex items-center gap-2 px-2 pb-3">
            <span className="h-3 w-3 rounded-full bg-lie/60" />
            <span className="h-3 w-3 rounded-full bg-moutarde/70" />
            <span className="h-3 w-3 rounded-full bg-sauge/70" />
            <div className="ml-3 flex-1 rounded-md bg-nappe/70 px-3 py-1 font-mono text-[0.6rem] text-cafe/50">
              votre-commerce.fr
            </div>
          </div>

          {/* Contenu de la maquette */}
          <div className="overflow-hidden rounded-xl">
            <div key={`${commerce}-${style}`} className="preview-in">
              <Preview style={style} combo={combo} commerce={commerce} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
