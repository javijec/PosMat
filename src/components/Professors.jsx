import React from "react";
import professors from "../files/professors.json";

const Professors = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Lista de Profesores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professors.map((prof, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <p className="font-semibold text-lg">{prof.name}</p>
              <p className="text-gray-600">{prof.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Professors;
