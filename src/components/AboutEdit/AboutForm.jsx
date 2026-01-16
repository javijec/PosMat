import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RichTextEditor from "../shared/RichTextEditor";
import FormActions from "../shared/FormActions";

const aboutSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
});

const AboutForm = ({
  editingId,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aboutSchema),
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
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {editingId === -1 ? "Agregar nuevo About" : "Editar About"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          {...register("title")}
          className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ej: Nuestra Misión"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contenido
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              error={errors.content}
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar About" : "Guardar Cambios"}
      />
    </form>
  );
};

export default AboutForm;
