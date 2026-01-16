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
        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500 italic">
            No se encontraron estudiantes registrados.
          </p>
        </div>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    student.program === "maestria"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {student.program === "maestria" ? "Maestría" : "Doctorado"}
                </span>
                <span className="text-sm font-semibold text-gray-500">
                  ID: {student.id.slice(0, 5)}...
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faUserGraduate}
                  className="mr-2 text-indigo-500 text-lg"
                />
                {student.firstName} {student.lastName}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="mt-1 mr-3 text-indigo-400"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Tema de Tesis
                    </span>
                    <p className="text-gray-700 font-medium leading-tight">
                      {student.thesis_topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <FontAwesomeIcon
                    icon={faChalkboardTeacher}
                    className="mt-1 mr-3 text-indigo-400"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Dirección
                    </span>
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">{student.director}</span>
                      {student.codirector && student.codirector !== "-" && (
                        <span className="text-gray-500">
                          {" "}
                          / {student.codirector}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {student.email && (
                <p className="mt-3 text-sm text-gray-500 flex items-center text-wrap break-all">
                  <span className="text-xs font-bold text-gray-400 uppercase mr-2 shrink-0">
                    Email:
                  </span>
                  {student.email}
                </p>
              )}
            </div>

            <div className="mt-6 md:mt-0 md:ml-6 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 w-full md:w-auto">
              <button
                onClick={() => handleEdit(student)}
                className="flex-1 md:flex-none p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors border border-amber-100"
                title="Editar Estudiante"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
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
