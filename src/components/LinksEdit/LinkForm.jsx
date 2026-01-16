import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";

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
        <FormInput
          label="Nombre del Sitio / Recurso"
          {...register("name")}
          error={errors.name}
          placeholder="Ej: Biblioteca Digital"
          className="md:col-span-2"
        />

        <FormInput
          label="URL"
          {...register("url")}
          error={errors.url}
          placeholder="https://ejemplo.com"
        />

        <FormInput
          label="Categoría"
          {...register("category")}
          error={errors.category}
          placeholder="Ej: Recursos Útiles"
        />

        <FormInput
          label="Descripción (Opcional)"
          {...register("description")}
          placeholder="Una breve explicación del link"
          className="md:col-span-2"
        />
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
