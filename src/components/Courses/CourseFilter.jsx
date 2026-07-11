import { Filter, RotateCcw } from "lucide-react";

const CourseFilter = ({ years, selectedYear, setSelectedYear, selectedSemester, setSelectedSemester, selectedType, setSelectedType, onReset }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold text-gray-900"><Filter className="h-4 w-4 text-ingenieria" /> Filtros</h2><button onClick={onReset} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-ingenieria"><RotateCcw className="h-3.5 w-3.5" /> Limpiar</button></div>
    <label className="block text-sm font-medium text-gray-700">Año<select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los años</option>{years.map((year) => <option key={year} value={String(year)}>{year}</option>)}</select></label>
    <label className="mt-4 block text-sm font-medium text-gray-700">Semestre<select value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los semestres</option><option value="1">1.º semestre</option><option value="2">2.º semestre</option></select></label>
    <label className="mt-4 block text-sm font-medium text-gray-700">Tipo<select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los tipos</option><option value="cientifico">Científico</option><option value="humanistico">Humanístico</option></select></label>
  </div>
);

export default CourseFilter;
