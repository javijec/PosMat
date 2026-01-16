import { motion } from "framer-motion";

const TesisCard = ({ tesis }) => {
  return (
    <motion.li
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-[var(--bg-card)] p-5 rounded-xl shadow-sm border border-[var(--border-subtle)] hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-ingenieria tracking-wide uppercase">
          {tesis.year}
        </span>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              tesis.tag === "doctorado"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
            }`}
          >
            {tesis.tag === "doctorado" ? "Doctorado" : "Maestría"}
          </span>
          {tesis.url && (
            <a
              href={tesis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40"
            >
              Resumen
            </a>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 leading-snug">
        {tesis.title}
      </h3>
      <div className="mt-auto space-y-1">
        <p className="text-[var(--text-main)] font-medium text-sm">
          <span className="text-[var(--text-main)]/60">Autor:</span>{" "}
          {tesis.name}
        </p>
        <p className="text-[var(--text-main)]/80 text-sm">
          <span className="text-[var(--text-main)]/60">Director:</span>{" "}
          {tesis.director}
        </p>
        {tesis.co_director && (
          <p className="text-[var(--text-main)]/80 text-sm">
            <span className="text-[var(--text-main)]/60">Co-director:</span>{" "}
            {tesis.co_director}
          </p>
        )}
      </div>
    </motion.li>
  );
};

export default TesisCard;
