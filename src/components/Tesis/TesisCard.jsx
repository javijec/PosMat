import React from "react";

const TesisCard = ({ tesis }) => {
  const getTagColor = (tag) => {
    switch (tag) {
      case "doctorado":
        return "bg-blue-100 text-blue-800";
      case "maestria":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <li className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-gray-900">{tesis.year}</h4>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${getTagColor(
              tesis.tag
            )}`}
          >
            {tesis.tag === "doctorado" ? "Doctorado" : "Maestría"}
          </span>
          {tesis.url && (
            <a
              href={tesis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              Ver resumen
            </a>
          )}
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{tesis.title}</h3>
      <p className="text-gray-700">Nombre: {tesis.name}</p>
      <p className="text-gray-700">Director: {tesis.director}</p>
      {tesis.co_director && (
        <p className="text-gray-700">Co-director: {tesis.co_director}</p>
      )}
    </li>
  );
};

export default TesisCard;
