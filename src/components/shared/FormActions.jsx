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
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-[var(--color-ingenieria)] px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[var(--color-ingenieria-hover)] disabled:opacity-50"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-2 font-medium text-[var(--text-main)] shadow-sm transition-colors hover:bg-[var(--bg-card)]"
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
};

export default FormActions;
