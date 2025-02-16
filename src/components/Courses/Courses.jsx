import React, { useState, useEffect, useMemo } from "react";
import CourseCard from "./CourseCard";
import CourseFilter from "./CourseFilter";
import { db } from "../../firebase/dbConnection";
import { collection, getDocs } from "firebase/firestore";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await getDocs(collection(db, "courses"));
        const coursesData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Ordenar por año, luego por semestre (semestre 1 primero)
        coursesData.sort((a, b) => {
          // Ordenar por año (descendente)
          if (a.year !== b.year) {
            return b.year - a.year; // Mayor a menor
          }

          // Ordenar por semestre (1 antes que 2)
          return a.semester - b.semester;
        });

        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    getCourses();
  }, []);

  const { years, semesters } = useMemo(() => {
    const years = [...new Set(courses.map((c) => c.año).filter((year) => year !== undefined && year !== null))].sort(
      (a, b) => b - a
    );
    const semesters = [1, 2];
    return { years, semesters };
  }, [courses]);

  // Estado de los filtros
  const [selectedYear, setSelectedYear] = useState(years[0] || "");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Filtrar cursos según los filtros seleccionados
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    if (selectedYear) {
      filtered = filtered.filter((course) => course.año === selectedYear);
    }

    if (selectedSemester) {
      filtered = filtered.filter((course) => course.semestre === selectedSemester);
    }

    return filtered;
  }, [selectedYear, selectedSemester, courses]);

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

  // Agrupar cursos por año
  const groupedByYear = useMemo(() => {
    const group = {};
    courses.forEach((course) => {
      if (!group[course.año]) {
        group[course.año] = [];
      }
      group[course.año].push(course);
    });
    return group;
  }, [courses]);

  // Agrupar cursos por semestre dentro del año
  const groupedBySemester = useMemo(() => {
    const group = {};
    filteredCourses.forEach((course) => {
      const yearSemester = `${course.año}-${course.semestre}`;
      if (!group[yearSemester]) {
        group[yearSemester] = [];
      }
      group[yearSemester].push(course);
    });
    return group;
  }, [filteredCourses]);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Cursos de Posgrado</h1>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar con filtros */}
          <div className="lg:col-span-1">
            <CourseFilter
              years={years}
              semesters={semesters}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
            />
          </div>

          {/* Lista de cursos */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="space-y-8">
              {Object.keys(groupedByYear)
                .sort((a, b) => b - a)
                .map((year) => (
                  <div key={year} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <h2 className="text-3xl font-semibold mb-4">{year}</h2>

                    {/* Recuadro de semestres dentro del año */}
                    {Object.keys(groupedBySemester)
                      .filter((key) => key.startsWith(year)) // Filtramos por año
                      .map((yearSemester) => {
                        const [year, semester] = yearSemester.split("-");
                        const semesterCourses = groupedBySemester[yearSemester];

                        return (
                          <div key={yearSemester} className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">{semester}° Semestre</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {semesterCourses.map((course, index) => (
                                <div key={index} className="relative">
                                  <CourseCard course={course} index={index} />
                                  <span className={getSemesterTag(course.semestre)}>{course.semestre}° Semestre</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
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
