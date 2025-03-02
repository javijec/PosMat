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
            <div key={yearSemester} className="mb-6">
              <h2 className="text-3xl font-semibold mb-4">{year}</h2>
              <h3 className="text-xl font-semibold mb-2">
                {semester}° Semestre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {semesterCourses.map((course, index) => (
                  <CourseCard key={index} course={course} index={index} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CoursesDisplay;
