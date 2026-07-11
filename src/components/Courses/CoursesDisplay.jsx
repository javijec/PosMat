import React from "react";
import CourseCard from "./CourseCard";

const CoursesDisplay = ({ groupedCourses }) => {
  return (
    <div className="space-y-8">
      {Object.keys(groupedCourses)
        .sort((a, b) => b.split("-")[0] - a.split("-")[0])
        .map((yearSemester) => {
          const [year, semester] = yearSemester.split("-");
          const semesterCourses = groupedCourses[yearSemester];
          return (
            <div key={yearSemester} className="mb-10">
              <div className="mb-5 flex items-baseline justify-between border-b border-gray-200 pb-3">
                <h2 className="text-2xl font-bold text-gray-900">{year} · {semester}.º semestre</h2>
                <span className="text-sm text-gray-500">{semesterCourses.length} {semesterCourses.length === 1 ? "curso" : "cursos"}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {semesterCourses.map((course, index) => (
                  <CourseCard key={course.id || index} course={course} index={index} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CoursesDisplay;
