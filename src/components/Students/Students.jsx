import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { fetchData } from "../../data";
import StudentCard from "./StudentCard";
import ActiveFilters from "../shared/ActiveFilters";
import EmptyState from "../shared/EmptyState";
import LoadingState from "../shared/LoadingState";
import PageHeader from "../shared/PageHeader";

const Students = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setError(null);
      try {
        const students = await fetchData("students");
        setData([...(students || [])].sort((a, b) => (a.lastName || "").localeCompare(b.lastName || "")));
      } catch (error) {
        console.error("Error fetching students data: ", error);
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((student) => {
      const text = `${student.firstName || ""} ${student.lastName || ""} ${student.thesis_topic || ""}`.toLowerCase();
      return (!normalizedQuery || text.includes(normalizedQuery)) && (!program || student.program === program);
    });
  }, [data, program, query]);

  const resetFilters = () => {
    setQuery("");
    setProgram("");
  };

  const activeFilters = [
    program && {
      key: "program",
      label: program === "doctorado" ? "Programa: Doctorado" : "Programa: Maestría",
      onRemove: () => setProgram(""),
    },
    query && {
      key: "query",
      label: `Búsqueda: ${query}`,
      onRemove: () => setQuery(""),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <PageHeader eyebrow="Comunidad académica" icon={Users} title="Estudiantes" description="Tesistas de las carreras de posgrado." />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nombre o tema de tesis" className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 outline-none transition focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20" aria-label="Buscar estudiantes" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Limpiar búsqueda"><X className="h-5 w-5" /></button>}</div>
        <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700"><SlidersHorizontal className="h-4 w-4 text-gray-500" /><span className="sr-only">Filtrar programa</span><select value={program} onChange={(event) => setProgram(event.target.value)} className="bg-transparent py-2.5 outline-none"><option value="">Todos los programas</option><option value="doctorado">Doctorado</option><option value="maestria">Maestría</option></select></label>
      </div>
      {!isLoading && !error ? (
        <ActiveFilters filters={activeFilters} onClearAll={resetFilters} resultLabel={`${filteredData.length} ${filteredData.length === 1 ? "estudiante" : "estudiantes"}`} />
      ) : null}

      {isLoading ? <LoadingState label="Cargando estudiantes…" /> : error ? (
        <EmptyState icon={AlertCircle} title="No se pudieron cargar los estudiantes" description={error} variant="error" />
      ) : filteredData.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredData.map((student) => <StudentCard key={student.id || `${student.lastName}-${student.firstName}`} student={student} />)}</div>
      ) : <EmptyState icon={Search} title="No hay estudiantes para estos filtros" description="Probá con otro nombre, tema o programa." actionLabel="Limpiar filtros" onAction={resetFilters} />}
    </main>
  );
};

export default Students;
