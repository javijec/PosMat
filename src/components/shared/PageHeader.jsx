import React from "react";

const PageHeader = ({ eyebrow, icon: Icon, title, description, className = "" }) => (
  <header className={`mb-8 max-w-3xl ${className}`}>
    {eyebrow ? (
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ingenieria)]">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {eyebrow}
      </p>
    ) : null}
    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)] md:text-4xl">
      {title}
    </h1>
    {description ? (
      <p className="mt-3 text-[var(--text-main)]/70">{description}</p>
    ) : null}
  </header>
);

export default PageHeader;
