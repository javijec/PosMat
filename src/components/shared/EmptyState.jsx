import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const variantStyles = {
  default: {
    icon: "text-[var(--text-main)]/30",
    title: "text-[var(--text-main)]",
    description: "text-[var(--text-main)]/55",
  },
  error: {
    icon: "text-red-500",
    title: "text-red-950",
    description: "text-red-700",
  },
};

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
  variant = "default",
}) => {
  const styles = variantStyles[variant] || variantStyles.default;
  const Icon = icon;
  const isFontAwesomeIcon = icon?.iconName || icon?.prefix;

  return (
    <div
      className={`rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-12 text-center shadow-sm transition-colors ${className}`}
    >
      {isFontAwesomeIcon ? (
        <FontAwesomeIcon
          icon={icon}
          className={`mb-3 text-4xl ${styles.icon}`}
        />
      ) : Icon ? (
        <Icon className={`mx-auto mb-3 h-10 w-10 ${styles.icon}`} aria-hidden="true" />
      ) : null}

      <h3 className={`text-lg font-semibold ${styles.title}`}>{title}</h3>
      {description ? (
        <p className={`mx-auto mt-2 max-w-lg text-sm leading-6 ${styles.description}`}>
          {description}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-[var(--color-ingenieria)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
