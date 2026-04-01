import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";
import FormTextarea from "../shared/FormTextarea";
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
  degree_title: z.string().optional(),
  url: z.union([z.string().url("URL inválida"), z.literal("")]).optional(),
  director: z.string().optional(),
  co_director: z.string().optional(),
  workplace: z.string().optional(),
  defense_date: z.string().optional(),
  juror_1: z.string().optional(),
  juror_2: z.string().optional(),
  juror_3: z.string().optional(),
  summary_es: z.string().optional(),
  abstract_en: z.string().optional(),
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
          label="Título al que aspira"
          {...register("degree_title")}
          error={errors.degree_title}
          placeholder="Ej: Doctor/a en Ciencia de Materiales"
          className="md:col-span-2"
        />

        <FormInput
          label="Autor"
          {...register("name")}
          error={errors.name}
          placeholder="Nombre completo del autor"
        />

        <FormInput
          label="URL / Enlace"
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

        <FormTextarea
          label="Co-director/a"
          {...register("co_director")}
          error={errors.co_director}
          rows={3}
          placeholder="Puede no haber, o podés cargar más de uno. Separalos por línea o coma."
        />

        <FormInput
          label="Lugar de Trabajo"
          {...register("workplace")}
          error={errors.workplace}
          placeholder="Ej: INTEMA / FI UNMdP / CONICET"
        />

        <FormInput
          label="Fecha de Defensa"
          type="date"
          {...register("defense_date")}
          error={errors.defense_date}
        />

        <FormInput
          label="Jurado 1"
          {...register("juror_1")}
          error={errors.juror_1}
          placeholder="Nombre del primer jurado"
        />

        <FormInput
          label="Jurado 2"
          {...register("juror_2")}
          error={errors.juror_2}
          placeholder="Nombre del segundo jurado"
        />

        <FormInput
          label="Jurado 3"
          {...register("juror_3")}
          error={errors.juror_3}
          placeholder="Nombre del tercer jurado"
        />

        <FormTextarea
          label="Resumen en Español"
          {...register("summary_es")}
          error={errors.summary_es}
          rows={6}
          placeholder="Resumen de la tesis en español"
          className="md:col-span-2"
        />

        <FormTextarea
          label="Abstract en Inglés"
          {...register("abstract_en")}
          error={errors.abstract_en}
          rows={6}
          placeholder="Abstract of the thesis in English"
          className="md:col-span-2"
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
