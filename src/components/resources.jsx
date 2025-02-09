import React, { useState } from "react";

const resources = [
  {
    name: "Modelo Informe anual",
    path: "/public/modelo_informe_anual.doc",
    type: "doc",
    tag: "formularios",
  },
  {
    name: "Planilla de Inscripción al doctorado",
    path: "/assets/formulario-inscripcio%cc%81n-doctorado-2021.docx",
    type: "docx",
    tag: "formularios",
  },
  {
    name: "Planilla de Inscripción a la maestría",
    path: "/assets/formulario-inscripci%c3%b3n-maestr%c3%ada-20212.docx",
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

const Resources = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const groupedResources = groupByTag(resources);

  const handlePreview = (path, type) => {
    setPreviewUrl(`${window.location.origin}${path}`);
    setPreviewType(type);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
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
                    <span className="text-lg font-medium text-gray-900">{resource.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {resource.type === "pdf" || resource.type === "docx" || resource.type === "doc" ? (
                      <button
                        onClick={() => handlePreview(resource.path, resource.type)}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Previsualizar
                      </button>
                    ) : null}
                    <a href={resource.path} download className="text-blue-600 hover:text-blue-700 font-semibold">
                      Descargar
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
              <button onClick={handleClosePreview} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                Cerrar
              </button>
              <a href={previewUrl} download className="absolute top-4 left-4 text-blue-600 hover:text-blue-800">
                Descargar
              </a>
              <h2 className="text-3xl font-bold mb-4">Previsualización</h2>
              <PdfViewerComponent document={previewUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
