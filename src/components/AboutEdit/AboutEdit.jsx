import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem } from "../../firebase/CRUD";
import AboutForm from "./AboutForm";
import AboutList from "./AboutList";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import EditPageContainer from "../shared/EditPageContainer";

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

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "¡Agregado con éxito!",
      updateMessage: "¡Actualizado con éxito!",
      deleteMessage: "¡Eliminado con éxito!",
      customAddFn: async (newData) => {
        const newPosition =
          abouts.length > 0
            ? Math.max(...abouts.map((f) => f.position || 0)) + 1
            : 1;
        return { ...newData, position: newPosition };
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
    },
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

  const resetForm = () => {
    setEditingId(-1);
    setDefaultValues({ title: "", content: "" });
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <EditPageContainer title="Editar About" maxWidth="4xl">
      <AboutForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
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
    </EditPageContainer>
  );
};

export default AboutEdit;
