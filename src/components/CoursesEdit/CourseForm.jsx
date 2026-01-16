import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";
import useConfirmExit from "../../hooks/useConfirmExit";

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
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });

  useConfirmExit(isDirty);

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
      className="mb-8 p-6 border rounded-xl bg-white shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editingId === -1 ? "Agregar Nuevo Curso" : "Editar Curso"}
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <FormInput
          label="Nombre del Curso"
          {...register("nombre")}
          error={errors.nombre}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput label="Horas Teóricas" {...register("horasTeoricas")} />
          <FormInput label="Horas Prácticas" {...register("horasPracticas")} />
          <FormInput label="Horas TP" {...register("horasTP")} />
          <FormInput label="UVACS" {...register("uvacs")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Año"
            type="number"
            {...register("año")}
            error={errors.año}
          />
          <FormSelect
            label="Semestre"
            {...register("semestre")}
            options={[
              { value: 1, label: "1er Semestre" },
              { value: 2, label: "2do Semestre" },
            ]}
          />
          <FormSelect
            label="Humanístico"
            {...register("humanistico")}
            options={[
              { value: false, label: "No" },
              { value: true, label: "Si" },
            ]}
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 italic shadow-inner">
          <h3 className="text-lg font-bold mb-4 text-gray-800 not-italic">
            Profesores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 not-italic">
            <FormInput
              placeholder="Nombre del profesor"
              value={profName}
              onChange={(e) => setProfName(e.target.value)}
            />
            <FormInput
              placeholder="Email (opcional)"
              value={profEmail}
              onChange={(e) => setProfEmail(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleAddProf}
            className="flex items-center text-sm bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 mb-4 transition-all shadow-md shadow-indigo-100 not-italic font-medium"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Profesor
          </button>

          {fields.length > 0 && (
            <div className="space-y-2 not-italic">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between bg-white p-3 border border-gray-100 rounded-lg text-sm shadow-sm"
                >
                  <span className="font-medium text-gray-700">
                    {field.nombre}
                    {field.email && (
                      <span className="text-gray-400 ml-2 font-normal">
                        ({field.email})
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600 p-2 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Fecha de Inicio"
            type="date"
            {...register("fechaInicio")}
          />
          <FormInput label="Lugar de Cursada" {...register("lugar")} />
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
