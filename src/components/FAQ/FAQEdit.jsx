import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import FAQForm from "./FAQForm";
import FAQList from "./FAQList";
import { toast } from "sonner";

const FAQEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "faq";
  const [editingId, setEditingId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    question: "",
    answer: "",
  });

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];

      return result.sort((a, b) => (a.position || 0) - (b.position || 0));
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
    mutationFn: (data) => {
      const newPosition =
        faqs.length > 0 ? Math.max(...faqs.map((f) => f.position || 0)) + 1 : 1;
      return addItem(collectionName, { ...data, position: newPosition });
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("FAQ agregada con éxito");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("FAQ actualizada con éxito");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("FAQ eliminada con éxito");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ faq, direction }) => {
      const index = faqs.findIndex((f) => f.id === faq.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < faqs.length) {
        const otherFaq = faqs[targetIndex];
        const tempPos = faq.position || 0;
        await Promise.all([
          saveItem(
            collectionName,
            faq.id,
            { position: otherFaq.position },
            { merge: true }
          ),
          saveItem(
            collectionName,
            otherFaq.id,
            { position: tempPos },
            { merge: true }
          ),
        ]);
      }
    },
    ...mutationOptions,
  });

  const handleEditClick = (faq) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(faq.id);
    setDefaultValues({
      question: faq.question,
      answer: faq.answer,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta FAQ?")) {
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
    setDefaultValues({ question: "", answer: "" });
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
          Panel de FAQ
        </h1>

        <FAQForm
          editingId={editingId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          onCancel={resetForm}
        />

        <FAQList
          faqs={faqs}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          handleMoveUp={(faq) =>
            reorderMutation.mutate({ faq, direction: "up" })
          }
          handleMoveDown={(faq) =>
            reorderMutation.mutate({ faq, direction: "down" })
          }
          isReordering={reorderMutation.isPending}
        />
      </div>
    </div>
  );
};

export default FAQEdit;
