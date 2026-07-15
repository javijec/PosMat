import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, Search, X } from "lucide-react";
import { fetchData } from "../../data";
import RulesNavigator from "./RulesNavigator";
import RulesContent from "./RulesContent";
import PageHeader from "../shared/PageHeader";

const getSearchableText = (section) =>
  `${section.title || ""} ${(section.html || "").replace(/<[^>]*>/g, " ")}`.toLowerCase();

const Rules = () => {
  const [data, setData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rulesData = await fetchData("rules");
      const sortedData = [...(rulesData || [])].sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );
      setData(sortedData);
      setSelectedSection((current) => current || sortedData[0] || null);
    } catch (fetchError) {
      console.error("Error fetching rules data: ", fetchError);
      setError("No se pudieron cargar los reglamentos. Intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const visibleSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return data;

    return data.filter((section) =>
      getSearchableText(section).includes(normalizedQuery)
    );
  }, [data, query]);

  useEffect(() => {
    if (
      selectedSection &&
      visibleSections.length > 0 &&
      !visibleSections.some((section) => section.id === selectedSection.id)
    ) {
      setSelectedSection(visibleSections[0]);
    }
  }, [selectedSection, visibleSections]);

  const selectedIndex = visibleSections.findIndex(
    (section) => section.id === selectedSection?.id
  );

  const previousSection = () => {
    if (selectedIndex > 0) setSelectedSection(visibleSections[selectedIndex - 1]);
  };

  const nextSection = () => {
    if (selectedIndex < visibleSections.length - 1) {
      setSelectedSection(visibleSections[selectedIndex + 1]);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center" role="status">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-ingenieria" />
        <p className="mt-4 text-gray-600">Cargando reglamentos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">No fue posible cargar la información</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={fetchRules} className="mt-6 rounded-lg bg-ingenieria px-4 py-2 font-medium text-white hover:opacity-90">
          Reintentar
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Reglamentos no disponibles</h1>
        <p className="mt-2 text-gray-600">Todavía no hay reglamentos publicados.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <PageHeader eyebrow="Posgrado" icon={BookOpen} title="Reglamentos" description="Consultá requisitos, procedimientos y documentación de las carreras de posgrado." />

      <div className="relative mb-6 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 shadow-sm outline-none transition focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20"
          placeholder="Buscar en reglamentos…"
          aria-label="Buscar en reglamentos"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800" aria-label="Limpiar búsqueda">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {visibleSections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-gray-600">
          No hay resultados para “{query}”. Probá otra búsqueda.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <RulesNavigator
            data={visibleSections}
            selectedSection={selectedSection}
            onPrev={previousSection}
            onNext={nextSection}
            onSelect={setSelectedSection}
          />
          <RulesContent
            selectedSection={selectedSection}
            current={selectedIndex + 1}
            total={visibleSections.length}
            onPrev={previousSection}
            onNext={nextSection}
            canGoPrev={selectedIndex > 0}
            canGoNext={selectedIndex < visibleSections.length - 1}
          />
        </div>
      )}
    </main>
  );
};

export default Rules;
