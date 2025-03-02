import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const resources = [
  {
    name: "Modelo Informe anual",
    path: "/assets/modelo_informe_anual.doc",
    type: "doc",
    tag: "formularios",
  },
  {
    name: "Planilla de Inscripción al doctorado",
    path: "/assets/formulario-inscripcion-doctorado-2021.docx",
    type: "docx",
    tag: "formularios",
  },
  {
    name: "Planilla de Inscripción a la maestría",
    path: "/assets/formulario-inscripcion-maestria-2021.docx",
    type: "docx",
    tag: "formularios",
  },
  {
    name: "Presentación de un nuevo curso de posgrado",
    path: "/assets/propuesta_nuevo_curso.doc",
    type: "doc",
    tag: "formularios",
  },
];

const groupByTag = (resources) => {
  return resources.reduce((acc, resource) => {
    const { tag } = resource;
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(resource);
    return acc;
  }, {});
};

const Archivos = () => {
  const groupedResources = groupByTag(resources);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">Recursos</h1>
        {Object.keys(groupedResources).map((tag) => (
          <div key={tag} className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{tag}</h2>
            <ul className="space-y-4">
              {groupedResources[tag].map((resource, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div>
                    <span className="text-lg font-medium text-gray-900">
                      {resource.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a
                      href={resource.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="bg-blue-500 text-white py-1 px-3 rounded"
                      />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archivos;
