import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TesisEditItem from "./TesisEditItem";
import TesisForm from "./TesisForm";
import { fetchData } from "../../firebase/CRUD";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import { useFilters } from "../../hooks/useFilters";
import EditPageContainer from "../shared/EditPageContainer";
import SearchBar from "../shared/SearchBar";
import FilterGrid from "../shared/FilterGrid";
import ConfirmModal from "../shared/ConfirmModal";
import EmptyState from "../shared/EmptyState";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

const TesisEdit = () => {
  const collectionName = "tesis";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    year: new Date().getFullYear(),
    name: "",
    title: "",
    url: "",
    director: "",
    co_director: "",
    tag: "maestria",
  });

  const { data: tesis = [], isLoading } = useQuery({
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

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "Tesis agregada con éxito",
      updateMessage: "Tesis actualizada con éxito",
      deleteMessage: "Tesis eliminada con éxito",
    });

  const { filteredData, filters, updateFilter } = useFilters(
    tesis,
    { name: "", tag: "", title: "", year: "" },
    (t, f) => {
      const matchName =
        !f.name || t.name.toLowerCase().includes(f.name.toLowerCase());
      const matchTag =
        !f.tag ||
        t.tag === f.tag ||
        (f.tag === "doctoral" && t.tag === "doctorado") ||
        (f.tag === "doctorado" && t.tag === "doctoral");
      const matchTitle =
        !f.title || t.title.toLowerCase().includes(f.title.toLowerCase());
      const matchYear = !f.year || String(t.year) === f.year;
      return matchName && matchTag && matchTitle && matchYear;
    }
  );

  const handleEdit = (t) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(t.id);
    setDefaultValues({
      ...t,
      tag: t.tag === "doctoral" ? "doctorado" : t.tag, // Normalizing
    });
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const onSubmit = (data) => {
    if (editingId === -1) {
      addMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId, data });
    }
  };

  const resetForm = () => {
    setEditingId(-1);
    setDefaultValues({
      year: new Date().getFullYear(),
      name: "",
      title: "",
      url: "",
      director: "",
      co_director: "",
      tag: "maestria",
    });
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <EditPageContainer title="Panel de Tesis">
      <TesisForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <FilterGrid title="Buscar y Filtrar Tesis">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Autor
            </label>
            <SearchBar
              value={filters.name}
              onChange={(val) => updateFilter("name", val)}
              placeholder="Autor..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programa
            </label>
            <select
              value={filters.tag}
              onChange={(e) => updateFilter("tag", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm bg-white"
            >
              <option value="">Todos</option>
              <option value="maestria">Maestría</option>
              <option value="doctorado">Doctorado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <SearchBar
              value={filters.title}
              onChange={(val) => updateFilter("title", val)}
              placeholder="Título de la tesis..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <SearchBar
              value={filters.year}
              onChange={(val) => updateFilter("year", val)}
              placeholder="Ej: 2024"
            />
          </div>
        </FilterGrid>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Repositorio de Tesis
        </h2>

        {filteredData.length === 0 ? (
          <EmptyState
            icon={faFileAlt}
            title="No se encontraron tesis"
            description="Intenta ajustando los filtros de búsqueda"
          />
        ) : (
          <div className="space-y-4">
            {filteredData.map((t) => (
              <TesisEditItem
                key={t.id}
                t={t}
                handleEdit={handleEdit}
                handleDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar Tesis"
        message="¿Estás seguro de que quieres eliminar esta tesis? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default TesisEdit;
