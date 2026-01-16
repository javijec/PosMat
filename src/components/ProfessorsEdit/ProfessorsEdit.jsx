import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../firebase/CRUD";
import ProfessorForm from "./ProfessorForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faUserGraduate,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import { useFilters } from "../../hooks/useFilters";
import EditPageContainer from "../shared/EditPageContainer";
import SearchBar from "../shared/SearchBar";
import ConfirmModal from "../shared/ConfirmModal";
import EmptyState from "../shared/EmptyState";
import { ListSkeleton } from "../shared/Skeleton";
import { exportToCSV } from "../../utils/csvExport";

const ProfessorsEdit = () => {
  const collectionName = "professors";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
  });

  const { data: professors = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];

      return result.sort((a, b) =>
        (a.lastName || "").localeCompare(b.lastName || "")
      );
    },
  });

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "Profesor agregado con éxito",
      updateMessage: "Profesor actualizado con éxito",
      deleteMessage: "Profesor eliminado con éxito",
    });

  const { filteredData, filters, updateFilter } = useFilters(
    professors,
    { name: "" },
    (prof, f) => {
      if (!f.name) return true;
      const term = f.name.toLowerCase();
      return (
        prof.firstName.toLowerCase().includes(term) ||
        prof.lastName.toLowerCase().includes(term) ||
        (prof.email && prof.email.toLowerCase().includes(term))
      );
    }
  );

  const handleEdit = (prof) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(prof.id);
    setDefaultValues(prof);
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
    setDefaultValues({ firstName: "", lastName: "", email: "", title: "" });
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <EditPageContainer title="Gestión de Profesores">
      <ProfessorForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-[var(--bg-card)] p-6 rounded-lg shadow-sm border border-[var(--border-subtle)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-[var(--border-subtle)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">
            Profesores Registrados
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToCSV(professors, "profesores")}
              className="inline-flex items-center px-4 py-2 bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] hover:bg-[var(--color-ingenieria)] hover:text-white rounded-lg transition-all text-sm font-semibold border border-[var(--color-ingenieria)]/20 shadow-sm"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Exportar CSV
            </button>
            <SearchBar
              value={filters.name}
              onChange={(val) => updateFilter("name", val)}
              placeholder="Buscar por nombre o email..."
              className="w-full md:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredData.length === 0 ? (
            <EmptyState
              icon={faUserGraduate}
              title="No se encontraron profesores"
              description={
                filters.name
                  ? "Intenta con otros términos de búsqueda"
                  : "Aún no hay profesores registrados"
              }
            />
          ) : (
            filteredData.map((prof) => (
              <div
                key={prof.id}
                className="p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--color-ingenieria)]/10 rounded-full flex items-center justify-center text-[var(--color-ingenieria)]">
                    <FontAwesomeIcon
                      icon={faUserGraduate}
                      className="text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)]">
                      <span className="text-[var(--color-ingenieria)] text-sm font-medium mr-1">
                        {prof.title}
                      </span>
                      {prof.firstName} {prof.lastName}
                    </h3>
                    <p className="text-sm text-[var(--text-main)]/60">
                      {prof.email || "Sin correo registrado"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(prof)}
                    className="p-2 bg-amber-500/10 text-amber-600 rounded-md hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                    title="Editar"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(prof.id)}
                    className="p-2 bg-red-500/10 text-red-600 rounded-md hover:bg-red-500/20 transition-colors border border-red-500/20"
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar Profesor"
        message="¿Estás seguro de que quieres eliminar a este profesor? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default ProfessorsEdit;
