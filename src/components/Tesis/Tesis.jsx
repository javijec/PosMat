import React, { useState, useMemo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { AlertCircle, BarChart3, Search, X } from "lucide-react";
import TesisCard from "./TesisCard";
import TesisFilter from "../Filter/TesisFilter";
import TesisStatsChart from "../Chart/TesisStatsChart";
import EmptyState from "../shared/EmptyState";
import LoadingState from "../shared/LoadingState";
import PageHeader from "../shared/PageHeader";
import { fetchData } from "../../data";

const Tesis = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyWithPdf, setOnlyWithPdf] = useState(false);
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
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      filtered = filtered.filter((tesis) => `${tesis.title || ""} ${tesis.name || ""} ${tesis.director || ""}`.toLowerCase().includes(normalizedQuery));
    }
    if (onlyWithPdf) filtered = filtered.filter((tesis) => tesis.url);
    return filtered;
  }, [data, onlyWithPdf, query, selectedYear, selectedType]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const resetFilters = () => {
    setSelectedYear("");
    setSelectedType("all");
    setQuery("");
    setOnlyWithPdf(false);
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

  const thesisTotals = useMemo(
    () => ({
      doctorado: data.filter((thesis) => thesis.tag === "doctorado").length,
      maestria: data.filter((thesis) => thesis.tag === "maestria").length,
    }),
    [data]
  );

  return (
    <div className="py-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Helmet>
        <title>Tesis | PosMat</title>
        <meta
          name="description"
          content="Tesis presentadas en el Posgrado en Ciencia de Materiales."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4">
        <PageHeader eyebrow="Posgrado" title="Repositorio de tesis" description="Tesis de Doctorado y Maestría del Posgrado en Ciencia de Materiales." />
        <div className="mb-6">
          <button
            onClick={() => setShowStats(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-ingenieria px-4 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
            disabled={isLoading}
          >
            <BarChart3 className="h-4 w-4" /> Estadísticas
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
              onlyWithPdf={onlyWithPdf}
              setOnlyWithPdf={setOnlyWithPdf}
              onReset={resetFilters}
            />
          </div>
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar título, autor o director/a" className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-9 outline-none focus:border-ingenieria focus:ring-2 focus:ring-ingenieria/20" aria-label="Buscar tesis" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Limpiar búsqueda"><X className="h-4 w-4" /></button>}</div>
              <p className="shrink-0 text-sm text-gray-500">{filteredTesis.length} tesis</p>
            </div>
            {isLoading ? (
              <LoadingState label="Cargando tesis…" />
            ) : error ? (
              <EmptyState icon={AlertCircle} title="No se pudieron cargar las tesis" description="Revisá la conexión e intentá nuevamente." variant="error" />
            ) : filteredTesis.length ? (
              <ul className="space-y-4">
                {filteredTesis.map((tesisItem) => (
                  <TesisCard key={tesisItem.id} tesis={tesisItem} />
                ))}
              </ul>
            ) : (
              <EmptyState icon={Search} title="No hay tesis para estos filtros" description="Probá otro año, tipo o término de búsqueda." actionLabel="Limpiar filtros" onAction={resetFilters} />
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
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Doctorado</p><p className="mt-1 text-2xl font-bold text-blue-950">{thesisTotals.doctorado}</p></div>
                    <div className="rounded-lg border border-teal-100 bg-teal-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Maestría</p><p className="mt-1 text-2xl font-bold text-teal-950">{thesisTotals.maestria}</p></div>
                  </div>
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
