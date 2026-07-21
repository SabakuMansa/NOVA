"use client";

import { useState } from "react";

/**
 * Un créneau du planning "Espace salon" (accueil /exemples/autonome).
 *
 * Le module clé du zip "Maison Doré" recrée un tableau de planning — mais
 * ce plan (Autonome) doit rester lisible comme "le commerçant modifie
 * lui-même son contenu", pas comme un tableau de bord automatisé (c'est la
 * distinction avec le plan Machine). Ce composant ajoute donc un discret
 * crayon d'édition sur un créneau : au clic, il révèle un champ texte + un
 * bouton "Enregistrer" dans la même palette or/noir — mockup visuel local,
 * sans backend, sans animation (juste un rendu conditionnel), à l'image de
 * /exemples/autonome/espace-admin.
 */
export default function PlanningSlot({
  text,
  borderColor,
}: {
  text: string;
  borderColor: string;
}) {
  const [value, setValue] = useState(text);
  const [draft, setDraft] = useState(text);
  const [editing, setEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-w-0 rounded-sm border border-[#cabfa6] bg-white px-2 py-1.5 font-metam-sans text-[12px] text-[#3a3226] focus:border-[#b89968] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            setValue(draft);
            setEditing(false);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
          }}
          className="shrink-0 rounded-sm bg-[#b89968] px-2.5 py-1.5 font-metam-sans text-[10px] font-semibold uppercase tracking-wide text-[#161310]"
        >
          Enregistrer
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      aria-label={`Modifier le rendez-vous : ${value}`}
      className="group flex w-full items-center justify-between gap-2 py-2 pl-2.5 pr-2 text-left"
      style={{ borderLeft: `3px solid ${borderColor}`, background: "#f6efdf" }}
    >
      <span className="font-metam-sans text-[12px] text-[#3a3226]">
        {value}
      </span>
      <span
        aria-hidden
        className="shrink-0 font-metam-sans text-[11px] text-[#a9946a] opacity-60 transition-opacity group-hover:opacity-100"
      >
        {justSaved ? "✓" : "✏️"}
      </span>
    </button>
  );
}
