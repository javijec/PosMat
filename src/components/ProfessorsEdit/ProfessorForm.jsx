import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import useConfirmExit from "../../hooks/useConfirmExit";

const professorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  department: z.string().min(1, "El departamento es obligatorio"),
  email: z.string().email("Email inválido"),
  title: z.string().min(1, "El título es obligatorio"),
});

const ProfessorForm = ({
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
    resolver: zodResolver(professorSchema),
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
        {editingId === -1 ? "Agregar Nuevo Profesor" : "Editar Profesor"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          {...register("name")}
          error={errors.name}
          placeholder="Ej: Juan Pérez"
        />

        <FormInput
          label="Título Académico"
          {...register("title")}
          error={errors.title}
          placeholder="Ej: Dr."
        />

        <FormInput
          label="Departamento"
          {...register("department")}
          error={errors.department}
          placeholder="Ej: Ingeniería Informática"
        />

        <FormInput
          label="Email"
          {...register("email")}
          error={errors.email}
          placeholder="Ej: juan.perez@ejemplo.com"
        />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar Profesor" : "Guardar Cambios"}
      />
    </form>
  );
};

export default ProfessorForm;
