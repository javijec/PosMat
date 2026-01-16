import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseItem from "./CourseItem";
import CourseForm from "./CourseForm";
import { fetchData } from "../../firebase/CRUD";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import { useFilters } from "../../hooks/useFilters";
import EditPageContainer from "../shared/EditPageContainer";
import SearchBar from "../shared/SearchBar";
import FilterGrid from "../shared/FilterGrid";
import ConfirmModal from "../shared/ConfirmModal";
import EmptyState from "../shared/EmptyState";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const CoursesEdit = () => {
  const collectionName = "courses";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    nombre: "",
    horasTeoricas: "",
    horasPracticas: "",
    horasTP: "",
    uvacs: "",
    profesores: [],
    fechaInicio: "",
    lugar: "",
    semestre: 1,
    año: new Date().getFullYear(),
    humanistico: false,
  });

  const { data: courses = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];

      return result
        .map((doc) => ({
          id: doc.id,
          ...doc,
          año: Number(doc.año),
          semestre: Number(doc.semestre),
        }))
        .sort((a, b) => {
          if (b.año !== a.año) return b.año - a.año;
          return a.semestre - b.semestre;
        });
    },
  });

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "Curso agregado con éxito",
      updateMessage: "Curso actualizado con éxito",
      deleteMessage: "Curso eliminado con éxito",
    });

  const { filteredData, filters, updateFilter } = useFilters(
    courses,
    { name: "", year: "", semester: "" },
    (course, f) => {
      const matchYear = !f.year || String(course.año) === f.year;
      const matchSemester =
        !f.semester || String(course.semestre) === f.semester;
      const matchName =
        !f.name || course.nombre.toLowerCase().includes(f.name.toLowerCase());
      return matchYear && matchSemester && matchName;
    }
  );

  const handleEdit = (course) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(course.id);
    setDefaultValues({
      ...course,
      profesores: course.profesores || [],
      humanistico: !!course.humanistico,
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
      nombre: "",
      horasTeoricas: "",
      horasPracticas: "",
      horasTP: "",
      uvacs: "",
      profesores: [],
      fechaInicio: "",
      lugar: "",
      semestre: 1,
      año: new Date().getFullYear(),
      humanistico: false,
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
    <EditPageContainer title="Panel de Cursos">
      <CourseForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <FilterGrid title="Cursos Existentes">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestre
            </label>
            <select
              value={filters.semester}
              onChange={(e) => updateFilter("semester", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm bg-white"
            >
              <option value="">Todos</option>
              <option value="1">1er Semestre</option>
              <option value="2">2do Semestre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <SearchBar
              value={filters.name}
              onChange={(val) => updateFilter("name", val)}
              placeholder="Buscar por nombre..."
            />
          </div>
        </FilterGrid>

        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <EmptyState
              icon={faBook}
              title="No se encontraron cursos"
              description="Intenta con otros términos de búsqueda"
            />
          ) : (
            filteredData.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar Curso"
        message="¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default CoursesEdit;
