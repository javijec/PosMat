import React from "react";

const SearchForm = ({
  searchName,
  searchTag,
  searchTitle,
  searchYear,
  setSearchName,
  setSearchTag,
  setSearchTitle,
  setSearchYear,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-4">Buscar Tesis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Autor
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Programa
          </label>
          <select
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="maestria">Maestría</option>
            <option value="doctoral">Doctorado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título de Tesis
          </label>
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Año</label>
          <input
            type="text"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
