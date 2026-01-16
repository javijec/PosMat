import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem, addItem } from "../../firebase/CRUD";
import FAQForm from "./FAQForm";
import FAQList from "./FAQList";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import EditPageContainer from "../shared/EditPageContainer";

const FAQEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "faq";
  const [editingId, setEditingId] = useState(-1);
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

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "FAQ agregada con éxito",
      updateMessage: "FAQ actualizada con éxito",
      deleteMessage: "FAQ eliminada con éxito",
      customAddFn: (data) => {
        const newPosition =
          faqs.length > 0
            ? Math.max(...faqs.map((f) => f.position || 0)) + 1
            : 1;
        return addItem(collectionName, { ...data, position: newPosition });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
    },
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
    if (editingId === -1) {
      addMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId, data });
    }
  };

  const resetForm = () => {
    setEditingId(-1);
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
    <EditPageContainer title="Panel de FAQ">
      <FAQForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <FAQList
        faqs={faqs}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
        handleMoveUp={(faq) => reorderMutation.mutate({ faq, direction: "up" })}
        handleMoveDown={(faq) =>
          reorderMutation.mutate({ faq, direction: "down" })
        }
        isReordering={reorderMutation.isPending}
      />
    </EditPageContainer>
  );
};

export default FAQEdit;
