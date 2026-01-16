import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import AboutForm from "./AboutForm";
import AboutList from "./AboutList";
import { toast } from "sonner";

const AboutEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "about";
  const [editingId, setEditingId] = useState(-1);
  const [defaultValues, setDefaultValues] = useState({
    title: "",
    content: "",
  });

  const { data: abouts = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      return result.sort((a, b) => (a.position || 0) - (b.position || 0));
    },
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      setEditingId(-1);
      setDefaultValues({ title: "", content: "" });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Hubo un error al procesar la solicitud.");
    },
  };

  const addMutation = useMutation({
    mutationFn: (newData) => {
      const newPosition =
        abouts.length > 0
          ? Math.max(...abouts.map((f) => f.position || 0)) + 1
          : 1;
      return addItem(collectionName, { ...newData, position: newPosition });
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("¡Agregado con éxito!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("¡Actualizado con éxito!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("¡Eliminado con éxito!");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ about, direction }) => {
      const index = abouts.findIndex((f) => f.id === about.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < abouts.length) {
        const otherAbout = abouts[targetIndex];
        const tempPos = about.position || 0;
        await Promise.all([
          saveItem(
            collectionName,
            about.id,
            { position: otherAbout.position },
            { merge: true }
          ),
          saveItem(
            collectionName,
            otherAbout.id,
            { position: tempPos },
            { merge: true }
          ),
        ]);
      }
    },
    ...mutationOptions,
  });

  const handleEditClick = (about) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(about.id);
    setDefaultValues({ title: about.title, content: about.content });
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este elemento?")
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

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar About</h1>
        <AboutForm
          editingId={editingId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          onCancel={() => {
            setEditingId(-1);
            setDefaultValues({ title: "", content: "" });
          }}
        />
        <AboutList
          data={abouts}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          handleMoveUp={(about) =>
            reorderMutation.mutate({ about, direction: "up" })
          }
          handleMoveDown={(about) =>
            reorderMutation.mutate({ about, direction: "down" })
          }
          isReordering={reorderMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AboutEdit;
