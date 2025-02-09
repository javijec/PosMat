import React from "react";
import studentsData from "../../files/students.json";

const Students = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Estudiantes de Posgrado</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Programa</th>
              <th className="px-6 py-4 text-left font-semibold">Director</th>
              <th className="px-6 py-4 text-left font-semibold">Codirector</th>
              <th className="px-6 py-4 text-left font-semibold">Tema de Tesis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {studentsData.students.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4">{student.program === "doctorado" ? "Doctorado" : "Maestría"}</td>
                <td className="px-6 py-4">{student.director}</td>
                <td className="px-6 py-4">{student.codirector || "-"}</td>
                <td className="px-6 py-4">{student.thesis_topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
