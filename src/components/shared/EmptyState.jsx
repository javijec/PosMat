import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmptyState = ({ icon, title, description, className = "" }) => {
  return (
    <div
      className={`text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 ${className}`}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="text-4xl text-gray-300 mb-3" />
      )}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="text-gray-500 italic mt-1">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
