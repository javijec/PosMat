import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import MenuBar from "./MenuBar";

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
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues,
  });

  const content = watch("content");

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
    content: defaultValues.content,
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  // Update form and editor when defaultValues change (e.g., clicking edit)
  useEffect(() => {
    reset(defaultValues);
    if (editor) {
      editor.commands.setContent(defaultValues.content);
    }
  }, [defaultValues, reset, editor]);

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
        <div
          className={`border rounded-md overflow-hidden ${
            errors.content ? "border-red-500" : "border-gray-300"
          }`}
        >
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className="prose max-w-none min-h-[200px] p-4 focus:outline-none"
          />
        </div>
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
        >
          {isSubmitting
            ? "Guardando..."
            : editingId === -1
            ? "Agregar About"
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

export default AboutForm;
