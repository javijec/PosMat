import React from "react";

const TesisForm = ({ Form, handleChange, handleSubmit, editingIndex }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Año:</label>
        <input
          name="year"
          value={Form.year}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label>Nombre:</label>
        <input
          name="name"
          value={Form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label>Título:</label>
        <input
          name="title"
          value={Form.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label>URL:</label>
        <input
          name="url"
          value={Form.url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label>Director:</label>
        <input
          name="director"
          value={Form.director}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label>Co-Director:</label>
        <input
          name="co_director"
          value={Form.co_director}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label>Tag:</label>
        <select
          name="tag"
          value={Form.tag}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="maestria">Maestría</option>
          <option value="doctoral">Doctorado</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
      </button>
    </form>
  );
};

export default TesisForm;
