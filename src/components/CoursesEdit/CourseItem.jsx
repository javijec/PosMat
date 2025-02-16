import React from "react";

const CourseItem = ({ course, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">
          {course.nombre}-{course.año}-{course.semestre} semestre
        </h3>
        <p className="text-gray-600">
          {course.horasTeoricas} HT, {course.horasPracticas} HP, {course.horasTP} HT-HP, {course.uvacs} UVACS
        </p>
        {course.fechaInicio && <p className="text-gray-600">Inicio: {course.fechaInicio}</p>}
        {course.lugar && <p className="text-gray-600">Lugar: {course.lugar}</p>}
        {course.profesores && course.profesores.length > 0 && (
          <ul className="list-disc pl-5 text-gray-600">
            {course.profesores.map((prof, i) => (
              <li key={i}>
                {prof.nombre} {prof.email && <span>({prof.email})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onEdit(course)} // Pasa el objeto course completo
          className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(course.id)} // Pasa el ID para eliminar
          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CourseItem;
