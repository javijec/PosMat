import React from "react";

const ProfessorCard = ({ professor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-8 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 group"
    >
      <p className="font-semibold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
        {`${professor.title} ${professor.lastName},  ${professor.firstName} `}
      </p>
      <p className="text-gray-600 mt-2">{professor.email}</p>
    </div>
  );
};

export default ProfessorCard;
