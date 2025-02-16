import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { db } from "../../firebase/dbConnection"; // Importa la configuración de Firestore
import { collection, getDocs } from "firebase/firestore";
import TesisCard from "./TesisCard";
import TesisFilter from "../Filter/TesisFilter";
import TesisStatsChart from "../Chart/TesisStatsChart";

const Tesis = () => {
  const [tesis, setTesis] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [filteredTesis, setFilteredTesis] = useState([]);
  const [showStats, setShowStats] = useState(false);

  // Obtener datos de Firestore
  useEffect(() => {
    const getTesis = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tesis"));
        const tesisData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTesis(tesisData);
      } catch (error) {
        console.error("Error fetching tesis:", error);
      }
    };
    getTesis();
  }, []);

  // Filtrar datos según el tipo y los años seleccionados
  useEffect(() => {
    let allTesis = [...tesis];
    if (selectedType !== "all") {
      allTesis = allTesis.filter((t) => t.tag === selectedType);
    }
    if (selectedYears.length > 0) {
      allTesis = allTesis.filter((t) => selectedYears.includes(t.year));
    }
    setFilteredTesis(allTesis);
  }, [tesis, selectedYears, selectedType]);

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Obtener años únicos de Firestore
  const years = [...new Set(tesis.map((t) => t.year))].sort((a, b) => b - a);

  // Generar datos para el gráfico
  const chartData = years.map((year) => ({
    year,
    doctorado: tesis.filter((t) => t.year === year && t.tag === "doctorado").length,
    maestria: tesis.filter((t) => t.year === year && t.tag === "maestria").length,
  }));

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Tesis</h1>
        <div className="mb-6">
          <button
            onClick={() => setShowStats(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Estadísticas
          </button>
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <TesisFilter
              selectedType={selectedType}
              handleTypeChange={handleTypeChange}
              selectedYears={selectedYears}
              handleYearChange={handleYearChange}
              years={years}
            />
          </div>
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <ul className="space-y-4">
              {filteredTesis.map((tesisItem) => (
                <TesisCard key={tesisItem.id} tesis={tesisItem} />
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
