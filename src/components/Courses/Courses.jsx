import React, { useMemo, useState } from "react";
import CourseCard from "./CourseCard";
import AdditionalInfo from "./AdditionalInfo";
import courses from "../../files/courses.json";

const Courses = () => {
  const { years, semesters } = useMemo(() => {
    const years = [...new Set(courses.map((c) => c.año))].sort((a, b) => b - a);
    const semesters = [...new Set(courses.map((c) => c.semestre))].sort();
    return { years, semesters };
  }, []);

  // Inicializar con el año más reciente
  const [selectedYear, setSelectedYear] = useState(years[0] || "");
  const [selectedSemester, setSelectedSemester] = useState("");

  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    if (selectedYear) {
      filtered = filtered.filter((course) => course.año === selectedYear);
    }

    if (selectedSemester) {
      filtered = filtered.filter((course) => course.semestre === selectedSemester);
    }

    return filtered;
  }, [selectedYear, selectedSemester]);

  const getSemesterTag = (semester) => {
    const num = Number(semester);
    if (num === 1) {
      return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium ml-2";
    } else if (num === 2) {
      return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium ml-2";
    } else {
      return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium ml-2";
    }
  };

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Cursos de Posgrado</h1>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filtros sidebar */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Grid de cursos */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCourses.map((course, index) => (
                <div key={index} className="relative">
                  <CourseCard course={course} index={index} />
                  <span className={getSemesterTag(course.semestre)}>{course.semestre}° Semestre</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
