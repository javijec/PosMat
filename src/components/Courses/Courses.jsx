import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { AlertCircle, BookOpen, Search, X } from "lucide-react";
import CourseFilter from "./CourseFilter";
import CoursesDisplay from "./CoursesDisplay";
import { fetchData } from "../../data";
import ActiveFilters from "../shared/ActiveFilters";
import EmptyState from "../shared/EmptyState";
import LoadingState from "../shared/LoadingState";
import PageHeader from "../shared/PageHeader";
import Breadcrumbs from "../shared/Breadcrumbs";

const Courses = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [query, setQuery] = useState("");

  const { data = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const result = await fetchData("courses");
      if (!Array.isArray(result)) return [];
      return result
        .map((doc) => ({ id: doc.id, ...doc, año: Number(doc.año), semestre: Number(doc.semestre) }))
        .filter((course) => Number.isFinite(course.año) && Number.isFinite(course.semestre))
        .sort((a, b) => b.año - a.año || a.semestre - b.semestre);
    },
  });

  const years = useMemo(() => [...new Set(data.map((course) => course.año))].sort((a, b) => b - a), [data]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((course) => {
      const searchable = `${course.nombre || ""} ${course.lugar || ""} ${(course.profesores || []).map((professor) => professor.nombre).join(" ")}`.toLowerCase();
      const isHumanistico = course.humanistico === true || course.humanistico === "true";
      const matchesType = !selectedType || (selectedType === "humanistico" ? isHumanistico : !isHumanistico);
      return (!selectedYear || course.año === Number(selectedYear)) && (!selectedSemester || course.semestre === Number(selectedSemester)) && matchesType && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [data, query, selectedSemester, selectedType, selectedYear]);

  const groupedBySemester = useMemo(() => filteredCourses.reduce((groups, course) => {
    const key = `${course.año}-${course.semestre}`;
    groups[key] = [...(groups[key] || []), course];
    return groups;
  }, {}), [filteredCourses]);

  const resetFilters = () => {
    setSelectedYear("");
    setSelectedSemester("");
    setSelectedType("");
    setQuery("");
  };

  const activeFilters = [
    selectedYear && {
      key: "year",
      label: `Año: ${selectedYear}`,
      onRemove: () => setSelectedYear(""),
    },
    selectedSemester && {
      key: "semester",
      label: `Semestre: ${selectedSemester}.º`,
      onRemove: () => setSelectedSemester(""),
    },
    selectedType && {
      key: "type",
      label: selectedType === "humanistico" ? "Tipo: Humanístico" : "Tipo: Científico",
      onRemove: () => setSelectedType(""),
    },
    query && {
      key: "query",
      label: `Búsqueda: ${query}`,
      onRemove: () => setQuery(""),
    },
  ];
  const activeFilterCount = activeFilters.filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 md:py-14">
      <Helmet><title>Cursos | PosMat</title><meta name="description" content="Listado de cursos del Posgrado en Ciencia de Materiales." /></Helmet>
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumbs items={[{ label: "Posgrado" }, { label: "Cursos" }]} />
        <PageHeader eyebrow="Posgrado" icon={BookOpen} title="Cursos" description="Oferta académica del Posgrado en Ciencia de Materiales." />
        {isLoading ? <LoadingState label="Cargando cursos…" /> : error ? <EmptyState icon={AlertCircle} title="No se pudieron cargar los cursos" description="Revisá la conexión e intentá nuevamente." actionLabel={isFetching ? "Reintentando…" : "Reintentar"} onAction={() => refetch()} actionDisabled={isFetching} variant="error" /> : (
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
            <aside className="lg:sticky lg:top-6 lg:h-fit"><CourseFilter years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} selectedType={selectedType} setSelectedType={setSelectedType} onReset={resetFilters} activeCount={activeFilterCount} /></aside>
            <section className="mt-8 lg:mt-0">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar curso, docente o lugar" className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-9 outline-none transition focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20" aria-label="Buscar cursos" />{query && <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ingenieria/30" aria-label="Limpiar búsqueda"><X className="h-4 w-4" /></button>}</div></div>
              <ActiveFilters filters={activeFilters} onClearAll={resetFilters} resultLabel={`${filteredCourses.length} ${filteredCourses.length === 1 ? "curso" : "cursos"}`} />
              {filteredCourses.length ? <CoursesDisplay groupedCourses={groupedBySemester} /> : <EmptyState icon={Search} title="No hay cursos para estos filtros" description="Probá otro año, semestre o búsqueda." actionLabel="Limpiar filtros" onAction={resetFilters} />}
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default Courses;
