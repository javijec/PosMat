import React, { useState, useEffect } from "react";
import {
  fetchData,
  getItem,
  saveItem,
  addItem,
  deleteItem,
} from "../../firebase/CRUD";

const LinksEdit = () => {
  // Cambiamos el estado "form" para representar un link individual
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    category: "",
  });
  const collection = "links";
  const x = "link";

  useEffect(() => {
    loadLinks();
  }, [data]);

  const loadLinks = async () => {
    const res = await fetchData(collection);
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar ${x}?`)) return;
    try {
      await deleteItem(collection, id);
      loadLinks();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = (item) => {
    window.scrollTo(0, 0);
    setEditingId(item.id);
    setForm(item);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewLink = () => {
    setEditingId(null);
    setForm({ name: "", url: "", description: "", category: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await saveItem(collection, editingId, form, { merge: true });
        alert(`${x} actualizado`);
      } else {
        await addItem(collection, form);
        alert(`${x} agregado`);
      }
      loadLinks();
      handleNewLink();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Links</h1>
        {/* Botón para agregar un link nuevo */}
        <div className="mb-4">
          <button
            onClick={handleNewLink}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Agregar Link Nuevo
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          {/* Campos para ingresar los datos del link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingId ? "Guardar Cambios" : "Agregar Link"}
          </button>
        </form>
        <hr className="mb-8" />
        <h2 className="text-2xl font-bold mb-4">Links Existentes</h2>
        <div className="space-y-4">
          {data.map((link) => (
            <div
              key={link.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <span className="font-semibold">
                {link.name} ({link.category})
              </span>
              <div>
                <button
                  onClick={() => handleEdit(link)}
                  className="mr-2 text-indigo-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinksEdit;
