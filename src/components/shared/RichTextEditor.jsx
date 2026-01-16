import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import MenuBar from "./MenuBar";

const RichTextEditor = ({ value, onChange, error }) => {
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
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div
      className={`border rounded-md overflow-hidden bg-white transition-all ${
        error
          ? "border-red-500 ring-1 ring-red-500"
          : "border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
      }`}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[200px] p-4 focus:outline-none [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4"
      />
    </div>
  );
};

export default RichTextEditor;
