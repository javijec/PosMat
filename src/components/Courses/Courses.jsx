import React, { useMemo } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import CourseCard from "./CourseCard";
import AdditionalInfo from "./AdditionalInfo";
import courses from "../../files/courses.json";

const Courses = () => {
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
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16 text-gray-900">Cursos de Posgrado</h1>

        <div className="space-y-6">
          {Object.keys(groupedCourses)
            .sort((a, b) => b - a)
            .map((year) => (
              <Disclosure
                key={year}
                defaultOpen={year === Math.max(...Object.keys(groupedCourses).map(Number)).toString()}
              >
                {({ open }) => (
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <Disclosure.Button className="w-full flex justify-between items-center px-8 py-6 bg-gradient-to-r from-[#447c82] to-[#386a72] text-white hover:from-[#386a72] hover:to-[#2d565c] transition-all duration-300">
                      <h2 className="text-2xl font-bold">Año {year}</h2>
                      <ChevronUpIcon
                        className={`${open ? "transform rotate-180" : ""} w-6 h-6 transition-transform duration-300`}
                      />
                    </Disclosure.Button>

                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="p-6">
                        <div className="space-y-6">
                          {Object.keys(groupedCourses[year])
                            .sort()
                            .map((semester) => (
                              <Disclosure key={`${year}-${semester}`}>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none">
                                      <h3 className="text-xl font-semibold text-gray-700">{`${semester}° Semestre`}</h3>
                                      <ChevronUpIcon
                                        className={`${
                                          open ? "transform rotate-180" : ""
                                        } w-5 h-5 transition-transform duration-200`}
                                      />
                                    </Disclosure.Button>

                                    <Transition
                                      enter="transition duration-100 ease-out"
                                      enterFrom="transform scale-95 opacity-0"
                                      enterTo="transform scale-100 opacity-100"
                                      leave="transition duration-75 ease-out"
                                      leaveFrom="transform scale-100 opacity-100"
                                      leaveTo="transform scale-95 opacity-0"
                                    >
                                      <Disclosure.Panel className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {groupedCourses[year][semester].map((course, index) => (
                                          <CourseCard key={index} course={course} />
                                        ))}
                                      </Disclosure.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Disclosure>
                            ))}
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
        </div>

        <AdditionalInfo />
      </div>
    </div>
  );
};

export default Courses;
