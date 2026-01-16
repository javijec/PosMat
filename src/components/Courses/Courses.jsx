import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import CourseFilter from "./CourseFilter";
import CoursesDisplay from "./CoursesDisplay";
import { fetchData } from "../../firebase/CRUD";

const Courses = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const collectionName = "courses";

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];

      return result
        .map((doc) => ({
          id: doc.id,
          ...doc,
          año: Number(doc.año),
          semestre: Number(doc.semestre),
        }))
        .sort((a, b) => {
          if (b.año !== a.año) return b.año - a.año;
          return a.semestre - b.semestre;
        });
    },
  });

  const { years, semesters } = useMemo(() => {
    const years = [
      ...new Set(
        data
          .map((c) => c.año)
          .filter((year) => year !== undefined && year !== null)
      ),
    ].sort((a, b) => b - a);
    const semesters = [1, 2];
    return { years, semesters };
  }, [data]);

  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years]);

  const filteredCourses = useMemo(() => {
    let filtered = [...data];

    if (selectedYear) {
      filtered = filtered.filter(
        (course) => course.año === Number(selectedYear)
      );
    }

    if (selectedSemester) {
      filtered = filtered.filter(
        (course) => course.semestre === Number(selectedSemester)
      );
    }

    return filtered;
  }, [selectedYear, selectedSemester, data]);

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
    <div className="py-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Helmet>
        <title>Cursos | PosMat</title>
        <meta
          name="description"
          content="Listado de cursos de posgrado en matemática."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-12 text-gray-900">
          Cursos de Posgrado
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">
            Error al cargar los cursos. Por favor, intente de nuevo.
          </div>
        ) : (
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
              <CoursesDisplay groupedCourses={groupedBySemester} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
