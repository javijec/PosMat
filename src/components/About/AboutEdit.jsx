import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const AboutEdit = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(-1);
  const collection = "about";

  useEffect(() => {
    loadAbouts();
  }, []);

  const loadAbouts = async () => {
    const abouts = await fetchData(collection);
    setData(abouts.sort((a, b) => (a.position || 0) - (b.position || 0)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Complete ambos campos.");
      return;
    }
    try {
      if (editingId === -1) {
        const newPosition =
          data.length > 0
            ? Math.max(...data.map((f) => f.position || 0)) + 1
            : 1;
        const aboutToAdd = {
          ...form,
          content: form.content,
          position: newPosition,
        };
        await addItem(collection, aboutToAdd);
      } else {
        const updatedAbout = {
          title: form.title,
          content: form.content,
        };
        await saveItem(collection, editingId, updatedAbout, { merge: true });
      }
      setForm({ title: "", content: "" });
      setEditingId(-1);
      loadAbouts();
    } catch (error) {
      console.error("Error guardando About:", error);
    }
  };

  const handleEditClick = (about) => {
    window.scrollTo(0, 0);
    setEditingId(about.id);
    setForm({
      title: about.title,
      content: about.content,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar About?")) return;
    try {
      await deleteItem(collection, id);
      loadAbouts();
    } catch (error) {
      console.error("Error deleting About:", error);
    }
  };

  const handleMoveUp = async (about) => {
    const index = data.findIndex((f) => f.id === about.id);
    if (index > 0) {
      const prevAbout = data[index - 1];
      const tempPos = about.position || 0;
      await Promise.all([
        saveItem(
          collection,
          about.id,
          { position: prevAbout.position },
          { merge: true }
        ),
        saveItem(
          collection,
          prevAbout.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadAbouts();
    }
  };

  const handleMoveDown = async (about) => {
    const index = data.findIndex((f) => f.id === about.id);
    if (index < data.length - 1) {
      const nextAbout = data[index + 1];
      const tempPos = about.position || 0;
      await Promise.all([
        saveItem(
          collection,
          about.id,
          { position: nextAbout.position },
          { merge: true }
        ),
        saveItem(
          collection,
          nextAbout.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadAbouts();
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar About</h1>
        {/* Formulario unificado para agregar/editar */}
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
          <textarea
            name="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Contenido"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
          >
            {editingId === -1 ? "Agregar About" : "Guardar Cambios"}
          </button>
        </form>
        {/* Lista de About */}
        <div>
          {data.map((about) => (
            <div key={about.id} className="p-4 border rounded-md mb-4 bg-white">
              <h2 className="font-semibold text-lg">{about.title}</h2>
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditClick(about)}
                  className="flex items-center bg-indigo-600 text-white py-1 px-2 rounded shadow hover:bg-indigo-700 transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(about.id)}
                  className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveUp(about)}
                  className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                >
                  <ArrowUpIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveDown(about)}
                  className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                >
                  <ArrowDownIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutEdit;
