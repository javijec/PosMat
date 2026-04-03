import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../data";
import { useDataMutations } from "../../hooks/useDataMutations";
import EditPageContainer from "../shared/EditPageContainer";
import ConfirmModal from "../shared/ConfirmModal";
import NewsForm from "./NewsForm";
import NewsList from "./NewsList";

const emptyForm = {
  title: "",
  summary: "",
  content: "",
  imageUrl: "",
  publishedAt: "",
};

const sortNewsByDate = (items) =>
  [...items].sort((a, b) => {
    const first = new Date(`${b.publishedAt || ""}T00:00:00`).getTime();
    const second = new Date(`${a.publishedAt || ""}T00:00:00`).getTime();

    return first - second;
  });

const NewsEdit = () => {
  const collectionName = "news";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [defaultValues, setDefaultValues] = useState(emptyForm);

  const { data: news = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!Array.isArray(result)) return [];
      return sortNewsByDate(result);
    },
  });

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useDataMutations({
      collectionName,
      onSuccess: () => {
        resetForm();
      },
      addMessage: "Noticia agregada con éxito",
      updateMessage: "Noticia actualizada con éxito",
      deleteMessage: "Noticia eliminada con éxito",
    });

  const handleEditClick = (item) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(item.id);
    setDefaultValues({
      title: item.title || "",
      summary: item.summary || "",
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      publishedAt: item.publishedAt || "",
    });
  };

  const resetForm = () => {
    setEditingId(-1);
    setDefaultValues(emptyForm);
  };

  const onSubmit = (data) => {
    if (editingId === -1) {
      addMutation.mutate(data);
      return;
    }

    updateMutation.mutate({
      id: editingId,
      data,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
    setDeleteId(null);
  };

  return (
    <EditPageContainer title="Panel de Noticias">
      <NewsForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="border-b pb-4 text-2xl font-bold text-gray-800">
          Noticias publicadas
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          Las tarjetas del inicio muestran automáticamente las 4 noticias más
          recientes según la fecha de publicación.
        </p>

        <NewsList
          news={news}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={setDeleteId}
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar noticia"
        message="¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default NewsEdit;
