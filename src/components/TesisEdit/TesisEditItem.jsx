import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const TesisEditItem = ({ t, expanded, onToggle, handleEdit, handleDelete }) => {
  const jurors = useMemo(
    () => [t.juror_1, t.juror_2, t.juror_3].filter(Boolean),
    [t.juror_1, t.juror_2, t.juror_3]
  );

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm transition-all duration-200 hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[var(--color-ingenieria)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-ingenieria)]">
                {t.year}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                  t.tag === "maestria"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {t.tag === "maestria" ? "Maestría" : "Doctorado"}
              </span>
            </div>

            <h3 className="truncate text-base font-bold text-[var(--text-main)]">
              {t.title}
            </h3>

            <p className="mt-1 truncate text-sm text-[var(--text-main)]/65">
              {t.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(t);
              }}
              className="inline-flex items-center rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-500/20"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(t.id);
              }}
              className="inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/20"
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </button>
            <span className="pt-1 text-[var(--text-main)]/40">
              <FontAwesomeIcon
                icon={expanded ? faChevronUp : faChevronDown}
                className="h-4 w-4"
              />
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border-subtle)] px-4 py-4">
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <p className="text-[var(--text-main)]/80">
              <span className="font-semibold text-[var(--text-main)]/55">
                Autor:
              </span>{" "}
              {t.name}
            </p>
            <p className="text-[var(--text-main)]/80">
              <span className="font-semibold text-[var(--text-main)]/55">
                Director:
              </span>{" "}
              {t.director || "-"}
            </p>
            {t.degree_title && (
              <p className="text-[var(--text-main)]/80 md:col-span-2">
                <span className="font-semibold text-[var(--text-main)]/55">
                  Título al que aspira:
                </span>{" "}
                {t.degree_title}
              </p>
            )}
            {t.co_director && (
              <p className="text-[var(--text-main)]/80 md:col-span-2 whitespace-pre-line">
                <span className="font-semibold text-[var(--text-main)]/55">
                  Co-director/a:
                </span>{" "}
                {t.co_director}
              </p>
            )}
            {t.workplace && (
              <p className="text-[var(--text-main)]/80">
                <span className="font-semibold text-[var(--text-main)]/55">
                  Lugar de trabajo:
                </span>{" "}
                {t.workplace}
              </p>
            )}
            {t.defense_date && (
              <p className="text-[var(--text-main)]/80">
                <span className="font-semibold text-[var(--text-main)]/55">
                  Fecha de defensa:
                </span>{" "}
                {t.defense_date}
              </p>
            )}
            {jurors.length > 0 && (
              <p className="text-[var(--text-main)]/80 md:col-span-2">
                <span className="font-semibold text-[var(--text-main)]/55">
                  Jurados:
                </span>{" "}
                {jurors.join(" | ")}
              </p>
            )}
            {jurors.length === 0 && t.jurors && (
              <p className="text-[var(--text-main)]/80 md:col-span-2 whitespace-pre-line">
                <span className="font-semibold text-[var(--text-main)]/55">
                  Jurados:
                </span>{" "}
                {t.jurors}
              </p>
            )}
            {t.url && (
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria-hover)]"
              >
                Abrir enlace
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TesisEditItem;
