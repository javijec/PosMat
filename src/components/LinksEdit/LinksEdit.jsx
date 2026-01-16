import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../firebase/CRUD";
import LinkForm from "./LinkForm";
import LinksList from "./LinksList";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import EditPageContainer from "../shared/EditPageContainer";
import ConfirmModal from "../shared/ConfirmModal";
import EmptyState from "../shared/EmptyState";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const LinksEdit = () => {
  const collectionName = "links";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
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

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "Enlace agregado con éxito",
      updateMessage: "Enlace actualizado con éxito",
      deleteMessage: "Enlace eliminado con éxito",
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
    <EditPageContainer title="Panel de Links">
      <LinkForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          Links Registrados
        </h2>

        {links.length === 0 ? (
          <EmptyState
            icon={faLink}
            title="No hay links registrados"
            description="Agrega un nuevo enlace arriba"
          />
        ) : (
          <LinksList
            data={links}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar Enlace"
        message="¿Estás seguro de que quieres eliminar este enlace? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default LinksEdit;
