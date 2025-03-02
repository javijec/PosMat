import React, { useState, useEffect } from "react";
import StudentsEditCard from "./StudentEditCard";
import {
  fetchData,
  getItem,
  saveItem,
  addItem,
  deleteItem,
} from "../../firebase/CRUD";

const StudentsEdit = () => {
  const [data, setStudents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [Form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    director: "",
    codirector: "",
    thesis_topic: "",
    program: "",
  });
  const collection = "students";
  const x = "estudiante";

  const [searchFullName, setSearchFullName] = useState("");
  const [searchProgram, setSearchProgram] = useState("");
  const [searchThesis, setSearchThesis] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [data, searchFullName, searchProgram, searchThesis]);

  const fetchStudents = async () => {
    const Data = await fetchData(collection);
    const sortedData = Data.sort((a, b) =>
      (a.lastName || "").localeCompare(b.lastName || "")
    );

    setStudents(sortedData);
  };

  const handleSearch = () => {
    let filtered = data;

    if (searchFullName) {
      filtered = filtered.filter((student) =>
        (student.firstName + " " + student.lastName)
          .toLowerCase()
          .includes(searchFullName.toLowerCase())
      );
    }
    if (searchProgram) {
      filtered = filtered.filter(
        (student) => student.program === searchProgram
      );
    }
    if (searchThesis) {
      filtered = filtered.filter((student) =>
        student.thesis_topic.toLowerCase().includes(searchThesis.toLowerCase())
      );
    }

    setFilteredData(filtered);
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
      fetchData(); //
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
      firstName: "",
      lastName: "",
      email: "",
      director: "",
      codirector: "",
      thesis_topic: "",
      program: "",
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
        <h1 className="text-4xl font-bold mb-8">Editar Estudiantes</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-2 px-4 rounded mb-4"
        >
          Agregar Estudiante Nuevo
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
            <label>Director:</label>
            <input
              name="director"
              value={Form.director}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Codirector:</label>
            <input
              name="codirector"
              value={Form.codirector}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Tema de Tesis:</label>
            <input
              name="thesis_topic"
              value={Form.thesis_topic}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Programa:</label>
            <select
              name="program"
              value={Form.program}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="doctorado">Doctorado</option>
              <option value="maestria">Maestría</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            {editingIndex === -1 ? "Agregar" : "Guardar Cambios"}
          </button>
        </form>

        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4">Buscar Estudiantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                type="text"
                value={searchFullName}
                onChange={(e) => setSearchFullName(e.target.value)}
                placeholder="Buscar por nombre o apellido..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Programa
              </label>
              <select
                value={searchProgram}
                onChange={(e) => setSearchProgram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                <option value="doctorado">Doctorado</option>
                <option value="maestria">Maestría</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tema de Tesis
              </label>
              <input
                type="text"
                value={searchThesis}
                onChange={(e) => setSearchThesis(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <hr className="my-8" />
        <h2 className="text-2xl font-bold mb-4">Estudiantes Existentes</h2>
        <StudentsEditCard
          students={filteredData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default StudentsEdit;
