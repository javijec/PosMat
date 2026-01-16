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
import { ListSkeleton } from "../shared/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { exportToCSV } from "../../utils/csvExport";

const TesisEdit = () => {
  const collectionName = "tesis";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    title: "",
    year: "",
    tag: "",
  });

  const { data: tesis = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];
      return result;
    },
  });

  const { filters, updateFilter, filteredData } = useFilters(
    tesis,
    { name: "", title: "", tag: "", year: "" },
    (item, f) => {
      const matchName =
        !f.name || item.name?.toLowerCase().includes(f.name.toLowerCase());
      const matchTitle =
        !f.title || item.title?.toLowerCase().includes(f.title.toLowerCase());
      const matchTag =
        !f.tag || item.tag?.toLowerCase().includes(f.tag.toLowerCase());
      const matchYear = !f.year || item.year?.toString().includes(f.year);
      return matchName && matchTitle && matchTag && matchYear;
    }
  );

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

  const handleEdit = (item) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(item.id);
    setDefaultValues(item);
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
    setDefaultValues({ name: "", title: "", year: "", tag: "" });
  };

  return (
    <EditPageContainer title="Panel de Tesis">
      <TesisForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--border-subtle)]">
        <div className="flex justify-between items-center mb-6 border-b border-[var(--border-subtle)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">
            Tesis Registradas
          </h2>
          <button
            onClick={() => exportToCSV(tesis, "tesis")}
            className="inline-flex items-center px-4 py-2 bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] hover:bg-[var(--color-ingenieria)] hover:text-white rounded-lg transition-all text-sm font-semibold border border-[var(--color-ingenieria)]/20 shadow-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exportar CSV
          </button>
        </div>

        <FilterGrid>
          <SearchBar
            value={filters.name}
            onChange={(v) => updateFilter("name", v)}
            placeholder="Buscar por tesista..."
          />
          <SearchBar
            value={filters.title}
            onChange={(v) => updateFilter("title", v)}
            placeholder="Buscar por título..."
          />
          <SearchBar
            value={filters.tag}
            onChange={(v) => updateFilter("tag", v)}
            placeholder="Buscar por tag/área..."
          />
          <SearchBar
            value={filters.year}
            onChange={(v) => updateFilter("year", v)}
            placeholder="Buscar por año..."
          />
        </FilterGrid>

        {isLoading ? (
          <ListSkeleton items={5} />
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon={faFileAlt}
            title="No se encontraron tesis"
            description="Intenta ajustar los filtros de búsqueda"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-surface)] text-[var(--text-main)]/60 text-sm uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Tesista</th>
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Año / Tag
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-[var(--text-main)]">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 text-[var(--text-main)]/60 text-sm max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] mr-2">
                        {item.year}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-surface)] text-[var(--text-main)]/50 uppercase tracking-tighter border border-[var(--border-subtle)]">
                        {item.tag}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria-hover)] font-medium text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
