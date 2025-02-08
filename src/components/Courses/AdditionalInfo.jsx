import React from "react";

const AdditionalInfo = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">Información Adicional</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Requisitos de Admisión</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Título universitario en áreas afines</li>
              <li>Curriculum Vitae actualizado</li>
              <li>Carta de motivación</li>
              <li>Dos cartas de recomendación</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Proceso de Inscripción</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Completar formulario de pre-inscripción</li>
              <li>Enviar documentación requerida</li>
              <li>Entrevista con el comité académico</li>
              <li>Confirmación de admisión</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
