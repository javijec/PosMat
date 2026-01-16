import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const TesisEditItem = ({ t, handleEdit, handleDelete }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              t.tag === "maestria"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {t.tag === "maestria" ? "Maestría" : "Doctorado"}
          </span>
          <span className="text-sm font-semibold text-gray-500">{t.year}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {t.title}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p className="flex items-center">
            <span className="w-16 font-medium text-gray-400 uppercase text-[10px]">
              Autor:
            </span>
            <span className="font-semibold">{t.name}</span>
          </p>
          <p className="flex items-center">
            <span className="w-16 font-medium text-gray-400 uppercase text-[10px]">
              Director:
            </span>
            {t.director}
          </p>
          {t.co_director && (
            <p className="flex items-center">
              <span className="w-16 font-medium text-gray-400 uppercase text-[10px]">
                Codir.:
              </span>
              {t.co_director}
            </p>
          )}
        </div>

        {t.url && (
          <a
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Ver documento completo
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <div className="mt-6 md:mt-0 md:ml-6 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
        <button
          onClick={() => handleEdit(t)}
          className="flex-1 md:flex-none p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
          title="Editar Tesis"
        >
          <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDelete(t.id)}
          className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          title="Eliminar Tesis"
        >
          <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TesisEditItem;
