import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
// ...otras importaciones necesarias como estilos y utilidades...

const AboutForm = ({
  form,
  editingId,
  froalaOptions,
  setForm,
  handleSubmit,
  handleModelChange,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-md">
      <h2 className="text-xl mb-2">
        {editingId === -1 ? "Agregar nuevo About" : "Editar About"}
      </h2>
      <input
        name="title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
        placeholder="Título"
      />
      <FroalaEditor
        model={form.content}
        onModelChange={handleModelChange}
        config={froalaOptions}
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
      >
        {editingId === -1 ? "Agregar About" : "Guardar Cambios"}
      </button>
    </form>
  );
};

export default AboutForm;
