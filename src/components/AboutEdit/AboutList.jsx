import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const AboutList = ({
  data,
  handleEditClick,
  handleDelete,
  handleMoveUp,
  handleMoveDown,
  isReordering,
}) => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        Lista de Secciones
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-500 italic">No hay secciones todavía.</p>
      ) : (
        <div className="space-y-4">
          {data.map((about) => (
            <div
              key={about.id}
              className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="font-bold text-xl text-gray-900 border-b pb-2 mb-4">
                {about.title}
              </h2>
              <div
                className="prose max-w-none text-gray-600 [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-6 [&_ul]:ml-6"
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
              <div className="mt-6 pt-4 border-t flex space-x-3">
                <button
                  onClick={() => handleEditClick(about)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(about.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => handleMoveUp(about)}
                  disabled={isReordering}
                  className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors disabled:opacity-30"
                  title="Subir"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveDown(about)}
                  disabled={isReordering}
                  className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors disabled:opacity-30"
                  title="Bajar"
                >
                  <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutList;
