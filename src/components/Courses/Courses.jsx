import React, { useMemo } from "react";
import CourseCard from "./CourseCard";
import AdditionalInfo from "./AdditionalInfo";
import courses from "../../files/courses.json";

const Courses = () => {
  // Agrupar cursos por año y semestre
  const groupedCourses = useMemo(() => {
    return courses.reduce((acc, course) => {
      const year = course.año;
      const semester = course.semestre;

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][semester]) {
        acc[year][semester] = [];
      }

      acc[year][semester].push(course);
      return acc;
    }, {});
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Cursos de Posgrado</h1>

        {Object.keys(groupedCourses)
          .sort((a, b) => b - a) // Ordenar años descendente
          .map((year) => (
            <div key={year} className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Año {year}</h2>

              {Object.keys(groupedCourses[year])
                .sort() // Ordenar semestres
                .map((semester) => (
                  <div key={`${year}-${semester}`} className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">{`${semester}° Semestre`}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {groupedCourses[year][semester].map((course, index) => (
                        <CourseCard key={index} course={course} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}

        {/*<AdditionalInfo />*/}
      </div>
    </div>
  );
};

export default Courses;
