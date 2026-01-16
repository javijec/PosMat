import React, { useState, useMemo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TesisCard from "./TesisCard";
import TesisFilter from "../Filter/TesisFilter";
import TesisStatsChart from "../Chart/TesisStatsChart";
import { fetchData } from "../../firebase/CRUD";

const Tesis = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showStats, setShowStats] = useState(false);
  const collectionName = "tesis";

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];

      return result
        .map((doc) => ({
          id: doc.id,
          ...doc,
          year: Number(doc.year),
        }))
        .sort((a, b) => b.year - a.year);
    },
  });

  const filteredTesis = useMemo(() => {
    let filtered = [...data];
    if (selectedType !== "all") {
      filtered = filtered.filter((tesis) => tesis.tag === selectedType);
    }
    if (selectedYear) {
      filtered = filtered.filter(
        (tesis) => tesis.year === Number(selectedYear)
      );
    }
    return filtered;
  }, [data, selectedYear, selectedType]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const years = useMemo(
    () => [...new Set(data.map((t) => t.year))].sort((a, b) => b - a),
    [data]
  );

  const chartData = useMemo(
    () =>
      years.map((year) => ({
        year,
        doctorado: data.filter((t) => t.year === year && t.tag === "doctorado")
          .length,
        maestria: data.filter((t) => t.year === year && t.tag === "maestria")
          .length,
      })),
    [years, data]
  );

  return (
    <div className="py-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Helmet>
        <title>Tesis | PosMat</title>
        <meta
          name="description"
          content="Tesis presentadas en el Posgrado en Matemática."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-12 text-gray-900">
          Tesis
        </h1>
        <div className="mb-6">
          <button
            onClick={() => setShowStats(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            Estadísticas
          </button>
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <TesisFilter
              selectedType={selectedType}
              handleTypeChange={handleTypeChange}
              selectedYear={selectedYear}
              handleYearChange={handleYearChange}
              years={years}
            />
          </div>
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                    <Skeleton height={24} width="60%" />
                    <Skeleton height={16} width="40%" className="mt-2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">
                Error al cargar las tesis.
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredTesis.map((tesisItem) => (
                  <TesisCard key={tesisItem.id} tesis={tesisItem} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Transition appear show={showStats} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowStats(false)}
        >
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
