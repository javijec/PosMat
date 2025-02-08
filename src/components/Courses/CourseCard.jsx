import React from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Users } from "lucide-react";

const CourseCard = ({ course, index }) => {
  const getHoursDisplay = () => {
    const hours = [];
    if (course.horasTeoricas && course.horasTeoricas !== "0") {
      hours.push(`${course.horasTeoricas} Horas Teóricas`);
    }
    if (course.horasPracticas && course.horasPracticas !== "0") {
      hours.push(`${course.horasPracticas} Horas Prácticas`);
    }
    if (course.horasTP && course.horasTP !== "0") {
      hours.push(`${course.horasTP} Horas Teorico-Prácticas`);
    }
    return hours.length > 0 ? hours.join(", ") + ", " : "";
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col relative">
      {/* Tag humanístico */}
      {course.humanistico && (
        <div className="absolute top-2 right-2 bg-ingenieria text-white text-xs font-semibold px-2 py-1 rounded-full">
          Humanístico
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* Contenedor del título con altura fija y padding extra para el tag */}
        <div className="h-[4.5rem] mb-4 pr-[5.5rem]">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{course.nombre}</h2>
        </div>

        {/* Contenedor de información con flex-1 */}
        <div className="flex-1">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
              <span className="text-sm">
                {getHoursDisplay()} {course.uvacs} UVACS
              </span>
            </div>

            {course.lugar && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
                <span className="text-sm">{course.lugar}</span>
              </div>
            )}

            {course.profesores && course.profesores.length > 0 && (
              <div className="flex items-start text-gray-600">
                <Users className="w-5 h-5 mr-2 text-ingenieria shrink-0" />
                <div className="text-sm">{course.profesores.map((prof) => prof.nombre).join(", ")}</div>
              </div>
            )}
          </div>
        </div>

        {/* Botón al final */}
        <Link
          to={`/course/${index}`}
          className="mt-6 block w-full bg-ingenieria text-white text-center py-2.5 px-4 rounded-lg hover:bg-ingenieria-hover transition-colors"
        >
          Más Información
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
