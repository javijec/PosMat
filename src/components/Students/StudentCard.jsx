import React from "react";
import { Camera, Mail, Users } from "lucide-react";

const getDirectorTitle = (value) => {
  const text = String(value || "").trim();
  if (/^\s*(directora|dra\.?)\b/i.test(text)) return "Directora:";
  if (/^\s*(director|dr\.?)\b/i.test(text)) return "Director:";
  return "Director:";
};

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col relative">
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-300">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={`Foto de ${student.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <Camera className="h-5 w-5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Foto
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
              {student.name}
            </h2>
          </div>
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
                <strong>{getDirectorTitle(student.director)}</strong> {student.director}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
              <span className="text-sm">
                <strong>Codirector:</strong> {student.codirector || "-"}
              </span>
            </div>

            {student.email && (
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
                <span className="text-sm break-all">
                  <strong>Email:</strong> {student.email}
                </span>
              </div>
            )}

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
