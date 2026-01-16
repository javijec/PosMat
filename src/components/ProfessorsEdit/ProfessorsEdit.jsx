import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem, addItem, deleteItem } from "../../firebase/CRUD";
import ProfessorForm from "./ProfessorForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faSearch,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

const ProfessorsEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "professors";
  const [editingId, setEditingId] = useState(-1);
  const [searchName, setSearchName] = useState("");
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
      toast.success("Profesor agregado con éxito");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Profesor actualizado con éxito");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Profesor eliminado con éxito");
    },
  });

  const handleEdit = (prof) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(prof.id);
    setDefaultValues(prof);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar a este profesor?")
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
    setDefaultValues({ firstName: "", lastName: "", email: "", title: "" });
  };

  const filteredData = useMemo(() => {
    if (!searchName) return professors;
    const lowerSearch = searchName.toLowerCase();
    return professors.filter(
      (prof) =>
        prof.firstName.toLowerCase().includes(lowerSearch) ||
        prof.lastName.toLowerCase().includes(lowerSearch) ||
        (prof.email && prof.email.toLowerCase().includes(lowerSearch))
    );
  }, [professors, searchName]);

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
          Gestión de Profesores
        </h1>

        <ProfessorForm
          editingId={editingId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          onCancel={resetForm}
        />

        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Profesores Registrados
            </h2>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-64 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FontAwesomeIcon
                  icon={faUserGraduate}
                  className="text-4xl text-gray-300 mb-3"
                />
                <p className="text-gray-500 italic">
                  No se encontraron profesores.
                </p>
              </div>
            ) : (
              filteredData.map((prof) => (
                <div
                  key={prof.id}
                  className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                      <FontAwesomeIcon
                        icon={faUserGraduate}
                        className="text-xl"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        <span className="text-indigo-600 text-sm font-medium mr-1">
                          {prof.title}
                        </span>
                        {prof.firstName} {prof.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {prof.email || "Sin correo registrado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(prof)}
                      className="p-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors"
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prof.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
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
      </div>
    </div>
  );
};

export default ProfessorsEdit;
