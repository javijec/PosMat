import React from "react";
import { Users } from "lucide-react";

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col relative">
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{student.name}</h2>
        </div>

        <div className="flex-1">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
              <span className="text-sm">
                <strong>Programa:</strong> {student.program === "doctorado" ? "Doctorado" : "Maestría"}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
              <span className="text-sm">
                <strong>Director:</strong> {student.director}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
              <span className="text-sm">
                <strong>Codirector:</strong> {student.codirector || "-"}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
              <span className="text-sm">
                <strong>Tema de Tesis:</strong> {student.thesis_topic}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
