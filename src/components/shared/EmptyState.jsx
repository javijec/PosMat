import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmptyState = ({ icon, title, description, className = "" }) => {
  return (
    <div
      className={`text-center py-12 bg-[var(--bg-surface)] rounded-xl border-2 border-dashed border-[var(--border-subtle)] transition-colors ${className}`}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="text-4xl text-[var(--text-main)]/30 mb-3"
        />
      )}
      <h3 className="text-lg font-medium text-[var(--text-main)]">{title}</h3>
      {description && (
        <p className="text-[var(--text-main)]/50 italic mt-1">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
