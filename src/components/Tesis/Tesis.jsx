import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import tesisDoc from "../../files/tesisDoc.json";
import tesisMaestria from "../../files/tesisMaestria.json";
import TesisCard from "./TesisCard";
import TesisFilter from "../Filter/TesisFilter";
import TesisStatsChart from "../Chart/TesisStatsChart";

const Tesis = () => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [filteredTesis, setFilteredTesis] = useState([]);
  const [showStats, setShowStats] = useState(false);

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

  // Lista única de años para el filtro y para el gráfico
  const years = [...new Set([...tesisDoc, ...tesisMaestria].map((t) => t.year))].sort((a, b) => b - a);

  // Preparar datos para el gráfico: eje X: año, eje Y: conteo de tesis por tipo
  const chartData = [...new Set([...tesisDoc, ...tesisMaestria].map((t) => t.year))]
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      doctorado: tesisDoc.filter((t) => t.year === year).length,
      maestria: tesisMaestria.filter((t) => t.year === year).length,
    }));

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Tesis</h1>
        {/* Botón para mostrar estadísticas */}
        <div className="mb-6">
          <button
            onClick={() => setShowStats(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Estadísticas
          </button>
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar: Filtro mediante componente */}
          <div className="lg:col-span-1">
            <TesisFilter
              selectedType={selectedType}
              handleTypeChange={handleTypeChange}
              selectedYears={selectedYears}
              handleYearChange={handleYearChange}
              years={years}
            />
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

      {/* Diálogo de estadísticas */}
      <Transition appear show={showStats} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowStats(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900 mb-4">
                    Estadísticas de Tesis
                  </Dialog.Title>
                  <div className="h-64">
                    <TesisStatsChart data={chartData} />
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setShowStats(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300"
                    >
                      Cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Tesis;
