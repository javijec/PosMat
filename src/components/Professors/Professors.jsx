import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Search, Users, X } from "lucide-react";
import { fetchData } from "../../data";
import ProfessorCard from "./ProfessorCard";
import EmptyState from "../shared/EmptyState";
import LoadingState from "../shared/LoadingState";
import PageHeader from "../shared/PageHeader";

const Professors = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfessors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const professors = await fetchData("professors");
      setData([...(professors || [])].sort((a, b) => (a.lastName || "").localeCompare(b.lastName || "")));
    } catch (error) {
      console.error("Error fetching professors data: ", error);
      setError("No se pudieron cargar los profesores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const filteredData = useMemo(() => {
    const query = searchName.trim().toLowerCase();
    if (!query) return data;
    return data.filter((professor) => `${professor.firstName || ""} ${professor.lastName || ""}`.toLowerCase().includes(query));
  }, [data, searchName]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <PageHeader eyebrow="Comunidad académica" icon={Users} title="Profesores" description="Equipo docente e investigadores del Posgrado." />

      <div className="relative mb-8 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input value={searchName} onChange={(event) => setSearchName(event.target.value)} placeholder="Buscar por nombre o apellido" className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 outline-none transition focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20" aria-label="Buscar profesores" />
        {searchName && <button onClick={() => setSearchName("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800" aria-label="Limpiar búsqueda"><X className="h-5 w-5" /></button>}
      </div>

      {isLoading ? <LoadingState label="Cargando profesores…" /> : error ? (
        <EmptyState icon={AlertCircle} title="No se pudieron cargar los profesores" description={error} actionLabel="Reintentar" onAction={fetchProfessors} variant="error" />
      ) : filteredData.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredData.map((professor) => <ProfessorCard key={professor.id || `${professor.lastName}-${professor.firstName}`} professor={professor} />)}</div>
      ) : <EmptyState icon={Search} title="No hay profesores para esta búsqueda" description="Probá con otro nombre o apellido." actionLabel="Limpiar búsqueda" onAction={() => setSearchName("")} />}
    </main>
  );
};

export default Professors;
