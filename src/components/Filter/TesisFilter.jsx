import React from "react";

const TesisFilter = ({ selectedType, handleTypeChange, selectedYears, handleYearChange, years }) => (
  <div className="sticky top-24 space-y-6">
    <div>
      <label className="block mb-2 text-lg font-medium text-gray-900">Filtrar por tipo:</label>
      <select
        value={selectedType}
        onChange={handleTypeChange}
        className="w-full form-select border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Todos</option>
        <option value="doctorado">Doctorado</option>
        <option value="maestria">Maestría</option>
      </select>
    </div>
    <div>
      <label className="block mb-2 text-lg font-medium text-gray-900">Filtrar por año:</label>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {years.map((year) => (
          <label key={year} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={year}
              onChange={handleYearChange}
              checked={selectedYears.includes(year)}
              className="form-checkbox text-blue-600"
            />
            <span>{year}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default TesisFilter;
