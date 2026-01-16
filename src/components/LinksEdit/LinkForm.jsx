import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";

const linkSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  url: z.string().url("Debe ser una URL válida (ej: https://...)"),
  category: z.string().min(1, "La categoría es obligatoria"),
  description: z.string().optional(),
});

const LinkForm = ({
  editingId,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-8 p-6 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editingId === -1 ? "Agregar Nuevo Link" : "Editar Link"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Sitio / Recurso
          </label>
          <input
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Biblioteca Digital"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            {...register("url")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://ejemplo.com"
          />
          {errors.url && (
            <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <input
            {...register("category")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Recursos Útiles"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (Opcional)
          </label>
          <input
            {...register("description")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Una breve explicación del link"
          />
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar Link" : "Guardar Cambios"}
      />
    </form>
  );
};

export default LinkForm;
