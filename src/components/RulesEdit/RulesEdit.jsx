import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import RulesForm from "./RulesForm";
import RulesList from "./RulesList";
import { toast } from "sonner";

const RulesEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "rules";
  const [editingId, setEditingId] = useState(-1);
  const [defaultValues, setDefaultValues] = useState({
    title: "",
    html: "",
  });

  const { data: rules = [], isLoading } = useQuery({
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
      setEditingId(-1);
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
        rules.length > 0
          ? Math.max(...rules.map((f) => f.position || 0)) + 1
          : 1;
      return addItem(collectionName, { ...data, position: newPosition });
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Reglamento agregado con éxito");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Reglamento actualizado con éxito");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Reglamento eliminado con éxito");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ rule, direction }) => {
      const index = rules.findIndex((f) => f.id === rule.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < rules.length) {
        const otherRule = rules[targetIndex];
        const tempPos = rule.position || 0;
        await Promise.all([
          saveItem(
            collectionName,
            rule.id,
            { position: otherRule.position },
            { merge: true }
          ),
          saveItem(
            collectionName,
            otherRule.id,
            { position: tempPos },
            { merge: true }
          ),
        ]);
      }
    },
    ...mutationOptions,
  });

  const handleEditClick = (rule) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(rule.id);
    setDefaultValues({
      title: rule.title,
      html: rule.html,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este reglamento?")) {
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
    setDefaultValues({ title: "", html: "" });
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
          Editar Reglamentos
        </h1>

        <RulesForm
          editingId={editingId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          onCancel={resetForm}
        />

        <RulesList
          data={rules}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onMoveUp={(rule) => reorderMutation.mutate({ rule, direction: "up" })}
          onMoveDown={(rule) =>
            reorderMutation.mutate({ rule, direction: "down" })
          }
          isReordering={reorderMutation.isPending}
        />
      </div>
    </div>
  );
};

export default RulesEdit;
