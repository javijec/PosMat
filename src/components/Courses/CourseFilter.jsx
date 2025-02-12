import React from "react";

const CourseFilter = ({ years, semesters, selectedYear, setSelectedYear, selectedSemester, setSelectedSemester }) => {
  return (
    <div className="sticky top-24 space-y-6">
      <div>
        <label className="block mb-2 text-lg font-medium text-gray-900">Filtrar por año:</label>
        <select
          className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-ingenieria focus:border-ingenieria"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Todos los años</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-lg font-medium text-gray-900">Filtrar por semestre:</label>
        <select
          className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-ingenieria focus:border-ingenieria"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">Todos los semestres</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>{`${semester}° Semestre`}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseFilter;
