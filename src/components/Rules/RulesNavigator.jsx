import { ChevronLeft, ChevronRight, List } from "lucide-react";

const RulesNavigator = ({ data, selectedSection, onPrev, onNext, onSelect }) => {
  const selectedIndex = data.findIndex((section) => section.id === selectedSection?.id);

  return (
    <aside className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:sticky lg:top-6" aria-label="Secciones del reglamento">
      <div className="mb-2 flex items-center gap-2 px-2 pt-1 text-sm font-semibold text-gray-700 lg:hidden">
        <List className="h-4 w-4 text-ingenieria" />
        Secciones
      </div>
      <div className="min-w-0 flex gap-2 lg:hidden">
        <select
          value={selectedSection?.id || ""}
          onChange={(event) => {
            const section = data.find((item) => String(item.id) === event.target.value);
            if (section) onSelect(section);
          }}
          className="w-0 min-w-0 flex-1 truncate rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20"
          aria-label="Seleccionar sección"
        >
          {data.map((section, index) => <option key={section.id} value={section.id}>{index + 1}. {section.title.length > 42 ? `${section.title.slice(0, 42)}…` : section.title}</option>)}
        </select>
        <button onClick={onPrev} disabled={selectedIndex === 0} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Sección anterior"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={onNext} disabled={selectedIndex === data.length - 1} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Sección siguiente"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="hidden max-h-[calc(100vh-8rem)] space-y-1 overflow-y-auto pr-1 lg:block">
        <div className="mb-2 flex items-center gap-2 px-2 pt-1 text-sm font-semibold text-gray-700">
          <List className="h-4 w-4 text-ingenieria" />
          Secciones
        </div>
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
    </aside>
  );
};

export default RulesNavigator;
