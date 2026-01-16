import React from "react";
import FormField from "./FormField";

const FormInput = React.forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <FormField label={label} error={error} className={className}>
        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-2 bg-[var(--bg-card)] text-[var(--text-main)] border rounded-md focus:ring-2 focus:ring-[var(--color-ingenieria)] focus:border-[var(--color-ingenieria)] outline-none transition-all placeholder:text-[var(--text-main)]/30 ${
            error
              ? "border-red-500 ring-1 ring-red-500"
              : "border-[var(--border-subtle)]"
          }`}
        />
      </FormField>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
