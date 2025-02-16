import React, { useState, useEffect } from "react";
import coursesjson from "../../files/courses.json";
import { db } from "../../firebase/dbConnection";
import CourseItem from "./CourseItem";
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";

const CoursesEdit = () => {
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [courseForm, setCourseForm] = useState({
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

  useEffect(() => {
    getCourses();
  }, []); // <-- Importante: El useEffect solo se ejecuta al montar el componente

  const getCourses = async () => {
    try {
      const data = await getDocs(collection(db, "courses"));
      const coursesData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      coursesData.sort((a, b) => parseInt(b.año) - parseInt(a.año));
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      const coursesData = [...coursesjson];
      coursesData.sort((a, b) => parseInt(b.año) - parseInt(a.año));
      setCourses(coursesData);
    }
  };

  const DeleteCourse = async (id) => {
    if (!window.confirm("¿Eliminar curso?")) return;
    try {
      await deleteDoc(doc(db, "courses", id));
      getCourses(); // <-- Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      setEditingIndex(data.id);
      getDoc(doc(db, "courses", data.id));
    } catch (error) {}
    setEditingIndex(data.id);

    setCourseForm(data);
  };

  const handleChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleAddProfessor = () => {
    if (profesorNombre.trim()) {
      // Crea un NUEVO array con los profesores existentes y el nuevo profesor
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editingIndex);

    try {
      if (editingIndex === -1) {
        await addDoc(collection(db, "courses"), courseForm);
        alert("Curso agregado a Firestore");
      } else {
        await setDoc(doc(db, "courses", editingIndex), courseForm, { merge: true });
        alert("Curso actualizado en Firestore");
        setEditingIndex(-1);
      }
      getCourses();
      setCourseForm({
        // Limpia el formulario
        nombre: "",
        horasTeoricas: "",
        horasPracticas: "",
        horasTP: "",
        uvacs: "",
        profesores: [],
        fechaInicio: "",
        lugar: "",
      });
    } catch (error) {
      console.error("Error adding/updating course:", error);
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
          {courses.map((course, index) => (
            <CourseItem
              key={course.id} // Usa el ID del curso como key
              course={course}
              onEdit={handleEdit}
              onDelete={DeleteCourse}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesEdit;
