import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StudentsEditCard from "./StudentEditCard";
import StudentForm from "./StudentForm";
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
import {
  faPencilAlt,
  faTrash,
  faUserGraduate,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { exportToCSV } from "../../utils/csvExport";

const StudentsEdit = () => {
  const collectionName = "students";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    director: "",
    codirector: "",
    thesis_topic: "",
    program: "doctorado",
  });

  const { data: students = [], isLoading } = useQuery({
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
      addMessage: "Estudiante agregado con éxito",
      updateMessage: "Estudiante actualizado con éxito",
      deleteMessage: "Estudiante eliminado con éxito",
    });

  const { filteredData, filters, updateFilter } = useFilters(
    students,
    { name: "", program: "", thesis: "" },
    (student, f) => {
      const lowerFullName = (
        student.firstName +
        " " +
        student.lastName
      ).toLowerCase();
      const matchName = !f.name || lowerFullName.includes(f.name.toLowerCase());
      const matchProgram = !f.program || student.program === f.program;
      const matchThesis =
        !f.thesis ||
        (student.thesis_topic || "")
          .toLowerCase()
          .includes(f.thesis.toLowerCase());
      return matchName && matchProgram && matchThesis;
    }
  );

  const handleEdit = (student) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(student.id);
    setDefaultValues(student);
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
      firstName: "",
      lastName: "",
      email: "",
      director: "",
      codirector: "",
      thesis_topic: "",
      program: "doctorado",
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
    <EditPageContainer title="Panel de Estudiantes">
      <StudentForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--border-subtle)]">
        <FilterGrid title="Buscar Estudiantes">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)]/70 mb-1">
              Nombre Completo
            </label>
            <SearchBar
              value={filters.name}
              onChange={(val) => updateFilter("name", val)}
              placeholder="Nombre o apellido..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)]/70 mb-1">
              Programa
            </label>
            <select
              value={filters.program}
              onChange={(e) => updateFilter("program", e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-subtle)] rounded-full focus:ring-2 focus:ring-[var(--color-ingenieria)] focus:border-[var(--color-ingenieria)] focus:outline-none transition-all shadow-sm bg-[var(--bg-card)] text-[var(--text-main)]"
            >
              <option value="">Todos</option>
              <option value="doctorado">Doctorado</option>
              <option value="maestria">Maestría</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)]/70 mb-1">
              Tema de Tesis
            </label>
            <SearchBar
              value={filters.thesis}
              onChange={(val) => updateFilter("thesis", val)}
              placeholder="Palabra clave..."
            />
          </div>
        </FilterGrid>

        <div className="flex justify-between items-center mb-6 border-b border-[var(--border-subtle)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">
            Estudiantes Registrados
          </h2>
          <button
            onClick={() => exportToCSV(students, "estudiantes")}
            className="inline-flex items-center px-4 py-2 bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] hover:bg-[var(--color-ingenieria)] hover:text-white rounded-lg transition-all text-sm font-semibold border border-[var(--color-ingenieria)]/20 shadow-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exportar CSV
          </button>
        </div>

        {filteredData.length === 0 ? (
          <EmptyState
            icon={faUserGraduate}
            title="No se encontraron estudiantes"
            description="Intenta eliminando algunos filtros de búsqueda"
          />
        ) : (
          <StudentsEditCard
            students={filteredData}
            handleEdit={handleEdit}
            handleDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar Estudiante"
        message="¿Estás seguro de que quieres eliminar a este estudiante? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default StudentsEdit;
