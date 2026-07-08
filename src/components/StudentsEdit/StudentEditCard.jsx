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
        students.map((student) => {
          const imageUrl = student.imageUrl || student.photoUrl || "";

          return (
            <div
              key={student.id}
              className="p-6 bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)]/30">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Foto de ${student.firstName} ${student.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon
                        icon={faUserGraduate}
                        className="text-xl"
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        Foto
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        student.program === "maestria"
                          ? "border border-sky-200 bg-sky-50 text-sky-800"
                          : "border border-teal-200 bg-teal-50 text-teal-800"
                      }`}
                    >
                      {student.program === "maestria"
                        ? "Maestría"
                        : "Doctorado"}
                    </span>
                  </div>

                  <h3 className="mb-3 flex items-center text-xl font-bold text-[var(--text-main)]">
                    <FontAwesomeIcon
                      icon={faUserGraduate}
                      className="mr-2 text-lg text-[var(--color-ingenieria)]"
                    />
                    {student.firstName} {student.lastName}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div className="flex items-start rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="mr-3 mt-1 text-[var(--color-ingenieria)]/70"
                      />
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ingenieria)]/80">
                          Tema de Tesis
                        </span>
                        <p className="font-medium leading-tight text-[var(--text-main)]">
                          {student.thesis_topic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <FontAwesomeIcon
                        icon={faChalkboardTeacher}
                        className="mr-3 mt-1 text-[var(--color-ingenieria)]/70"
                      />
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ingenieria)]/80">
                          Dirección
                        </span>
                        <p className="text-sm text-[var(--text-main)]">
                          <span className="font-semibold">
                            {student.director}
                          </span>
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
                    <p className="mt-3 flex items-center text-wrap break-all text-sm text-[var(--text-main)]/50">
                      <span className="mr-2 shrink-0 text-xs font-bold uppercase text-[var(--color-ingenieria)]/80">
                        Email:
                      </span>
                      {student.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex w-full space-x-2 md:mt-0 md:ml-6 md:w-auto md:flex-col md:space-x-0 md:space-y-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 transition-colors hover:bg-amber-500/20 md:flex-none"
                  title="Editar Estudiante"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="flex-1 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-600 transition-colors hover:bg-red-500/20 md:flex-none"
                  title="Eliminar Estudiante"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentsEditCard;
