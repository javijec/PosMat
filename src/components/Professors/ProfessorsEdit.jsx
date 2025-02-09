import React, { useState } from "react";
import fs from "fs";
import path from "path";
import professorsData from "../../files/professors.json";

const ProfessorsEdit = () => {
  const [professors, setProfessors] = useState(professorsData);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [professorForm, setProfessorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
  });

  const handleEdit = (index) => {
    setEditingIndex(index);
    setProfessorForm(professors[index]);
  };

  const handleDelete = (index) => {
    if (!window.confirm("¿Eliminar profesor?")) return;
    const newProfessors = professors.filter((_, i) => i !== index);
    setProfessors(newProfessors);
    saveProfessorsToFile(newProfessors);
  };

  const handleChange = (e) => {
    setProfessorForm({ ...professorForm, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setProfessorForm({ firstName: "", lastName: "", email: "", title: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProfessors =
      editingIndex === -1
        ? [...professors, professorForm]
        : professors.map((p, i) => (i === editingIndex ? professorForm : p));
    setProfessors(newProfessors);
    saveProfessorsToFile(newProfessors);
    setProfessorForm({ firstName: "", lastName: "", email: "", title: "" });
    setEditingIndex(-1);
  };

  const saveProfessorsToFile = (data) => {
    const filePath = path.resolve(__dirname, "../../files/professors.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    alert("Profesores guardados");
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Profesores</h1>
        <button onClick={handleAdd} className="bg-green-600 text-white py-2 px-4 rounded mb-4">
          Agregar Profesor Nuevo
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nombre:</label>
            <input
              name="firstName"
              value={professorForm.firstName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              name="lastName"
              value={professorForm.lastName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              name="email"
              value={professorForm.email}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Título:</label>
            <input
              name="title"
              value={professorForm.title}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
          </button>
        </form>
        <hr className="my-8" />
        <h2 className="text-2xl font-bold mb-4">Profesores Existentes</h2>
        <div className="space-y-4">
          {professors.map((prof, index) => (
            <div key={index} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p>
                  {prof.title} {prof.firstName} {prof.lastName}
                </p>
                <p>{prof.email}</p>
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

export default ProfessorsEdit;
