import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const FAQList = ({
  faqs,
  handleEditClick,
  handleDelete,
  handleMoveUp,
  handleMoveDown,
}) => {
  return (
    <div>
      {faqs.map((faq) => (
        <div key={faq.id} className="p-4 border rounded-md mb-4 bg-white">
          <h2 className="font-semibold text-lg">{faq.question}</h2>
          <div
            className="mt-2 prose [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleEditClick(faq)}
              className="flex items-center bg-indigo-600 text-white py-1 px-2 rounded shadow hover:bg-indigo-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(faq.id)}
              className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveUp(faq)}
              className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveDown(faq)}
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

export default FAQList;
