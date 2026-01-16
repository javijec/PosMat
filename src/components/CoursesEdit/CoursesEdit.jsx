import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseItem from "./CourseItem";
import CourseForm from "./CourseForm";
import { fetchData } from "../../firebase/CRUD";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import EditPageContainer from "../shared/EditPageContainer";

const CoursesEdit = () => {
  const collectionName = "courses";
  const [editingId, setEditingId] = useState(-1);
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

  // Search states
  const [searchYear, setSearchYear] = useState("");
  const [searchSemester, setSearchSemester] = useState("");
  const [searchName, setSearchName] = useState("");

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

  const handleEdit = (course) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(course.id);
    setDefaultValues({
      ...course,
      profesores: course.profesores || [],
      humanistico: !!course.humanistico,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este curso?")) {
      deleteMutation.mutate(id);
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

  const filteredData = useMemo(() => {
    return courses.filter((course) => {
      const matchYear = searchYear ? String(course.año) === searchYear : true;
      const matchSemester = searchSemester
        ? String(course.semestre) === searchSemester
        : true;
      const matchName = searchName
        ? course.nombre.toLowerCase().includes(searchName.toLowerCase())
        : true;
      return matchYear && matchSemester && matchName;
    });
  }, [courses, searchYear, searchSemester, searchName]);

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

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Cursos Existentes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <input
              type="text"
              placeholder="Ej: 2024"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestre
            </label>
            <select
              value={searchSemester}
              onChange={(e) => setSearchSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-500 py-8 italic bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              No se encontraron cursos que coincidan con la búsqueda.
            </p>
          ) : (
            filteredData.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </EditPageContainer>
  );
};

export default CoursesEdit;
