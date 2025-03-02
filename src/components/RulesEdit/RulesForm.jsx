import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/froala_editor.pkgd.min.js";

const RulesForm = ({ form, setForm, editingId, onSubmit, onModelChange }) => {
  const froalaOptions = {
    toolbarButtons: [
      "bold",
      "italic",
      "underline",
      "subscript",
      "superscript",
      "align",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "quote",
      "insertLink",
      "emoticons",
      "specialCharacters",
      "undo",
      "redo",
      "clearFormatting",
    ],
  };

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
      <FroalaEditor
        model={form.html}
        onModelChange={onModelChange}
        config={froalaOptions}
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
      >
        {editingId === -1 ? "Agregar Reglamento" : "Guardar Cambios"}
      </button>
    </form>
  );
};

export default RulesForm;
