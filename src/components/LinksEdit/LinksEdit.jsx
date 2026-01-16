import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem, addItem, deleteItem } from "../../firebase/CRUD";
import LinkForm from "./components/LinkForm";
import LinksList from "./components/LinksList";
import { toast } from "sonner";

const LinksEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "links";
  const [editingId, setEditingId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    url: "",
    description: "",
    category: "",
  });

  const { data: links = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];
      return result;
    },
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      setEditingId(null);
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
      toast.success("Link agregado con éxito");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Link actualizado con éxito");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Link eliminado con éxito");
    },
  });

  const handleEdit = (item) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(item.id);
    setDefaultValues(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este link?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingId === null) {
      addMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId, data });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setDefaultValues({ name: "", url: "", description: "", category: "" });
  };

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
          Panel de Links
        </h1>

        <LinkForm
          editingId={editingId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          onCancel={resetForm}
        />

        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
            Links Registrados
          </h2>
          <LinksList data={links} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default LinksEdit;
