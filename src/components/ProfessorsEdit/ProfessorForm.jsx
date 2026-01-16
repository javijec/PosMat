import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";

const professorSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").or(z.literal("")),
  title: z.string().min(1, "El título es obligatorio (ej: Dr., Mag., Lic.)"),
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(professorSchema),
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
        {editingId === -1 ? "Agregar Nuevo Profesor" : "Editar Profesor"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          {...register("firstName")}
          error={errors.firstName}
          placeholder="Ej: Juan"
        />

        <FormInput
          label="Apellido"
          {...register("lastName")}
          error={errors.lastName}
          placeholder="Ej: Pérez"
        />

        <FormInput
          label="Título Académico"
          {...register("title")}
          error={errors.title}
          placeholder="Ej: Dr."
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
