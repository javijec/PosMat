import React from "react";

const FormField = ({ label, error, children, className = "" }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;
