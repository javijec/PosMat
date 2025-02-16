import React, { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import StudentsEditCard from "./StudentEditCard";
import { db } from "../../firebase/dbConnection";
import { getDocs, collection } from "firebase/firestore";
import { getStudents } from "../../firebase/CRUD";

const StudentsEdit = () => {
  const [students, setStudents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setStudentForm(students[index]);
  };

  const handleDelete = (index) => {
    if (!window.confirm("¿Eliminar estudiante?")) return;
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
    saveStudentsToFile(newStudents);
  };

  const handleChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setStudentForm({ firstName: "", lastName: "", email: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudents =
      editingIndex === -1 ? [...students, studentForm] : students.map((s, i) => (i === editingIndex ? studentForm : s));
    setStudents(newStudents);
    saveStudentsToFile(newStudents);
    setStudentForm({ firstName: "", lastName: "", email: "" });
    setEditingIndex(-1);
  };

  const saveStudentsToFile = (data) => {
    const filePath = path.resolve(__dirname, "../../files/students.json");
    fs.writeFileSync(filePath, JSON.stringify({ students: data }, null, 2), "utf-8");
    alert("Estudiantes guardados");
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Estudiantes</h1>
        <button onClick={handleAdd} className="bg-green-600 text-white py-2 px-4 rounded mb-4">
          Agregar Estudiante Nuevo
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nombre:</label>
            <input
              name="firstName"
              value={studentForm.firstName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              name="lastName"
              value={studentForm.lastName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label>Director:</label>
            <input
              name="director"
              value={studentForm.director}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Codirector:</label>
            <input
              name="codirector"
              value={studentForm.codirector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Tema de Tesis:</label>
            <input
              name="thesis_topic"
              value={studentForm.thesis_topic}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Programa:</label>
            <input
              name="program"
              value={studentForm.program}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
          </button>
        </form>
        <hr className="my-8" />
        <h2 className="text-2xl font-bold mb-4">Estudiantes Existentes</h2>
        <StudentsEditCard students={students} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default StudentsEdit;
