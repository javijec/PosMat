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
        className="bg-[var(--color-ingenieria)] text-white py-2 px-6 rounded-md shadow-sm hover:bg-[var(--color-ingenieria-hover)] transition-colors disabled:opacity-50 font-medium"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-[var(--bg-surface)] text-[var(--text-main)] py-2 px-6 rounded-md border border-[var(--border-subtle)] shadow-sm hover:bg-[var(--bg-card)] transition-colors font-medium border border-transparent"
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
};

export default FormActions;
