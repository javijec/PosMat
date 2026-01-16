import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const CourseItem = ({ course, onEdit, onDelete }) => {
  return (
    <div className="p-6 bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              course.humanistico
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {course.humanistico ? "Humanístico" : "Científico"}
          </span>
          <span className="text-sm font-semibold text-[var(--color-ingenieria)]">
            {course.año} - {course.semestre === 1 ? "1er" : "2do"} Semestre
          </span>
        </div>

        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
          {course.nombre}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
          {course.horasTeoricas > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-main)]/40">
                Teóricas
              </span>
              <span className="font-medium text-[var(--text-main)]/80">
                {course.horasTeoricas}h
              </span>
            </div>
          )}
          {course.horasPracticas > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-main)]/40">
                Prácticas
              </span>
              <span className="font-medium text-[var(--text-main)]/80">
                {course.horasPracticas}h
              </span>
            </div>
          )}
          {course.horasTP > 0 && (
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text-main)]/40">
                Teórico-Prác.
              </span>
              <span className="font-medium text-[var(--text-main)]/80">
                {course.horasTP}h
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs text-[var(--text-main)]/40">UVACS</span>
            <span className="font-medium text-[var(--color-ingenieria)]">
              {course.uvacs}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-[var(--text-main)]/50">
          {course.fechaInicio && (
            <p className="flex items-center">
              <span className="w-16 font-medium text-[var(--text-main)]/40 uppercase text-[10px]">
                Inicio:
              </span>
              {course.fechaInicio}
            </p>
          )}
          {course.lugar && (
            <p className="flex items-center">
              <span className="w-16 font-medium text-[var(--text-main)]/40 uppercase text-[10px]">
                Lugar:
              </span>
              {course.lugar}
            </p>
          )}
        </div>

        {course.profesores && course.profesores.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-xs font-bold text-[var(--text-main)]/40 uppercase tracking-wider mb-2">
              Plantel Docente
            </p>
            <div className="flex flex-wrap gap-2">
              {course.profesores.map((prof, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-surface)] px-3 py-1 rounded-full text-xs text-[var(--text-main)]/80 border border-[var(--border-subtle)]"
                >
                  {prof.nombre}{" "}
                  {prof.email && (
                    <span className="text-[var(--text-main)]/40 italic">
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
          className="flex-1 md:flex-none p-2 bg-amber-500/10 text-amber-600 rounded-lg hover:bg-amber-500/20 transition-colors border border-amber-500/20"
          title="Editar Curso"
        >
          <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="flex-1 md:flex-none p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
          title="Eliminar Curso"
        >
          <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseItem;
