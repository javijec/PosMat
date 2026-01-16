import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StudentsEditCard from "./StudentEditCard";
import StudentForm from "./StudentForm";
import { fetchData, saveItem, addItem, deleteItem } from "../../firebase/CRUD";
import { toast } from "sonner";

const StudentsEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "students";
  const [editingId, setEditingId] = useState(-1);
  const [defaultValues, setDefaultValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    director: "",
    codirector: "",
    thesis_topic: "",
    program: "doctorado",
  });

  const [searchFullName, setSearchFullName] = useState("");
  const [searchProgram, setSearchProgram] = useState("");
  const [searchThesis, setSearchThesis] = useState("");

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

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      setEditingId(-1);
      resetForm();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Hubo un error al procesar la solicitud.");
    },
  };

  const addMutation = useMutation({
    mutationFn: (data) => addItem(collectionName, data),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Estudiante agregado con éxito");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Estudiante actualizado con éxito");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Estudiante eliminado con éxito");
    },
  });

  const handleEdit = (student) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(student.id);
    setDefaultValues(student);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar a este estudiante?")
    ) {
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
      firstName: "",
      lastName: "",
      email: "",
      director: "",
      codirector: "",
      thesis_topic: "",
      program: "doctorado",
    });
  };

  const filteredData = useMemo(() => {
    return students.filter((student) => {
      const lowerFullName = (
        student.firstName +
        " " +
        student.lastName
      ).toLowerCase();
      const matchFullName = searchFullName
        ? lowerFullName.includes(searchFullName.toLowerCase())
        : true;
      const matchProgram = searchProgram
        ? student.program === searchProgram
        : true;
      const matchThesis = searchThesis
        ? student.thesis_topic
            .toLowerCase()
            .includes(searchThesis.toLowerCase())
        : true;
      return matchFullName && matchProgram && matchThesis;
    });
  }, [students, searchFullName, searchProgram, searchThesis]);

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 border-l-4 border-indigo-600 pl-4">
          Panel de Estudiantes
        </h1>

        <StudentForm
          editingId={editingId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          onCancel={resetForm}
        />

        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Buscar Estudiantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={searchFullName}
                onChange={(e) => setSearchFullName(e.target.value)}
                placeholder="Nombre o apellido..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programa
              </label>
              <select
                value={searchProgram}
                onChange={(e) => setSearchProgram(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Todos</option>
                <option value="doctorado">Doctorado</option>
                <option value="maestria">Maestría</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema de Tesis
              </label>
              <input
                type="text"
                value={searchThesis}
                onChange={(e) => setSearchThesis(e.target.value)}
                placeholder="Palabra clave..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Estudiantes Registrados
          </h2>
          <StudentsEditCard
            students={filteredData}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentsEdit;
