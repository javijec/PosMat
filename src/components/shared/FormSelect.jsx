import React from "react";
import FormField from "./FormField";

const FormSelect = React.forwardRef(
  ({ label, error, options = [], className = "", ...props }, ref) => {
    return (
      <FormField label={label} error={error} className={className}>
        <select
          ref={ref}
          {...props}
          className={`w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-sm bg-white cursor-pointer ${
            error ? "border-red-500" : ""
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
