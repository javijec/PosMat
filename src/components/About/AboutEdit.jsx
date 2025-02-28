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
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ title: "", content: "" });
  const [newAbout, setNewAbout] = useState({ title: "", content: "" });
  const collection = "about";

  useEffect(() => {
    loadAbouts();
  }, []);

  const loadAbouts = async () => {
    const data = await fetchData(collection);
    setData(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
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

  const handleEditClick = (about) => {
    setEditingId(about.id);
    setEditingForm({
      title: about.title,
      content: about.content.replace(/<br\s*\/?>/gi, "\n"),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingForm({ title: "", content: "" });
  };

  const handleChangeEditing = (e) => {
    setEditingForm({ ...editingForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedAbout = {
        title: editingForm.title,
        content: editingForm.content.replace(/\n/g, "<br/>"),
      };
      await saveItem(collection, editingId, updatedAbout, { merge: true });
      setEditingId(null);
      setEditingForm({ title: "", content: "" });
      loadAbouts();
    } catch (error) {
      console.error("Error updating About:", error);
    }
  };

  const handleAddNewAbout = async () => {
    if (!newAbout.title.trim() || !newAbout.content.trim()) {
      alert("Complete ambos campos para la nueva About.");
      return;
    }
    try {
      const newPosition =
        data.length > 0 ? Math.max(...data.map((f) => f.position || 0)) + 1 : 1;
      const aboutToAdd = {
        ...newAbout,
        content: newAbout.content.replace(/\n/g, "<br/>"),
        position: newPosition,
      };
      await addItem(collection, aboutToAdd);
      setNewAbout({ title: "", content: "" });
      loadAbouts();
    } catch (error) {
      console.error("Error adding new About:", error);
    }
  };

  // Funciones para mover About
  const handleMoveUp = async (about) => {
    const index = data.findIndex((f) => f.id === about.id);
    if (index > 0) {
      const prevAbout = data[index - 1];
      // Intercambiar posiciones
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
          prevabout.id,
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
        <h1 className="text-4xl font-bold mb-8">Editar about</h1>
        {/* Formulario para agregar nueva About */}
        <div className="mb-8 p-4 border rounded-md">
          <h2 className="text-xl mb-2">Agregar nueva about</h2>
          <input
            name="title"
            value={newAbout.title}
            onChange={(e) =>
              setNewAbout({ ...newAbout, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Pregunta"
          />
          <textarea
            name="content"
            value={newAbout.content}
            onChange={(e) =>
              setNewAbout({ ...newAbout, content: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 h-24"
            placeholder="Respuesta (usa saltos de línea, sin HTML)"
          />
          <button
            onClick={handleAddNewAbout}
            className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
          >
            Agregar About
          </button>
        </div>
        {/* Lista de About */}
        <div>
          {data.map((about) =>
            editingId === about.id ? (
              <div
                key={about.id}
                className="p-4 border rounded-md mb-4 bg-gray-50"
              >
                <input
                  name="title"
                  value={editingForm.title}
                  onChange={handleChangeEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Pregunta"
                />
                <textarea
                  name="content"
                  value={editingForm.content}
                  onChange={handleChangeEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 h-32"
                  placeholder="Respuesta (usa saltos de línea, sin HTML)"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center bg-blue-600 text-white py-1 px-3 rounded shadow hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 mr-1" />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center bg-gray-300 text-gray-800 py-1 px-3 rounded shadow hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={about.id}
                className="p-4 border rounded-md mb-4 bg-white"
              >
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutEdit;
