import React, { useState, useEffect, useMemo } from "react";
import CourseCard from "./CourseCard";
import CourseFilter from "./CourseFilter";
import { fetchData } from "../../firebase/CRUD";

const Courses = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const collection = "courses";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const Data = await fetchData(collection);

      if (!Data || !Array.isArray(Data)) {
        console.error("Error: Data no es un array válido");
        setData([]);
        return;
      }

      const coursesData = Data.map((doc) => ({
        id: doc.id,
        ...doc,
        año: Number(doc.año),
        semestre: Number(doc.semestre),
      }));

      coursesData.sort((a, b) => {
        if (b.año !== a.año) {
          return b.año - a.año;
        }
        return a.semestre - b.semestre;
      });

      setData(coursesData);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setData([]);
    }
  };

  const { years, semesters } = useMemo(() => {
    const years = [...new Set(data.map((c) => c.año).filter((year) => year !== undefined && year !== null))].sort(
      (a, b) => b - a
    );
    const semesters = [1, 2];
    return { years, semesters };
  }, [data]);

  // Establecer el año seleccionado después de que los datos se carguen
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years]);

  // Filtrar cursos según los filtros seleccionados
  const filteredCourses = useMemo(() => {
    let filtered = [...data];

    if (selectedYear) {
      filtered = filtered.filter((course) => course.año === Number(selectedYear));
    }

    if (selectedSemester) {
      filtered = filtered.filter((course) => course.semestre === Number(selectedSemester));
    }

    return filtered;
  }, [selectedYear, selectedSemester, data]);

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

          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="space-y-8">
              {Object.keys(groupedBySemester)
                .sort((a, b) => b.split("-")[0] - a.split("-")[0]) // Ordenar por año
                .map((yearSemester) => {
                  const [year, semester] = yearSemester.split("-");
                  const semesterCourses = groupedBySemester[yearSemester];

                  return (
                    <div key={yearSemester} className="mb-6">
                      <h2 className="text-3xl font-semibold mb-4">{year}</h2>
                      <h3 className="text-xl font-semibold mb-2">{semester}° Semestre</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {semesterCourses.map((course, index) => (
                          <CourseCard key={index} course={course} index={index} />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
