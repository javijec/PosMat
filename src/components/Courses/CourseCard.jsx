import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, index }) => {
  // Función para mostrar las horas solo si existen
  const getHoursDisplay = () => {
    const hours = [];
    if (course.horasTeoricas && course.horasTeoricas !== "0") {
      hours.push(`${course.horasTeoricas} Horas Teóricas`);
    }
    if (course.horasPracticas && course.horasPracticas !== "0") {
      hours.push(`${course.horasPracticas} Horas Prácticas`);
    }
    if (course.horasTP && course.horasTP !== "0") {
      hours.push(`${course.horasTP} Horas Teorico-Prácticas`);
    }
    return hours.length > 0 ? hours.join(", ") + ", " : "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{course.nombre}</h2>
        <p className="text-gray-600 mb-2">
          {getHoursDisplay()}
          {course.uvacs} UVACS
        </p>
        {course.fechaInicio && <p className="text-gray-600 mb-2">Inicio: {course.fechaInicio}</p>}
        {course.lugar && <p className="text-gray-600 mb-2">Lugar: {course.lugar}</p>}
        {course.profesores && course.profesores.length > 0 && (
          <div className="text-gray-600 mb-4">
            <p className="font-semibold">Profesor(es):</p>
            <ul className="list-disc ml-5">
              {course.profesores.map((prof, i) => (
                <li key={i}>
                  {prof.nombre}
                  {prof.email && `(${prof.email})`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link to={`/course/${index}`}>
          <button className="mt-4 w-full bg-ingenieria text-white py-2 px-4 rounded-lg hover:bg-ingenieria-hover transition-colors">
            Más Información
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
