import React from "react";

const TesisCard = ({ tesis }) => {
  return (
    <li className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-subtle)] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-[var(--text-main)]">
          {tesis.year}
        </h4>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              tesis.tag === "doctorado"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {tesis.tag === "doctorado" ? "Doctorado" : "Maestría"}
          </span>
          {tesis.url && (
            <a
              href={tesis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40 transition-colors"
            >
              Resumen
            </a>
          )}
        </div>
      </div>
      <h3 className="text-lg font-medium text-[var(--text-main)] mb-1">
        {tesis.title}
      </h3>
      <p className="text-[var(--text-main)]/80 text-sm">Nombre: {tesis.name}</p>
      <p className="text-[var(--text-main)]/80 text-sm">
        Director: {tesis.director}
      </p>
      {tesis.co_director && (
        <p className="text-[var(--text-main)]/80 text-sm">
          Co-director: {tesis.co_director}
        </p>
      )}
    </li>
  );
};

export default TesisCard;
