import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const RulesList = ({ data, onEditClick, onDelete, onMoveUp, onMoveDown }) => {
  return (
    <div>
      {data.map((rule) => (
        <div key={rule.id} className="p-4 border rounded-md mb-4 bg-white">
          <h2 className="font-semibold text-lg">{rule.title}</h2>
          <div
            className="mt-2 prose [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4"
            dangerouslySetInnerHTML={{ __html: rule.html }}
          />
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEditClick(rule)}
              className="flex items-center bg-indigo-600 text-white py-1 px-2 rounded shadow hover:bg-indigo-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(rule.id)}
              className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
            <button
              onClick={() => onMoveUp(rule)}
              className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
            </button>
            <button
              onClick={() => onMoveDown(rule)}
              className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RulesList;
