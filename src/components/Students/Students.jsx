import React, { useState, useMemo, useEffect } from "react";
import StudentCard from "./StudentCard";
import NameFilter from "../Filter/NameFilter";
import { getStudents } from "../../firebase/CRUD";

const Students = () => {
  const [filterLastName, setFilterLastName] = useState("");
  const [filterFirstName, setFilterFirstName] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsData = await getStudents();
      setStudents(studentsData);
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    let filtered = students;
    if (filterLastName) {
      filtered = filtered.filter((student) =>
        (student.lastName || "").toUpperCase().startsWith(filterLastName.toUpperCase())
      );
    }
    if (filterFirstName) {
      filtered = filtered.filter((student) =>
        (student.firstName || "").toLowerCase().includes(filterFirstName.toLowerCase())
      );
    }
    return filtered;
  }, [filterLastName, filterFirstName, students]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Estudiantes de Posgrado</h2>
      {/* Filtro compartido */}
      <NameFilter
        filterLastName={filterLastName}
        setFilterLastName={setFilterLastName}
        filterFirstName={filterFirstName}
        setFilterFirstName={setFilterFirstName}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => (
          <StudentCard key={index} student={{ ...student, name: `${student.lastName}, ${student.firstName}` }} />
        ))}
      </div>
    </div>
  );
};

export default Students;
