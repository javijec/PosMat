import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItem, saveItem, deleteItem } from "../firebase/CRUD";
import { toast } from "sonner";

export const useFirebaseMutations = ({
  collectionName,
  onSuccess,
  onError,
  addMessage = "Elemento agregado con éxito",
  updateMessage = "Elemento actualizado con éxito",
  deleteMessage = "Elemento eliminado con éxito",
  errorMessage = "Hubo un error al procesar la solicitud.",
}) => {
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error(`Mutation error in ${collectionName}:`, error);
      toast.error(errorMessage);
      if (onError) onError(error, variables, context);
    },
  };

  const addMutation = useMutation({
    mutationFn: (data) => addItem(collectionName, data),
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions.onSuccess(data, variables, context);
      toast.success(addMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      saveItem(collectionName, id, data, { merge: true }),
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions.onSuccess(data, variables, context);
      toast.success(updateMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(collectionName, id),
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions.onSuccess(data, variables, context);
      toast.success(deleteMessage);
    },
  });

  return {
    addMutation,
    updateMutation,
    deleteMutation,
    isPending:
      addMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
