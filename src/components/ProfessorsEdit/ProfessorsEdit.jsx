import React, { useState, useEffect } from "react";
import {
  fetchData,
  getItem,
  saveItem,
  addItem,
  deleteItem,
} from "../../firebase/CRUD";

const ProfessorsEdit = () => {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [Form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
  });
  const collection = "professors";
  const x = "profesor";

  useEffect(() => {
    fetchProfessors();
  }, [data]);

  const fetchProfessors = async () => {
    const Data = await fetchData(collection);

    const sortedData = Data.sort((a, b) =>
      (a.lastName || "").localeCompare(b.lastName || "")
    );

    setData(sortedData);
  };

  const handleEdit = async (data) => {
    window.scrollTo(0, 0);
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
    setForm({ firstName: "", lastName: "", email: "", title: "" });
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
        <h1 className="text-4xl font-bold mb-8">Editar Profesores</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-2 px-4 rounded mb-4"
        >
          Agregar Profesor Nuevo
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nombre:</label>
            <input
              name="firstName"
              value={Form.firstName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              name="lastName"
              value={Form.lastName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              name="email"
              value={Form.email}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Título:</label>
            <input
              name="title"
              value={Form.title}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
          </button>
        </form>
        <hr className="my-8" />
        <h2 className="text-2xl font-bold mb-4">Profesores Existentes</h2>
        <div className="space-y-4">
          {data.map((prof, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p>
                  {prof.title} {prof.firstName} {prof.lastName}
                </p>
                <p>{prof.email}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(prof)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prof.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded"
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

export default ProfessorsEdit;
