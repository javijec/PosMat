import React from "react";

const EditPageContainer = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-surface)] py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-8 border-l-4 border-[var(--color-ingenieria)] pl-4 text-3xl font-bold tracking-tight text-[var(--text-main)] md:text-4xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default EditPageContainer;
