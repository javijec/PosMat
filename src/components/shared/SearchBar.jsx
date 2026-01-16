import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
        <FontAwesomeIcon icon={faSearch} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none w-full text-sm transition-all shadow-sm"
      />
    </div>
  );
};

export default SearchBar;
