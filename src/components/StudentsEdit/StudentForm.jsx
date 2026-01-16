import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";

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
        <FormInput
          label="Nombre"
          {...register("firstName")}
          error={errors.firstName}
        />

        <FormInput
          label="Apellido"
          {...register("lastName")}
          error={errors.lastName}
        />

        <FormInput
          label="Director"
          {...register("director")}
          error={errors.director}
        />

        <FormInput label="Codirector (Opcional)" {...register("codirector")} />

        <FormInput
          label="Tema de Tesis"
          {...register("thesis_topic")}
          error={errors.thesis_topic}
          className="md:col-span-2"
        />

        <FormSelect
          label="Programa"
          {...register("program")}
          options={[
            { value: "doctorado", label: "Doctorado" },
            { value: "maestria", label: "Maestría" },
          ]}
        />

        <FormInput
          label="Email (Opcional)"
          {...register("email")}
          error={errors.email}
        />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={
          editingId === -1 ? "Agregar Estudiante" : "Guardar Cambios"
        }
      />
    </form>
  );
};

export default StudentForm;
