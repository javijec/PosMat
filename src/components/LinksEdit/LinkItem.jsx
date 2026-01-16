import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

const LinkItem = ({ link, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1">
        <h4 className="font-bold text-[var(--text-main)] flex items-center mb-1">
          {link.name}
        </h4>
        {link.description && (
          <p className="text-sm text-[var(--text-main)]/60 mb-2">
            {link.description}
          </p>
        )}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria-hover)] font-medium transition-colors"
        >
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="mr-1.5 text-[10px]"
          />
          {link.url}
        </a>
      </div>

      <div className="flex space-x-2 shrink-0 self-end sm:self-center">
        <button
          onClick={() => onEdit(link)}
          className="p-2 bg-amber-500/10 text-amber-600 rounded-lg hover:bg-amber-500/20 transition-colors border border-amber-500/20"
          title="Editar Link"
        >
          <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
          title="Eliminar Link"
        >
          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LinkItem;
