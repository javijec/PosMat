import React from "react";
import FormField from "./FormField";

const FormInput = React.forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <FormField label={label} error={error} className={className}>
        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
