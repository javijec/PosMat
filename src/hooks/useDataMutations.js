import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addItem, deleteItem, saveItem } from "../data";

export const useDataMutations = ({
  collectionName,
  onSuccess,
  onError,
  addMessage = "Elemento agregado con éxito",
  updateMessage = "Elemento actualizado con éxito",
  deleteMessage = "Elemento eliminado con éxito",
  errorMessage = "Hubo un error al procesar la solicitud.",
  customAddFn,
  customUpdateFn,
  customDeleteFn,
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
    mutationFn: async (data) => {
      if (!customAddFn) {
        return addItem(collectionName, data);
      }

      const result = await customAddFn(data);

      if (result && typeof result === "object" && !Array.isArray(result)) {
        return addItem(collectionName, result);
      }

      return result;
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions.onSuccess(data, variables, context);
      toast.success(addMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      if (customUpdateFn) {
        return customUpdateFn({ id, data });
      }

      return saveItem(collectionName, id, data);
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      mutationOptions.onSuccess(data, variables, context);
      toast.success(updateMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      if (customDeleteFn) {
        return customDeleteFn(id);
      }

      return deleteItem(collectionName, id);
    },
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
