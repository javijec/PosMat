import React from "react";
import FormField from "./FormField";

const FormTextarea = React.forwardRef(
  ({ label, error, className = "", rows = 4, ...props }, ref) => {
    return (
      <FormField label={label} error={error} className={className}>
        <textarea
          ref={ref}
          rows={rows}
          {...props}
          className={`w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-main)] border rounded-md focus:ring-2 focus:ring-[var(--color-ingenieria)] focus:border-[var(--color-ingenieria)] outline-none transition-all placeholder:text-[var(--text-main)]/30 resize-y ${
            error
              ? "border-red-500 ring-1 ring-red-500"
              : "border-[var(--border-subtle)]"
          }`}
        />
      </FormField>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
