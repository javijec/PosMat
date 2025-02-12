import React, { useState, useEffect } from "react";
import tesisDoc from "../../files/tesisDoc.json";
import tesisMaestria from "../../files/tesisMaestria.json";
import TesisCard from "./TesisCard";

const Tesis = () => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [filteredTesis, setFilteredTesis] = useState([]);

  useEffect(() => {
    let allTesis = [];
    if (selectedType === "all" || selectedType === "doctorado") {
      allTesis = allTesis.concat(tesisDoc);
    }
    if (selectedType === "all" || selectedType === "maestria") {
      allTesis = allTesis.concat(tesisMaestria);
    }
    if (selectedYears.length > 0) {
      allTesis = allTesis.filter((tesis) => selectedYears.includes(tesis.year));
    }
    setFilteredTesis(allTesis);
  }, [selectedYears, selectedType]);

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    setSelectedYears((prevYears) =>
      prevYears.includes(year) ? prevYears.filter((y) => y !== year) : [...prevYears, year]
    );
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Tesis</h1>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <label className="block mb-2 text-lg font-medium text-gray-900">Filtrar por tipo:</label>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="w-full form-select border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="doctorado">Doctorado</option>
                  <option value="maestria">Maestría</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-lg font-medium text-gray-900">Filtrar por año:</label>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {[...new Set([...tesisDoc, ...tesisMaestria].map((t) => t.year))]
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <label key={year} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={year}
                          onChange={handleYearChange}
                          className="form-checkbox text-blue-600"
                        />
                        <span>{year}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <ul className="space-y-4">
              {filteredTesis.map((tesis, index) => (
                <TesisCard key={index} tesis={tesis} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tesis;
