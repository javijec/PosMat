import React from "react";

const CourseFilter = ({ years, semesters, selectedYear, setSelectedYear, selectedSemester, setSelectedSemester }) => {
  if (!years || years.length === 0) return <div>Loading...</div>;

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
        {years.filter((year) => Number.isFinite(year)).map((year) => (
          <option key={year} value={String(year)}>
            {String(year)}
          </option>
        ))}
      </select>

      {/* Filtro por semestre */}
      <select
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-4"
      >
        <option value="">Seleccionar semestre</option>
        {semesters.filter((semester) => Number.isFinite(semester)).map((semester) => (
          <option key={semester} value={String(semester)}>
            {semester}° Semestre
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseFilter;
