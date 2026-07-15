import { X } from "lucide-react";

const ActiveFilters = ({ filters = [], onClearAll, resultLabel }) => {
  const activeFilters = filters.filter(Boolean);

  if (!activeFilters.length && !resultLabel) return null;

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {resultLabel ? (
          <span className="text-sm font-medium text-[var(--text-main)]/75">
            {resultLabel}
          </span>
        ) : null}

        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={filter.onRemove}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--color-ingenieria)]/20 bg-[var(--color-ingenieria)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-ingenieria)] transition hover:bg-[var(--color-ingenieria)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
            aria-label={`Quitar filtro ${filter.label}`}
          >
            <span className="truncate">{filter.label}</span>
            <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
        ))}
      </div>

      {activeFilters.length && onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          className="self-start rounded-md text-sm font-semibold text-[var(--color-ingenieria)] transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30 sm:self-auto"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
};

export default ActiveFilters;
