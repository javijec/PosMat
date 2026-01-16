import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormActions from "../shared/FormActions";

const courseSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  horasTeoricas: z.string().default(""),
  horasPracticas: z.string().default(""),
  horasTP: z.string().default(""),
  uvacs: z.string().default(""),
  año: z.coerce
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1900)
    .max(2100),
  semestre: z.coerce.number().min(1).max(2),
  profesores: z
    .array(
      z.object({
        nombre: z.string().min(1, "El nombre del profesor es obligatorio"),
        email: z.string().email("Email inválido").or(z.literal("")),
      })
    )
    .default([]),
  fechaInicio: z.string().optional(),
  lugar: z.string().optional(),
  humanistico: z.coerce.boolean().default(false),
});

const CourseForm = ({
  editingId,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [profName, setProfName] = useState("");
  const [profEmail, setProfEmail] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "profesores",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleAddProf = () => {
    if (profName.trim()) {
      append({ nombre: profName, email: profEmail });
      setProfName("");
      setProfEmail("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-8 p-6 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editingId === -1 ? "Agregar Nuevo Curso" : "Editar Curso"}
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Curso
          </label>
          <input
            {...register("nombre")}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas Teóricas
            </label>
            <input
              {...register("horasTeoricas")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas Prácticas
            </label>
            <input
              {...register("horasPracticas")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas TP
            </label>
            <input
              {...register("horasTP")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UVACS
            </label>
            <input
              {...register("uvacs")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <input
              type="number"
              {...register("año")}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.año ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.año && (
              <p className="text-red-500 text-xs mt-1">{errors.año.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestre
            </label>
            <select
              {...register("semestre")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="1">1er Semestre</option>
              <option value="2">2do Semestre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Humanístico
            </label>
            <select
              {...register("humanistico")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="false">No</option>
              <option value="true">Si</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Profesores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Nombre del profesor"
              value={profName}
              onChange={(e) => setProfName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              placeholder="Email (opcional)"
              value={profEmail}
              onChange={(e) => setProfEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={handleAddProf}
            className="flex items-center text-sm bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 mb-4 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Profesor
          </button>

          {fields.length > 0 && (
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between bg-white p-2 border rounded-md text-sm"
                >
                  <span>
                    {field.nombre}{" "}
                    {field.email && (
                      <span className="text-gray-500 ml-1">
                        ({field.email})
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              {...register("fechaInicio")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar de Cursada
            </label>
            <input
              {...register("lugar")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar Curso" : "Guardar Cambios"}
      />
    </form>
  );
};

export default CourseForm;
