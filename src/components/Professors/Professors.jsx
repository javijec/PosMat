import React, { useState, useMemo, useEffect } from "react";
import ProfessorCard from "./ProfessorCard";
import NameFilter from "../Filter/NameFilter";
import { fetchData } from "../../firebase/CRUD";

const Professors = () => {
  const [filterLastName, setFilterLastName] = useState("");
  const [filterFirstName, setFilterFirstName] = useState("");
  const [data, setData] = useState([]);
  const collection = "professors";
  const x = "profesor";

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    const Data = await fetchData(collection);

    const sortedData = Data.sort((a, b) => (a.lastName || "").localeCompare(b.lastName || ""));

    setData(sortedData);
  };

  const filteredProfessors = useMemo(() => {
    let filtered = data;
    if (filterLastName) {
      filtered = filtered.filter((prof) => prof.lastName.toUpperCase().startsWith(filterLastName.toUpperCase()));
    }
    if (filterFirstName) {
      filtered = filtered.filter((prof) => prof.firstName.toLowerCase().includes(filterFirstName.toLowerCase()));
    }
    return filtered;
  }, [filterLastName, filterFirstName, data]);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16 text-gray-900">Lista de Profesores</h1>
        {/* Filtro compartido */}
        <NameFilter
          filterLastName={filterLastName}
          setFilterLastName={setFilterLastName}
          filterFirstName={filterFirstName}
          setFilterFirstName={setFilterFirstName}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessors.map((prof, index) => (
            <ProfessorCard key={index} professor={prof} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Professors;
