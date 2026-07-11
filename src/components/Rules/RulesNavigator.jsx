import { ChevronLeft, ChevronRight, List } from "lucide-react";

const RulesNavigator = ({ data, selectedSection, onPrev, onNext, onSelect }) => {
  const selectedIndex = data.findIndex((section) => section.id === selectedSection?.id);

  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:sticky lg:top-6" aria-label="Secciones del reglamento">
      <div className="mb-2 flex items-center gap-2 px-2 pt-1 text-sm font-semibold text-gray-700">
        <List className="h-4 w-4 text-ingenieria" />
        Secciones
      </div>
      <div className="max-h-[55vh] space-y-1 overflow-y-auto pr-1">
        {data.map((section, index) => {
          const isSelected = section.id === selectedSection?.id;
          return (
            <button
              key={section.id}
              onClick={() => onSelect(section)}
              aria-current={isSelected ? "page" : undefined}
              className={`flex w-full gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                isSelected ? "bg-ingenieria text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className={`mt-0.5 text-xs font-semibold ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{section.title}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3 lg:hidden">
        <button onClick={onPrev} disabled={selectedIndex === 0} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <button onClick={onNext} disabled={selectedIndex === data.length - 1} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">
          Siguiente <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default RulesNavigator;
