import React from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--text-main)]/70 mb-8">{message}</p>

        <div className="flex space-x-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-[var(--border-subtle)] text-[var(--text-main)]/80 rounded-lg hover:bg-[var(--bg-surface)] transition-colors font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md shadow-red-900/20"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
