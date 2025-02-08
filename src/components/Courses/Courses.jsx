import React, { useMemo, useState } from "react";
import CourseCard from "./CourseCard";
import AdditionalInfo from "./AdditionalInfo";
import courses from "../../files/courses.json";

const Courses = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const { years, semesters, groupedCourses } = useMemo(() => {
    const grouped = courses.reduce((acc, course) => {
      const key = `${course.año}-${course.semestre}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(course);
      return acc;
    }, {});

    const years = [...new Set(courses.map((c) => c.año))].sort((a, b) => b - a);
    const semesters = [...new Set(courses.map((c) => c.semestre))].sort();

    return { years, semesters, groupedCourses: grouped };
  }, []);

  const filteredCourses = useMemo(() => {
    const key = `${selectedYear}-${selectedSemester}`;
    return groupedCourses[key] || [];
  }, [selectedYear, selectedSemester, groupedCourses]);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Cursos de Posgrado</h1>

        {/* Filtros */}
        <div className="mb-12 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <select
              className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-ingenieria focus:border-ingenieria"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Seleccionar año</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Semestre</label>
            <select
              className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-ingenieria focus:border-ingenieria"
              value={selectedSemester || ""}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Seleccionar semestre</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{`${semester}° Semestre`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensaje de selección */}
        {!selectedYear && !selectedSemester && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">Selecciona un año y semestre para ver los cursos disponibles</p>
          </div>
        )}

        {/* Grid de cursos */}
        {selectedYear && selectedSemester && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={index} course={course} index={index} />
            ))}
          </div>
        )}

        {/*<AdditionalInfo />*/}
      </div>
    </div>
  );
};

export default Courses;
