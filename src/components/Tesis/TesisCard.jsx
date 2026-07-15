import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileText, GraduationCap, UserRound } from "lucide-react";

const ThesisTextPanel = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-4">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-left transition hover:border-[var(--color-ingenieria)]/30"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-main)]/65">
          {title}
        </span>
        <span className="rounded-full border border-[var(--border-subtle)] p-1 text-[var(--text-main)]/45">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {isOpen ? (
        <div className="mt-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)]/50 p-4 md:p-5">
          <p className="whitespace-pre-line text-justify text-[15px] leading-7 text-[var(--text-main)]/85">
            {children}
          </p>
        </div>
      ) : null}
    </div>
  );
};

const TesisCard = ({ tesis }) => {
  const [expanded, setExpanded] = useState(false);
  const jurors = [tesis.juror_1, tesis.juror_2, tesis.juror_3].filter(Boolean);
  const degreeLabel = tesis.tag === "doctorado" ? "Doctorado" : "Maestría";

  return (
    <motion.li
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full p-5 text-left transition-colors hover:bg-black/[0.015]"
        aria-expanded={expanded}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ingenieria)]/10 px-2.5 py-1 text-xs font-bold text-[var(--color-ingenieria)]">
              <GraduationCap className="h-3.5 w-3.5" />
              {degreeLabel}
            </span>
            <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]/70">
              {tesis.year || "Sin año"}
            </span>
            {tesis.url ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <FileText className="h-3.5 w-3.5" />
                PDF
              </span>
            ) : null}
          </div>
          <div className="rounded-full border border-[var(--border-subtle)] p-1 text-[var(--text-main)]/45">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
        <h3 className="mb-4 text-xl font-bold leading-snug text-[var(--text-main)]">
          {tesis.title}
        </h3>
        <div className="grid gap-2 text-sm text-[var(--text-main)]/78 sm:grid-cols-2">
          <p className="flex items-start gap-2">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ingenieria)]" />
            <span><span className="font-semibold text-[var(--text-main)]">Autor/a:</span> {tesis.name || "Sin especificar"}</span>
          </p>
          <p><span className="font-semibold text-[var(--text-main)]">Director/a:</span> {tesis.director || "Sin especificar"}</p>
          {tesis.co_director ? <p className="sm:col-span-2"><span className="font-semibold text-[var(--text-main)]">Co-director/a:</span> {tesis.co_director}</p> : null}
        </div>
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 px-5 py-4">
          {tesis.degree_title && (
            <p className="text-[var(--text-main)]/80 text-sm">
              <span className="text-[var(--text-main)]/60">
                Título al que aspira:
              </span>{" "}
              {tesis.degree_title}
            </p>
          )}
          {tesis.workplace && (
            <p className="text-[var(--text-main)]/80 text-sm">
              <span className="text-[var(--text-main)]/60">
                Lugar de trabajo:
              </span>{" "}
              {tesis.workplace}
            </p>
          )}
          {tesis.defense_date && (
            <p className="text-[var(--text-main)]/80 text-sm">
              <span className="text-[var(--text-main)]/60">
                Fecha de defensa:
              </span>{" "}
              {tesis.defense_date}
            </p>
          )}
          {jurors.length > 0 && (
            <div className="text-[var(--text-main)]/80 text-sm">
              <p className="text-[var(--text-main)]/60 mb-1">Jurados:</p>
              <div className="space-y-1">
                {jurors.map((juror) => (
                  <p key={juror} className="whitespace-pre-line">
                    {juror}
                  </p>
                ))}
              </div>
            </div>
          )}
          {jurors.length === 0 && tesis.jurors && (
            <p className="text-[var(--text-main)]/80 text-sm whitespace-pre-line">
              <span className="text-[var(--text-main)]/60">Jurados:</span>{" "}
              {tesis.jurors}
            </p>
          )}
          {tesis.summary_es && (
            <ThesisTextPanel title="Resumen">{tesis.summary_es}</ThesisTextPanel>
          )}
          {tesis.abstract_en && (
            <ThesisTextPanel title="Abstract">{tesis.abstract_en}</ThesisTextPanel>
          )}
          {tesis.url && (
            <div className="pt-3">
              <a href={tesis.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-ingenieria)]/20 bg-[var(--color-ingenieria)]/10 px-3 py-2 text-sm font-bold text-[var(--color-ingenieria)] transition hover:bg-[var(--color-ingenieria)]/15"><FileText className="h-4 w-4" />Abrir PDF</a>
            </div>
          )}
        </div>

      )}
    </motion.li>
  );
};

export default TesisCard;
