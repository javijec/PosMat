import React from "react";

const TesisFilter = ({
  selectedType,
  handleTypeChange,
  selectedYear,
  handleYearChange,
  years,
}) => (
  <div className="sticky top-24 space-y-6">
    <div>
      <label className="block mb-2 text-lg font-medium text-gray-900">
        Filtrar por tipo:
      </label>
      <select
        value={selectedType}
        onChange={handleTypeChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="all">Todos</option>
        <option value="doctorado">Doctorado</option>
        <option value="maestria">Maestría</option>
      </select>
    </div>
    <div>
      <label className="block mb-2 text-lg font-medium text-gray-900">
        Filtrar por año:
      </label>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Todos los años</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default TesisFilter;
