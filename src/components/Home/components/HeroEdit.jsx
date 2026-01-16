import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchData } from "../../../firebase/CRUD";
import { useFirebaseMutations } from "../../../hooks/useFirebaseMutations";
import EditPageContainer from "../../shared/EditPageContainer";
import FormActions from "../../shared/FormActions";
import FormInput from "../../shared/FormInput";
import { toast } from "sonner";

const heroSchema = z.object({
  doctorado: z.string().min(1, "El campo Doctorado es obligatorio"),
  master: z.string().min(1, "El campo Maestría es obligatorio"),
  director: z.string().min(1, "El nombre del director es obligatorio"),
});

const HeroEdit = () => {
  const collectionName = "Home";

  const { data: homeData, isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      return result?.[0] || null;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      doctorado: "",
      master: "",
      director: "",
    },
  });

  useEffect(() => {
    if (homeData) {
      reset({
        doctorado: homeData.doctorado || "",
        master: homeData.master || "",
        director: homeData.director || "",
      });
    }
  }, [homeData, reset]);

  const { updateMutation, isPending } = useFirebaseMutations({
    collectionName,
    updateMessage: "Hero actualizado con éxito",
  });

  const onSubmit = (data) => {
    if (!homeData?.id) {
      toast.error("No se encontró el documento de configuración.");
      return;
    }
    updateMutation.mutate({ id: homeData.id, data });
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <EditPageContainer title="Editar Hero" maxWidth="2xl">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-6 italic">
          Configura los títulos principales que aparecen en la página de inicio.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Doctorado"
            {...register("doctorado")}
            error={errors.doctorado}
            placeholder="Ej: Doctorado en Ciencia de Materiales"
            className="font-semibold uppercase tracking-wide"
          />

          <FormInput
            label="Maestría"
            {...register("master")}
            error={errors.master}
            placeholder="Ej: Maestría en Ciencia y Tecnología de Materiales"
            className="font-semibold uppercase tracking-wide"
          />

          <FormInput
            label="Director"
            {...register("director")}
            error={errors.director}
            placeholder="Ej: Dr. Juan Pérez"
            className="font-semibold uppercase tracking-wide"
          />

          <div className="pt-4">
            <FormActions
              isSubmitting={isPending}
              isEditing={true}
              submitLabel="Guardar Cambios"
              hideCancel={true}
              disabled={!isDirty}
            />
            {!isDirty && !isPending && (
              <p className="text-center text-xs text-gray-400 mt-2">
                No hay cambios pendientes para guardar
              </p>
            )}
          </div>
        </form>
      </div>
    </EditPageContainer>
  );
};

export default HeroEdit;
