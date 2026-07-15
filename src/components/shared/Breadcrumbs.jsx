import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [], className = "" }) => {
  const trail = [{ label: "Inicio", to: "/", icon: Home }, ...items];

  return (
    <nav
      aria-label="Ruta de navegación"
      className={`mb-4 overflow-x-auto ${className}`}
    >
      <ol className="flex min-w-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-[var(--text-main)]/60 sm:text-sm">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          const Icon = item.icon;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-[var(--text-main)]/35"
                  aria-hidden="true"
                />
              ) : null}

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-[var(--color-ingenieria)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-[var(--text-main)]"
                  aria-current={isLast ? "page" : undefined}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
