import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { BookOpen, Search, X } from "lucide-react";
import CourseFilter from "./CourseFilter";
import CoursesDisplay from "./CoursesDisplay";
import { fetchData } from "../../data";

const Courses = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [query, setQuery] = useState("");

  const { data = [], isLoading, error } = useQuery({
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

  useEffect(() => {
    if (years.length && !selectedYear) setSelectedYear(String(years[0]));
  }, [years, selectedYear]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((course) => {
      const searchable = `${course.nombre || ""} ${course.lugar || ""} ${(course.profesores || []).map((professor) => professor.nombre).join(" ")}`.toLowerCase();
      return (!selectedYear || course.año === Number(selectedYear)) && (!selectedSemester || course.semestre === Number(selectedSemester)) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [data, query, selectedSemester, selectedYear]);

  const groupedBySemester = useMemo(() => filteredCourses.reduce((groups, course) => {
    const key = `${course.año}-${course.semestre}`;
    groups[key] = [...(groups[key] || []), course];
    return groups;
  }, {}), [filteredCourses]);

  const resetFilters = () => {
    setSelectedYear(years[0] ? String(years[0]) : "");
    setSelectedSemester("");
    setQuery("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 md:py-14">
      <Helmet><title>Cursos | PosMat</title><meta name="description" content="Listado de cursos del Posgrado en Ciencia de Materiales." /></Helmet>
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8 max-w-2xl"><p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ingenieria"><BookOpen className="h-4 w-4" /> Posgrado</p><h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Cursos</h1><p className="mt-3 text-gray-600">Oferta académica del Posgrado en Ciencia de Materiales.</p></header>
        {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-ingenieria" /></div> : error ? <div className="py-10 text-center text-red-600">No se pudieron cargar los cursos.</div> : (
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
            <aside className="lg:sticky lg:top-6 lg:h-fit"><CourseFilter years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} onReset={resetFilters} /></aside>
            <section className="mt-8 lg:mt-0">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar curso, docente o lugar" className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-9 outline-none focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20" aria-label="Buscar cursos" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Limpiar búsqueda"><X className="h-4 w-4" /></button>}</div><p className="shrink-0 text-sm text-gray-500">{filteredCourses.length} {filteredCourses.length === 1 ? "curso" : "cursos"}</p></div>
              {filteredCourses.length ? <CoursesDisplay groupedCourses={groupedBySemester} /> : <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"><h2 className="text-xl font-bold text-gray-900">No hay cursos para estos filtros</h2><p className="mt-2 text-gray-600">Probá otro año, semestre o búsqueda.</p><button onClick={resetFilters} className="mt-5 font-medium text-ingenieria hover:underline">Limpiar filtros</button></div>}
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default Courses;
