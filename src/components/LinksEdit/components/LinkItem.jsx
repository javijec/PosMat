import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const LinkItem = ({ link, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-md flex justify-between items-center">
      <span className="font-semibold">
        {link.name} ({link.category})
      </span>
      <div>
        <button
          onClick={() => onEdit(link)}
          className="mr-2 text-indigo-600 hover:underline"
        >
          <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="text-red-600 hover:underline"
        >
          <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LinkItem;
