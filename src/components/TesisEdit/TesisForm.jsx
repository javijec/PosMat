import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";

const tesisSchema = z.object({
  year: z.coerce
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1900)
    .max(2100),
  name: z.string().min(1, "El nombre del autor es obligatorio"),
  title: z.string().min(1, "El título es obligatorio"),
  url: z.string().url("URL inválida").or(z.literal("")),
  director: z.string().min(1, "El director es obligatorio"),
  co_director: z.string().optional(),
  tag: z.enum(["maestria", "doctorado"]),
});

const TesisForm = ({
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
    resolver: zodResolver(tesisSchema),
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
        {editingId === -1 ? "Agregar Nueva Tesis" : "Editar Tesis"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <input
            type="number"
            {...register("year")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.year ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: 2024"
          />
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Tesis
          </label>
          <select
            {...register("tag")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="maestria">Maestría</option>
            <option value="doctorado">Doctorado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la Tesis
          </label>
          <input
            {...register("title")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Análisis de algoritmos concurrentes..."
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nombre completo del autor"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL / Enlace al Resumen
          </label>
          <input
            {...register("url")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://ejemplo.com/tesis"
          />
          {errors.url && (
            <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Director
          </label>
          <input
            {...register("director")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.director ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nombre del director"
          />
          {errors.director && (
            <p className="text-red-500 text-xs mt-1">
              {errors.director.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Co-Director (Opcional)
          </label>
          <input
            {...register("co_director")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nombre del co-director"
          />
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar Tesis" : "Guardar Cambios"}
      />
    </form>
  );
};

export default TesisForm;
