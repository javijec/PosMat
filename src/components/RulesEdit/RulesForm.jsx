import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import MenuBar from "./MenuBar";

const RulesForm = ({ form, setForm, editingId, onSubmit, onModelChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
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
    content: form.html,
    onUpdate: ({ editor }) => {
      onModelChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && form.html !== editor.getHTML()) {
      editor.commands.setContent(form.html);
    }
  }, [form.html, editor]);

  return (
    <form onSubmit={onSubmit} className="mb-8 p-4 border rounded-md">
      <h2 className="text-xl mb-2">
        {editingId === -1 ? "Agregar nuevo reglamento" : "Editar reglamento"}
      </h2>
      <input
        name="title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
        placeholder="Título"
      />
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <MenuBar editor={editor} />
        <EditorContent
          editor={editor}
          className="prose min-h-[150px] p-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ol]:ml-4 [&_.ProseMirror_ul]:ml-4"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors mt-4"
      >
        {editingId === -1 ? "Agregar Reglamento" : "Guardar Cambios"}
      </button>
    </form>
  );
};

export default RulesForm;
