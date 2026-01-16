import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const RulesList = ({
  data,
  onEditClick,
  onDelete,
  onMoveUp,
  onMoveDown,
  isReordering,
}) => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        Reglamentos Actuales
      </h3>
      {data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-500 italic">
            No hay reglamentos registrados todavía.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((rule) => (
            <div
              key={rule.id}
              className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h2 className="font-bold text-xl text-gray-900 border-b pb-3 mb-4">
                {rule.title}
              </h2>
              <div
                className="mt-2 prose max-w-none text-gray-600 [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-6 [&_ul]:ml-6"
                dangerouslySetInnerHTML={{ __html: rule.html }}
              />
              <div className="mt-6 pt-4 border-t flex space-x-3">
                <button
                  onClick={() => onEditClick(rule)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(rule.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => onMoveUp(rule)}
                  disabled={isReordering}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-30"
                  title="Subir"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onMoveDown(rule)}
                  disabled={isReordering}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-30"
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

export default RulesList;
