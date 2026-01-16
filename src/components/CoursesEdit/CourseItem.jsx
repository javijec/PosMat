import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const CourseItem = ({ course, onEdit, onDelete }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              course.humanistico
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {course.humanistico ? "Humanístico" : "Científico"}
          </span>
          <span className="text-sm font-semibold text-indigo-600">
            {course.año} - {course.semestre === 1 ? "1er" : "2do"} Semestre
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.nombre}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
          {course.horasTeoricas > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Teóricas</span>
              <span className="font-medium text-gray-800">
                {course.horasTeoricas}h
              </span>
            </div>
          )}
          {course.horasPracticas > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Prácticas</span>
              <span className="font-medium text-gray-800">
                {course.horasPracticas}h
              </span>
            </div>
          )}
          {course.horasTP > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Teórico-Prác.</span>
              <span className="font-medium text-gray-800">
                {course.horasTP}h
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">UVACS</span>
            <span className="font-medium text-indigo-700">{course.uvacs}</span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-500">
          {course.fechaInicio && (
            <p className="flex items-center">
              <span className="w-16 font-medium text-gray-400 uppercase text-[10px]">
                Inicio:
              </span>
              {course.fechaInicio}
            </p>
          )}
          {course.lugar && (
            <p className="flex items-center">
              <span className="w-16 font-medium text-gray-400 uppercase text-[10px]">
                Lugar:
              </span>
              {course.lugar}
            </p>
          )}
        </div>

        {course.profesores && course.profesores.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Plantel Docente
            </p>
            <div className="flex flex-wrap gap-2">
              {course.profesores.map((prof, i) => (
                <div
                  key={i}
                  className="bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-100"
                >
                  {prof.nombre}{" "}
                  {prof.email && (
                    <span className="text-gray-400 italic">
                      {" "}
                      - {prof.email}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 md:mt-0 md:ml-6 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
        <button
          onClick={() => onEdit(course)}
          className="flex-1 md:flex-none p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
          title="Editar Curso"
        >
          <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          title="Eliminar Curso"
        >
          <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseItem;
