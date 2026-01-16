import React from "react";

const FilterGrid = ({ children, title }) => {
  return (
    <div className="mb-8 p-6 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] transition-colors">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
    </div>
  );
};

export default FilterGrid;
