import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const TesisEditItem = ({ t, handleEdit, handleDelete }) => {
  return (
    <div
      key={t.id}
      className="p-4 bg-white rounded shadow flex justify-between items-center"
    >
      <div>
        <p>
          {t.title} - {t.year && <spam className="font-bold">({t.year})</spam>}
        </p>
        <p>{t.name}</p>
        <p>Director: {t.director}</p>
        {t.co_director && <p>Codirector: {t.co_director}</p>}

        <p>Tipo: {t.tag}</p>
      </div>
      <div className="space-x-2">
        <div>
          <button
            onClick={() => handleEdit(t)}
            className="bg-yellow-500 text-white py-1 px-3 rounded"
          >
            <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
          </button>
        </div>
        <div>
          <button
            onClick={() => handleDelete(t.id)}
            className="bg-red-600 text-white py-1 px-3 rounded"
          >
            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TesisEditItem;
