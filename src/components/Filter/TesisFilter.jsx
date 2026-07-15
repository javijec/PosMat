import CollapsibleFilterPanel from "../shared/CollapsibleFilterPanel";

const TesisFilter = ({ selectedType, handleTypeChange, selectedYear, handleYearChange, years, onlyWithPdf, setOnlyWithPdf, onReset, activeCount = 0 }) => (
  <CollapsibleFilterPanel activeCount={activeCount} onReset={onReset} className="lg:sticky lg:top-24">
    <label className="block text-sm font-medium text-gray-700">Tipo<select value={selectedType} onChange={handleTypeChange} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="all">Todos</option><option value="doctorado">Doctorado</option><option value="maestria">Maestría</option></select></label>
    <label className="mt-4 block text-sm font-medium text-gray-700">Año<select value={selectedYear} onChange={handleYearChange} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los años</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
    <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={onlyWithPdf} onChange={(event) => setOnlyWithPdf(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-ingenieria focus:ring-ingenieria" /> Solo con PDF disponible</label>
  </CollapsibleFilterPanel>
);

export default TesisFilter;
