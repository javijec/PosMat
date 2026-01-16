import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faUserGraduate,
  faBook,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";

const StudentsEditCard = ({ students, handleEdit, handleDelete }) => {
  return (
    <div className="space-y-4">
      {students.length === 0 ? (
        <div className="text-center py-10 bg-[var(--bg-surface)] rounded-lg border-2 border-dashed border-[var(--border-subtle)]">
          <p className="text-[var(--text-main)]/50 italic">
            No se encontraron estudiantes registrados.
          </p>
        </div>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
            className="p-6 bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    student.program === "maestria"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  }`}
                >
                  {student.program === "maestria" ? "Maestría" : "Doctorado"}
                </span>
                <span className="text-sm font-semibold text-[var(--text-main)]/40">
                  ID: {student.id.slice(0, 5)}...
                </span>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faUserGraduate}
                  className="mr-2 text-[var(--color-ingenieria)] text-lg"
                />
                {student.firstName} {student.lastName}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)]">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="mt-1 mr-3 text-[var(--color-ingenieria)]/70"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-[var(--text-main)]/40 uppercase tracking-wider">
                      Tema de Tesis
                    </span>
                    <p className="text-[var(--text-main)] font-medium leading-tight">
                      {student.thesis_topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)]">
                  <FontAwesomeIcon
                    icon={faChalkboardTeacher}
                    className="mt-1 mr-3 text-[var(--color-ingenieria)]/70"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-[var(--text-main)]/40 uppercase tracking-wider">
                      Dirección
                    </span>
                    <p className="text-[var(--text-main)] text-sm">
                      <span className="font-semibold">{student.director}</span>
                      {student.codirector && student.codirector !== "-" && (
                        <span className="text-[var(--text-main)]/50">
                          {" "}
                          / {student.codirector}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {student.email && (
                <p className="mt-3 text-sm text-[var(--text-main)]/50 flex items-center text-wrap break-all">
                  <span className="text-xs font-bold text-[var(--text-main)]/40 uppercase mr-2 shrink-0">
                    Email:
                  </span>
                  {student.email}
                </p>
              )}
            </div>

            <div className="mt-6 md:mt-0 md:ml-6 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 w-full md:w-auto">
              <button
                onClick={() => handleEdit(student)}
                className="flex-1 md:flex-none p-2 bg-amber-500/10 text-amber-600 rounded-lg hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                title="Editar Estudiante"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="flex-1 md:flex-none p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                title="Eliminar Estudiante"
              >
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentsEditCard;
