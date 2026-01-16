import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";

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
        <FormInput
          label="Año"
          type="number"
          {...register("year")}
          error={errors.year}
          placeholder="Ej: 2024"
        />

        <FormSelect
          label="Tipo de Tesis"
          {...register("tag")}
          options={[
            { value: "maestria", label: "Maestría" },
            { value: "doctorado", label: "Doctorado" },
          ]}
        />

        <FormInput
          label="Título de la Tesis"
          {...register("title")}
          error={errors.title}
          placeholder="Ej: Análisis de algoritmos concurrentes..."
          className="md:col-span-2"
        />

        <FormInput
          label="Autor"
          {...register("name")}
          error={errors.name}
          placeholder="Nombre completo del autor"
        />

        <FormInput
          label="URL / Enlace al Resumen"
          {...register("url")}
          error={errors.url}
          placeholder="https://ejemplo.com/tesis"
        />

        <FormInput
          label="Director"
          {...register("director")}
          error={errors.director}
          placeholder="Nombre del director"
        />

        <FormInput
          label="Co-Director (Opcional)"
          {...register("co_director")}
          placeholder="Nombre del co-director"
        />
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
