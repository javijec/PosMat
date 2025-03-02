import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";
import { fetchData } from "../../firebase/CRUD";

const Students = () => {
  const [data, setData] = useState([]);
  const [searchFullName, setSearchFullName] = useState("");
  const [searchProgram, setSearchProgram] = useState("");
  const [searchThesis, setSearchThesis] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const collection = "students";

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [data, searchFullName, searchProgram, searchThesis]);

  const fetchStudents = async () => {
    const Data = await fetchData(collection);
    const sortedData = Data.sort((a, b) =>
      (a.lastName || "").localeCompare(b.lastName || "")
    );
    setData(sortedData);
  };

  const handleSearch = () => {
    let filtered = data;

    if (searchFullName) {
      filtered = filtered.filter((student) =>
        (student.firstName + " " + student.lastName)
          .toLowerCase()
          .includes(searchFullName.toLowerCase())
      );
    }
    if (searchProgram) {
      filtered = filtered.filter(
        (student) => student.program === searchProgram
      );
    }
    if (searchThesis) {
      filtered = filtered.filter((student) =>
        student.thesis_topic.toLowerCase().includes(searchThesis.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Estudiantes de Posgrado</h2>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              value={searchFullName}
              onChange={(e) => setSearchFullName(e.target.value)}
              placeholder="Buscar por nombre o apellido..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Programa
            </label>
            <select
              value={searchProgram}
              onChange={(e) => setSearchProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="doctorado">Doctorado</option>
              <option value="maestria">Maestría</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tema de Tesis
            </label>
            <input
              type="text"
              value={searchThesis}
              onChange={(e) => setSearchThesis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((student, index) => (
          <StudentCard
            key={index}
            student={{
              ...student,
              name: `${student.lastName}, ${student.firstName}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Students;
