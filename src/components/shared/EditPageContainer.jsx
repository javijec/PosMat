import React from "react";

const EditPageContainer = ({ title, children }) => {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 border-l-4 border-indigo-600 pl-4">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default EditPageContainer;
