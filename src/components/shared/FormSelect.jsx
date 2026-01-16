import React from "react";
import FormField from "./FormField";

const FormSelect = React.forwardRef(
  ({ label, error, options = [], className = "", ...props }, ref) => {
    return (
      <FormField label={label} error={error} className={className}>
        <select
          ref={ref}
          {...props}
          className={`w-full px-4 py-2 border border-[var(--border-subtle)] rounded-full focus:ring-2 focus:ring-[var(--color-ingenieria)] focus:border-[var(--color-ingenieria)] focus:outline-none transition-all shadow-sm bg-[var(--bg-card)] text-[var(--text-main)] cursor-pointer ${
            error ? "border-red-500 ring-1 ring-red-500" : ""
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
