import React from "react";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
    <div className="bg-[#447c82]/10 p-3 sm:p-4 rounded-xl w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 shrink-0">
      {icon}
    </div>
    <div className="flex flex-col flex-grow">
      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#447c82]">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
