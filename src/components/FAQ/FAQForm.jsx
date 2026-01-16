import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RichTextEditor from "../shared/RichTextEditor";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import useConfirmExit from "../../hooks/useConfirmExit";

const faqSchema = z.object({
  question: z.string().min(1, "La pregunta es obligatoria"),
  answer: z.string().min(1, "La respuesta es obligatoria"),
});

const FAQForm = ({
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
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(faqSchema),
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
        {editingId === -1 ? "Agregar nueva FAQ" : "Editar FAQ"}
      </h2>

      <FormInput
        label="Pregunta"
        {...register("question")}
        error={errors.question}
        placeholder="Ej: ¿Cómo me inscribo?"
        className="mb-4"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Respuesta
        </label>
        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              error={errors.answer}
            />
          )}
        />
        {errors.answer && (
          <p className="text-red-500 text-xs mt-1">{errors.answer.message}</p>
        )}
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar FAQ" : "Guardar Cambios"}
      />
    </form>
  );
};

export default FAQForm;
