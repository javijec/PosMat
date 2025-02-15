import React, { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import coursesjson from "../../files/courses.json";
import { db } from "../../firebase/dbConnection";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const CoursesEdit = () => {
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [courseForm, setCourseForm] = useState({
    nombre: "",
    horasTeoricas: "",
    horasPracticas: "",
    horasTP: "",
    uvacs: "",
    profesores: [], // { nombre, email }
    fechaInicio: "",
    lugar: "",
  });
  // Estados para agregar profesor(s)
  const [profesorNombre, setProfesorNombre] = useState("");
  const [profesorEmail, setProfesorEmail] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await getDocs(collection(db, "courses"));
        setCourses(data.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(coursesjson); // Si hay un error, usa los datos locales
      }
    };

    getCourses();
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setCourseForm(courses[index]);
  };

  const handleDelete = (index) => {
    if (!window.confirm("¿Eliminar curso?")) return;
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
    // Actualiza courses.json en el filesystem
    saveCoursesToFile(newCourses);
  };

  const handleChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleAddProfessor = () => {
    if (profesorNombre.trim() && profesorEmail.trim()) {
      const nuevosProfesores = [...courseForm.profesores, { nombre: profesorNombre, email: profesorEmail }];
      setCourseForm({ ...courseForm, profesores: nuevosProfesores });
      setProfesorNombre("");
      setProfesorEmail("");
    }
  };

  const handleRemoveProfessor = (index) => {
    const nuevosProfesores = courseForm.profesores.filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, profesores: nuevosProfesores });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setCourseForm({
      nombre: "",
      horasTeoricas: "",
      horasPracticas: "",
      horasTP: "",
      uvacs: "",
      profesores: [],
      fechaInicio: "",
      lugar: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newCourses;
    if (editingIndex === -1) {
      newCourses = [...courses, courseForm];
    } else {
      newCourses = courses.map((c, index) => (index === editingIndex ? courseForm : c));
    }
    setCourses(newCourses);
    // Actualiza courses.json en el filesystem
    saveCoursesToFile(newCourses);
    // Reinicia formulario
    setCourseForm({
      nombre: "",
      horasTeoricas: "",
      horasPracticas: "",
      horasTP: "",
      uvacs: "",
      profesores: [],
      fechaInicio: "",
      lugar: "",
    });
    setEditingIndex(-1);
  };

  const saveCoursesToFile = (courses) => {
    const filePath = path.resolve(__dirname, "../files/courses.json");
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2), "utf-8");
    alert("Cursos guardados en filesystem");
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
            <label className="block text-sm font-medium text-gray-700">Nombre del Curso</label>
            <input
              name="nombre"
              value={courseForm.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Horas Teóricas</label>
              <input
                name="horasTeoricas"
                value={courseForm.horasTeoricas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horas Prácticas</label>
              <input
                name="horasPracticas"
                value={courseForm.horasPracticas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horas Teórico-Prácticas</label>
              <input
                name="horasTP"
                value={courseForm.horasTP}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UVACS</label>
            <input
              name="uvacs"
              value={courseForm.uvacs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Profesor(es) y Mail de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Profesor</label>
                <input
                  value={profesorNombre}
                  onChange={(e) => setProfesorNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mail de Contacto</label>
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
            {courseForm.profesores.length > 0 && (
              <ul className="mt-4 list-disc pl-5 text-gray-700">
                {courseForm.profesores.map((prof, index) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                name="fechaInicio"
                value={courseForm.fechaInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lugar de Cursada</label>
              <input
                name="lugar"
                value={courseForm.lugar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
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
          {console.log(courses)}
          {courses.map((course, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{course.nombre}</h3>
                <p className="text-gray-600">
                  {course.id}
                  {course.horasTeoricas} HT, {course.horasPracticas} HP, {course.horasTP} HT-HP, {course.uvacs} UVACS
                </p>
                {course.fechaInicio && <p className="text-gray-600">Inicio: {course.fechaInicio}</p>}
                {course.lugar && <p className="text-gray-600">Lugar: {course.lugar}</p>}
                {course.profesores && course.profesores.length > 0 && (
                  <ul className="list-disc pl-5 text-gray-600">
                    {course.profesores.map((prof, i) => (
                      <li key={i}>
                        {prof.nombre} ({prof.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
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

export default CoursesEdit;
