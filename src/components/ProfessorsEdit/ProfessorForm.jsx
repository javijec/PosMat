import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            {...register("firstName")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Juan"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            {...register("lastName")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Pérez"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título Académico
          </label>
          <input
            {...register("title")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Dr."
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: juan.perez@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
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
