import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 prose prose-lg">
          <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: answer }}></p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
