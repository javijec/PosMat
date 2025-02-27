import React, { useState, useEffect } from "react";
import CourseItem from "./CourseItem";
import {
  fetchData,
  getItem,
  saveItem,
  addItem,
  deleteItem,
} from "../../firebase/CRUD";

const CoursesEdit = () => {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [Form, setForm] = useState({
    nombre: "",
    horasTeoricas: "",
    horasPracticas: "",
    horasTP: "",
    uvacs: "",
    profesores: [],
    fechaInicio: "",
    lugar: "",
  });
  const [profesorNombre, setProfesorNombre] = useState("");
  const [profesorEmail, setProfesorEmail] = useState("");
  const collection = "courses";
  const x = "curso";

  useEffect(() => {
    fetchCourses();
  }, [data]);

  const fetchCourses = async () => {
    const Data = await fetchData(collection);
    setData(Data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar ` + x + ` ?`)) return;
    try {
      await deleteItem(collection, id);
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
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

  const handleChange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };

  const handleAddProfessor = () => {
    if (profesorNombre.trim()) {
      const nuevosProfesores = [
        ...Form.profesores,
        { nombre: profesorNombre, email: profesorEmail },
      ];
      setForm({ ...Form, profesores: nuevosProfesores });
      setProfesorNombre("");
      setProfesorEmail("");
    }
  };

  const handleRemoveProfessor = (index) => {
    const nuevosProfesores = Form.profesores.filter((_, i) => i !== index);
    setForm({ ...Form, profesores: nuevosProfesores });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setForm({
      nombre: "",
      horasTeoricas: "",
      horasPracticas: "",
      horasTP: "",
      uvacs: "",
      profesores: [],
      fechaInicio: "",
      lugar: "",
      semestre: 1,
      año: "",
      humanistico: false,
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
      fetchData();
      handleAdd();
    } catch (error) {
      console.error("Error adding/updating " + x + ":", error);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Cursos</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-green-700 transition-colors"
        >
          Agregar Curso Nuevo
        </button>
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Curso
            </label>
            <input
              name="nombre"
              value={Form.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horas Teóricas
              </label>
              <input
                name="horasTeoricas"
                value={Form.horasTeoricas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horas Prácticas
              </label>
              <input
                name="horasPracticas"
                value={Form.horasPracticas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horas Teórico-Prácticas
              </label>
              <input
                name="horasTP"
                value={Form.horasTP}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                UVACS
              </label>
              <input
                name="uvacs"
                value={Form.uvacs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Año
              </label>
              <input
                name="año"
                value={Form.año}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Semestre
              </label>
              <select
                name="semeste"
                value={Form.semestre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="1">1er Semestre</option>
                <option value="2">2do Semestre</option>
              </select>
            </div>
          </div>
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              Profesor(es) y Mail de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Profesor
                </label>
                <input
                  value={profesorNombre}
                  onChange={(e) => setProfesorNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mail de Contacto
                </label>
                <input
                  value={profesorEmail}
                  onChange={(e) => setProfesorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddProfessor}
              className="mt-2 bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 transition-colors"
            >
              Agregar Profesor
            </button>
            {Form.profesores.length > 0 && (
              <ul className="mt-4 list-disc pl-5 text-gray-700">
                {Form.profesores.map((prof, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {prof.nombre} ({prof.email})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProfessor(index)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                name="fechaInicio"
                value={Form.fechaInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lugar de Cursada
              </label>
              <input
                name="lugar"
                value={Form.lugar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Humanistico
              </label>
              <select
                name="humanistico"
                value={Form.humanistico}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={false}
              >
                <option value="false">No</option>
                <option value="true">Si</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingIndex === -1 ? "Agregar Curso" : "Guardar Cambios"}
          </button>
        </form>
        <hr className="mb-8" />
        <h2 className="text-2xl font-bold mb-4">Cursos Existentes</h2>
        <div className="space-y-4">
          {data.map((course, index) => (
            <CourseItem
              key={course.id} // Usa el ID del curso como key
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesEdit;
