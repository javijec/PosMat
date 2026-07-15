import CollapsibleFilterPanel from "../shared/CollapsibleFilterPanel";

const CourseFilter = ({ years, selectedYear, setSelectedYear, selectedSemester, setSelectedSemester, selectedType, setSelectedType, onReset, activeCount = 0 }) => (
  <CollapsibleFilterPanel activeCount={activeCount} onReset={onReset}>
    <label className="block text-sm font-medium text-gray-700">Año<select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los años</option>{years.map((year) => <option key={year} value={String(year)}>{year}</option>)}</select></label>
    <label className="mt-4 block text-sm font-medium text-gray-700">Semestre<select value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los semestres</option><option value="1">1.º semestre</option><option value="2">2.º semestre</option></select></label>
    <label className="mt-4 block text-sm font-medium text-gray-700">Tipo<select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los tipos</option><option value="cientifico">Científico</option><option value="humanistico">Humanístico</option></select></label>
  </CollapsibleFilterPanel>
);

export default CourseFilter;
