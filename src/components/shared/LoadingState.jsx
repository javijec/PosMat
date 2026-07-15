const LoadingState = ({ label = "Cargando contenido…" }) => (
  <div
    className="flex min-h-64 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-12 text-center"
    role="status"
    aria-live="polite"
  >
    <div>
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-subtle)] border-t-[var(--color-ingenieria)]" />
      <p className="mt-4 text-sm font-medium text-[var(--text-main)]/65">{label}</p>
    </div>
  </div>
);

export default LoadingState;
