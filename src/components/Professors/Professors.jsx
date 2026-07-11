import { useEffect, useMemo, useState } from "react";
import { Search, Users, X } from "lucide-react";
import { fetchData } from "../../data";
import ProfessorCard from "./ProfessorCard";

const Professors = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const professors = await fetchData("professors");
        setData([...(professors || [])].sort((a, b) => (a.lastName || "").localeCompare(b.lastName || "")));
      } catch (error) {
        console.error("Error fetching professors data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessors();
  }, []);

  const filteredData = useMemo(() => {
    const query = searchName.trim().toLowerCase();
    if (!query) return data;
    return data.filter((professor) => `${professor.firstName || ""} ${professor.lastName || ""}`.toLowerCase().includes(query));
  }, [data, searchName]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ingenieria"><Users className="h-4 w-4" /> Comunidad académica</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Profesores</h1>
        <p className="mt-3 text-gray-600">Equipo docente e investigadores del Posgrado.</p>
      </header>

      <div className="relative mb-8 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input value={searchName} onChange={(event) => setSearchName(event.target.value)} placeholder="Buscar por nombre o apellido" className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 outline-none transition focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20" aria-label="Buscar profesores" />
        {searchName && <button onClick={() => setSearchName("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800" aria-label="Limpiar búsqueda"><X className="h-5 w-5" /></button>}
      </div>

      {isLoading ? <p className="py-12 text-center text-gray-500">Cargando profesores…</p> : filteredData.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredData.map((professor) => <ProfessorCard key={professor.id || `${professor.lastName}-${professor.firstName}`} professor={professor} />)}</div>
      ) : <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-gray-600">No hay profesores que coincidan con tu búsqueda.</p>}
    </main>
  );
};

export default Professors;
