import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const getDirectorTitleFromName = (value) => {
  const text = String(value || "").trim();
  if (/^\s*(directora|dra\.?)\b/i.test(text)) return "Directora:";
  if (/^\s*(director|dr\.?)\b/i.test(text)) return "Director:";
  return "Director:";
};

const TesisCard = ({ tesis }) => {
  const [expanded, setExpanded] = useState(false);
  const jurors = [tesis.juror_1, tesis.juror_2, tesis.juror_3].filter(Boolean);

  return (
    <motion.li
      className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-subtle)] transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full p-5 text-left"
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className="text-sm font-semibold text-ingenieria tracking-wide uppercase">
            {tesis.year}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-md text-xs font-bold bg-ingenieria/10 text-[#2d5257] border border-ingenieria/20 dark:bg-ingenieria/20 dark:text-ingenieria-hover"
            >
              {tesis.tag === "doctorado" ? "Doctorado" : "Maestría"}
            </span>
            <span className="text-[var(--text-main)]/40">
              <FontAwesomeIcon
                icon={expanded ? faChevronUp : faChevronDown}
                className="h-4 w-4"
              />
            </span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 leading-snug">
          {tesis.title}
        </h3>
        <div className="space-y-1">
          <p className="text-[var(--text-main)] font-medium text-sm">
            <span className="text-[var(--text-main)]/60">Autor:</span>{" "}
            {tesis.name}
          </p>
          <p className="text-[var(--text-main)]/80 text-sm">
            <span className="text-[var(--text-main)]/60">Director:</span>{" "}
            {tesis.director}
          </p>
          {tesis.co_director && (
            <p className="text-[var(--text-main)]/80 text-sm">
              <span className="text-[var(--text-main)]/60">Co-director/a:</span>{" "}
              {tesis.co_director}
            </p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border-subtle)] px-5 py-4 space-y-1">
          {tesis.url && (
            <div className="pb-2">
              <a
                href={tesis.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-3 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-900 hover:bg-purple-200 transition-all dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800"
              >
                Abrir enlace
              </a>
            </div>
          )}
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
            <div className="pt-4">
              <p className="text-[var(--text-main)]/60 text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                Resumen
              </p>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)]/50 p-4 md:p-5">
                <p className="text-[var(--text-main)]/85 text-[15px] leading-7 whitespace-pre-line text-justify">
                  {tesis.summary_es}
                </p>
              </div>
            </div>
          )}
          {tesis.abstract_en && (
            <div className="pt-4">
              <p className="text-[var(--text-main)]/60 text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                Abstract
              </p>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)]/50 p-4 md:p-5">
                <p className="text-[var(--text-main)]/85 text-[15px] leading-7 whitespace-pre-line text-justify">
                  {tesis.abstract_en}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.li>
  );
};

export default TesisCard;
