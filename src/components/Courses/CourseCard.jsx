import { motion } from "framer-motion";
import { Clock, MapPin, Users, Calendar } from "lucide-react";

const CourseCard = ({ course, index }) => {
  const getHoursDisplay = () => {
    const hours = [];
    if (course.horasTeoricas && course.horasTeoricas !== "0") {
      hours.push(`${course.horasTeoricas}h Teóricas`);
    }
    if (course.horasPracticas && course.horasPracticas !== "0") {
      hours.push(`${course.horasPracticas}h Prácticas`);
    }
    if (course.horasTP && course.horasTP !== "0") {
      hours.push(`${course.horasTP}h Teorico-Prácticas`);
    }
    return hours.length > 0 ? hours.join(", ") : "";
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-[var(--bg-card)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[var(--border-subtle)] h-full flex flex-col relative group"
    >
      {course.humanistico && (
        <div className="absolute top-4 right-4 bg-teal-100 text-teal-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md z-10">
          Humanístico
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center text-xs font-semibold text-teal-600 mb-2 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {course.año}
          </div>
          <h2 className="text-xl font-bold text-[var(--text-main)] line-clamp-2 leading-tight group-hover:text-ingenieria transition-colors">
            {course.nombre}
          </h2>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center text-[var(--text-main)]/70">
            <Clock className="w-4 h-4 mr-3 text-ingenieria shrink-0" />
            <span className="text-sm font-medium">
              {getHoursDisplay()} {course.uvacs && `• ${course.uvacs} UVACS`}
            </span>
          </div>

          {course.lugar && (
            <div className="flex items-center text-[var(--text-main)]/70">
              <MapPin className="w-4 h-4 mr-3 text-ingenieria shrink-0" />
              <span className="text-sm">{course.lugar}</span>
            </div>
          )}

          {course.profesores && course.profesores.length > 0 && (
            <div className="flex items-start text-[var(--text-main)]/70">
              <Users className="w-4 h-4 mr-3 text-ingenieria mt-0.5 shrink-0" />
              <div className="text-sm leading-relaxed">
                {course.profesores.map((prof) => prof.nombre).join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
