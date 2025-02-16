import React from "react";

const CourseFilter = ({ years, semesters, selectedYear, setSelectedYear, selectedSemester, setSelectedSemester }) => {
  if (!years || years.length === 0) return <div>Loading...</div>; // O algún mensaje de carga o estado vacío

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>

      {/* Filtro por año */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Seleccionar año</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Filtro por semestre */}
      <select
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Seleccionar semestre</option>
        {semesters.map((semester) => (
          <option key={semester} value={semester}>
            {semester}° Semestre
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseFilter;
