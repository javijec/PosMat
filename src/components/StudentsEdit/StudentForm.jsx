import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const studentSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").or(z.literal("")),
  director: z.string().min(1, "El director es obligatorio"),
  codirector: z.string().optional(),
  thesis_topic: z.string().min(1, "El tema de tesis es obligatorio"),
  program: z.enum(["maestria", "doctorado"]),
});

const StudentForm = ({
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
    resolver: zodResolver(studentSchema),
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
        {editingId === -1 ? "Agregar Nuevo Estudiante" : "Editar Estudiante"}
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
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
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
          />
          {errors.director && (
            <p className="text-red-500 text-xs mt-1">
              {errors.director.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Codirector (Opcional)
          </label>
          <input
            {...register("codirector")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tema de Tesis
          </label>
          <input
            {...register("thesis_topic")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.thesis_topic ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.thesis_topic && (
            <p className="text-red-500 text-xs mt-1">
              {errors.thesis_topic.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programa
          </label>
          <select
            {...register("program")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="doctorado">Doctorado</option>
            <option value="maestria">Maestría</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Opcional)
          </label>
          <input
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-3 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
        >
          {isSubmitting
            ? "Guardando..."
            : editingId === -1
            ? "Agregar Estudiante"
            : "Guardar Cambios"}
        </button>
        {editingId !== -1 && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 py-2 px-6 rounded-md shadow-sm hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
