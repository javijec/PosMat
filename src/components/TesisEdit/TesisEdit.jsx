import React, { useState, useEffect } from "react";
import TesisEditItem from "./TesisEditItem";
import { fetchData, getItem, saveItem, addItem, deleteItem } from "../../firebase/CRUD";

const TesisEdit = () => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [Form, setForm] = useState({
    year: "",
    name: "",
    title: "",
    url: "",
    director: "",
    co_director: "",
    tag: "maestria",
  });
  const [data, setData] = useState([]);
  const collection = "tesis";
  const x = "tesis";

  useEffect(() => {
    fetchTesis();
  }, [data]);

  const fetchTesis = async () => {
    const Data = await fetchData(collection);
    const tesisData = Data.map((doc) => ({
      id: doc.id,
      ...doc,
      year: Number(doc.year),
    }));

    tesisData.sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
    });

    setData(tesisData);
  };

  const handleEdit = async (data) => {
    const { id } = data;
    try {
      setEditingIndex(id);
      getItem(collection, id);
    } catch (error) {}
    setEditingIndex(id);

    setForm(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar ` + x + ` ?`)) return;
    try {
      await deleteItem(collection, id);
      fetchData(); // <-- Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setForm({
      year: "",
      name: "",
      title: "",
      url: "",
      director: "",
      co_director: "",
      tag: "maestria",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingIndex === -1) {
        await addItem(collection, Form);
        alert(x + " agregado");
      } else {
        await saveItem(collection, editingIndex, Form, { merge: true });
        alert(x + " actualizado");
        setEditingIndex(-1);
      }
    } catch (error) {
      console.error("Error adding/updating " + x + ":", error);
    }
    fetchData();
    handleAdd();
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Tesis</h1>
        <button onClick={handleAdd} className="bg-green-600 text-white py-2 px-4 rounded mb-4">
          Agregar Tesis Nueva
        </button>
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
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
          </button>
        </form>
        <hr className="my-8" />
        <h2 className="text-2xl font-bold mb-4">Tesis Existentes</h2>
        <div>
          {data.map((t, index) => (
            <TesisEditItem t={t} handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TesisEdit;
