import React, { useState, useEffect } from "react";
import ProfessorCard from "./ProfessorCard";
import { fetchData } from "../../firebase/CRUD";

const Professors = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const collection = "professors";

  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [data, searchName]);

  const fetchProfessors = async () => {
    const Data = await fetchData(collection);
    const sortedData = Data.sort((a, b) =>
      (a.lastName || "").localeCompare(b.lastName || "")
    );
    setData(sortedData);
  };

  const handleSearch = () => {
    let filtered = data;
    if (searchName) {
      filtered = filtered.filter((prof) =>
        (prof.firstName + " " + prof.lastName)
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }
    setFilteredData(filtered);
  };

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16 text-gray-900">
          Lista de Profesores
        </h1>

        <div className="mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Buscar Profesor
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((prof, index) => (
            <ProfessorCard key={index} professor={prof} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Professors;
