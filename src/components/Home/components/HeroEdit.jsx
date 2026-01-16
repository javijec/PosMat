import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchData } from "../../../firebase/CRUD";
import { useFirebaseMutations } from "../../../hooks/useFirebaseMutations";
import EditPageContainer from "../../shared/EditPageContainer";
import FormActions from "../../shared/FormActions";
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
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Doctorado
            </label>
            <input
              {...register("doctorado")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                errors.doctorado ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Doctorado en Ciencia de Materiales"
            />
            {errors.doctorado && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.doctorado.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Maestría
            </label>
            <input
              {...register("master")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                errors.master ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Maestría en Ciencia y Tecnología de Materiales"
            />
            {errors.master && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.master.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Director
            </label>
            <input
              {...register("director")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                errors.director ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Dr. Juan Pérez"
            />
            {errors.director && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.director.message}
              </p>
            )}
          </div>

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
