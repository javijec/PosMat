import React from "react";

const FormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default FormField;
