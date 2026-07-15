import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const isHumanistico = (value) => value === true || value === "true";

const CourseCard = ({ course }) => {
  const humanistico = isHumanistico(course.humanistico);

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
  const hoursDisplay = getHoursDisplay();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-[var(--bg-card)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[var(--border-subtle)] h-full flex flex-col relative group"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${humanistico ? "bg-teal-100 text-teal-700" : "bg-sky-100 text-sky-700"}`}>
              {humanistico ? "Humanístico" : "Científico"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-main)]/70">
              <Calendar className="h-3.5 w-3.5 text-ingenieria" />
              {course.año} · {course.semestre}.º semestre
            </span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-main)] line-clamp-2 leading-tight group-hover:text-ingenieria transition-colors">
            {course.nombre}
          </h2>
        </div>

        <div className="flex-1 space-y-3 text-sm text-[var(--text-main)]/72">
          {(hoursDisplay || course.uvacs) && (
            <div className="flex items-center">
              <Clock className="mr-3 h-4 w-4 shrink-0 text-ingenieria" />
              <span className="font-medium">
                {[hoursDisplay, course.uvacs && `${course.uvacs} UVACs`].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}

          {course.lugar && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-3 text-ingenieria shrink-0" />
              <span>{course.lugar}</span>
            </div>
          )}

          {course.profesores && course.profesores.length > 0 && (
            <div className="flex items-start">
              <Users className="w-4 h-4 mr-3 text-ingenieria mt-0.5 shrink-0" />
              <div className="leading-relaxed">
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
