import { useId, useState } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";

const CollapsibleFilterPanel = ({
  activeCount = 0,
  children,
  className = "",
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  const titleContent = (
    <>
      <Filter className="h-4 w-4 text-ingenieria" />
      Filtros
      {activeCount ? (
        <span className="rounded-full bg-ingenieria/10 px-2 py-0.5 text-xs font-semibold text-ingenieria">
          {activeCount}
        </span>
      ) : null}
    </>
  );

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex items-center gap-2 font-semibold text-gray-900 lg:hidden"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          {titleContent}
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        <h2 className="hidden items-center gap-2 font-semibold text-gray-900 lg:flex">
          {titleContent}
        </h2>

        <button
          type="button"
          onClick={onReset}
          disabled={!activeCount}
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-ingenieria disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Limpiar
        </button>
      </div>

      <div id={panelId} className={`mt-4 ${isOpen ? "block" : "hidden"} lg:block`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleFilterPanel;
