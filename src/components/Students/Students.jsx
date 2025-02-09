import React, { useState, useMemo } from "react";
import studentsData from "../../files/students.json";
import StudentCard from "./StudentCard";

const Students = () => {
  const [filterLastName, setFilterLastName] = useState("");
  const [filterFirstName, setFilterFirstName] = useState("");

  const filteredStudents = useMemo(() => {
    let filtered = studentsData.students;

    if (filterLastName) {
      filtered = filtered.filter((student) => student.lastName.toUpperCase().startsWith(filterLastName.toUpperCase()));
    }

    if (filterFirstName) {
      filtered = filtered.filter((student) => student.firstName.toLowerCase().includes(filterFirstName.toLowerCase()));
    }

    return filtered;
  }, [filterLastName, filterFirstName]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Estudiantes de Posgrado</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filterLastName">
            Filtrar por apellido:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="filterLastName"
            type="text"
            placeholder="Ingrese el apellido"
            value={filterLastName}
            onChange={(e) => setFilterLastName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filterFirstName">
            Filtrar por nombre:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="filterFirstName"
            type="text"
            placeholder="Ingrese el nombre"
            value={filterFirstName}
            onChange={(e) => setFilterFirstName(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => (
          <StudentCard key={index} student={{ ...student, name: `${student.lastName}, ${student.firstName}` }} />
        ))}
      </div>
    </div>
  );
};

export default Students;
