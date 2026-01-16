import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";
import useConfirmExit from "../../hooks/useConfirmExit";

const tesisSchema = z.object({
  name: z.string().min(1, "El nombre del tesista es obligatorio"),
  title: z.string().min(1, "El título de la tesis es obligatorio"),
  year: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ invalid_type_error: "Debe ser un año válido" })
      .min(1900)
      .max(new Date().getFullYear() + 1)
  ),
  tag: z.string().min(1, "El tag o área es obligatorio"),
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
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(tesisSchema),
    defaultValues,
  });

  useConfirmExit(isDirty);

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
