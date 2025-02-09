import React, { useState } from "react";
import fs from "fs";
import path from "path";
import tesisMaestriaData from "../../files/tesisMaestria.json";

const TesisMaestriaEdit = () => {
  const [tesisList, setTesisList] = useState(tesisMaestriaData);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [form, setForm] = useState({
    year: "",
    name: "",
    title: "",
    url: "",
    director: "",
    co_director: "",
    tag: "maestria",
  });

  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(tesisList[index]);
  };

  const handleDelete = (index) => {
    if (!window.confirm("¿Eliminar tesis?")) return;
    const newList = tesisList.filter((_, i) => i !== index);
    setTesisList(newList);
    saveToFile(newList);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setForm({ year: "", name: "", title: "", url: "", director: "", co_director: "", tag: "maestria" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newList =
      editingIndex === -1 ? [...tesisList, form] : tesisList.map((t, i) => (i === editingIndex ? form : t));
    setTesisList(newList);
    saveToFile(newList);
    handleAdd();
  };

  const saveToFile = (data) => {
    const filePath = path.resolve(__dirname, "../../files/tesisMaestria.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    alert("Tesis de maestría guardadas");
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Tesis de Maestría</h1>
        <button onClick={handleAdd} className="bg-green-600 text-white py-2 px-4 rounded mb-4">
          Agregar Tesis Nueva
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Año:</label>
            <input name="year" value={form.year} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label>Nombre:</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label>Título:</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>URL:</label>
            <input name="url" value={form.url} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label>Director:</label>
            <input
              name="director"
              value={form.director}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Co-Director:</label>
            <input
              name="co_director"
              value={form.co_director}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Tag:</label>
            <input
              name="tag"
              value={form.tag}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              readOnly
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
          </button>
        </form>
        <hr className="my-8" />
        <h2 className="text-2xl font-bold mb-4">Tesis Existentes</h2>
        <div>
          {tesisList.map((t, index) => (
            <div key={index} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p>
                  {t.title} - {t.name} ({t.year})
                </p>
                <p>Director: {t.director}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white py-1 px-3 rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(index)} className="bg-red-600 text-white py-1 px-3 rounded">
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

export default TesisMaestriaEdit;
