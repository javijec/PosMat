import React, { useState, useEffect } from "react";

import { getTesis } from "../../firebase/CRUD";
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/dbConnection";
import TesisEditItem from "./TesisEditItem";

const TesisEdit = () => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tesisForm, setTesisForm] = useState({
    year: "",
    name: "",
    title: "",
    url: "",
    director: "",
    co_director: "",
    tag: "maestria",
  });
  const [tesisList, setTesis] = useState([]);

  useEffect(() => {
    fetchTesis();
  }, []);

  const fetchTesis = async () => {
    const tesisData = await getTesis();
    setTesis(tesisData);
  };

  const handleEdit = async (data) => {
    try {
      setEditingIndex(data.id);
      getDoc(doc(db, "tesis", data.id));
    } catch (error) {
      setEditingIndex(data.id);
    }

    setTesisForm(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar tesis?")) return;
    try {
      await deleteDoc(doc(db, "tesis", id));
      fetchTesis();
    } catch (error) {
      console.log("Error deleting tesis: ", error);
    }
  };

  const handleChange = (e) => {
    setTesisForm({ ...tesisForm, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setTesisForm({
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
        await addDoc(collection(db, "tesis"), tesisForm);
        alert("Tesis agregado a Firestore");
      } else {
        await setDoc(doc(db, "tesis", editingIndex), tesisForm, { merge: true });
        alert("Tesis actualizado en Firestore");
        setEditingIndex(-1);
      }
      fetchTesis();
      handleAdd();
    } catch (error) {
      console.error("Error adding/updating tesis:", error);
    }
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
              value={tesisForm.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label>Nombre:</label>
            <input
              name="name"
              value={tesisForm.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label>Título:</label>
            <input
              name="title"
              value={tesisForm.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label>URL:</label>
            <input
              name="url"
              value={tesisForm.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label>Director:</label>
            <input
              name="director"
              value={tesisForm.director}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label>Co-Director:</label>
            <input
              name="co_director"
              value={tesisForm.co_director}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label>Tag:</label>
            <select
              name="tag"
              value={tesisForm.tag}
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
          {tesisList.map((t, index) => (
            <TesisEditItem t={t} handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TesisEdit;
