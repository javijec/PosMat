import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import MenuBar from "../AboutEdit/MenuBar";
import FormActions from "../shared/FormActions";

const faqSchema = z.object({
  question: z.string().min(1, "La pregunta es obligatoria"),
  answer: z.string().min(10, "La respuesta debe tener al menos 10 caracteres"),
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
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 underline",
        },
      }),
    ],
    content: defaultValues.answer,
    onUpdate: ({ editor }) => {
      setValue("answer", editor.getHTML(), { shouldValidate: true });
    },
  });

  useEffect(() => {
    reset(defaultValues);
    if (editor) {
      editor.commands.setContent(defaultValues.answer || "");
    }
  }, [defaultValues, reset, editor]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-8 p-6 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editingId === -1 ? "Agregar nueva FAQ" : "Editar FAQ"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pregunta
        </label>
        <input
          {...register("question")}
          className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.question ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ej: ¿Cómo me inscribo?"
        />
        {errors.question && (
          <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Respuesta
        </label>
        <div
          className={`border rounded-md overflow-hidden ${
            errors.answer ? "border-red-500" : "border-gray-300"
          }`}
        >
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className="prose max-w-none min-h-[200px] p-4 focus:outline-none [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4"
          />
        </div>
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
