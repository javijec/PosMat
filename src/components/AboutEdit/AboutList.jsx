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
}) => {
  return (
    <div>
      {data.map((about) => (
        <div key={about.id} className="p-4 border rounded-md mb-4 bg-white">
          <h2 className="font-semibold text-lg">{about.title}</h2>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: about.content }}
          />
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleEditClick(about)}
              className="flex items-center bg-indigo-600 text-white py-1 px-2 rounded shadow hover:bg-indigo-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(about.id)}
              className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveUp(about)}
              className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveDown(about)}
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

export default AboutList;
