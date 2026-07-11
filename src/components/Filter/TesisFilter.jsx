import { Filter, RotateCcw } from "lucide-react";

const TesisFilter = ({ selectedType, handleTypeChange, selectedYear, handleYearChange, years, onlyWithPdf, setOnlyWithPdf, onReset }) => (
  <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold text-gray-900"><Filter className="h-4 w-4 text-ingenieria" /> Filtros</h2><button onClick={onReset} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-ingenieria"><RotateCcw className="h-3.5 w-3.5" /> Limpiar</button></div>
    <label className="block text-sm font-medium text-gray-700">Tipo<select value={selectedType} onChange={handleTypeChange} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="all">Todos</option><option value="doctorado">Doctorado</option><option value="maestria">Maestría</option></select></label>
    <label className="mt-4 block text-sm font-medium text-gray-700">Año<select value={selectedYear} onChange={handleYearChange} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-ingenieria"><option value="">Todos los años</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
    <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={onlyWithPdf} onChange={(event) => setOnlyWithPdf(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-ingenieria focus:ring-ingenieria" /> Solo con PDF disponible</label>
  </div>
);

export default TesisFilter;
