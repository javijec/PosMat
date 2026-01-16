import React from "react";

const FormActions = ({
  isSubmitting,
  onCancel,
  submitLabel = "Guardar Cambios",
  submittingLabel = "Guardando...",
  cancelLabel = "Cancelar",
  isEditing = true,
}) => {
  return (
    <div className="flex space-x-3 mt-8">
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 py-2 px-6 rounded-md shadow-sm hover:bg-gray-200 transition-colors font-medium"
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
};

export default FormActions;
