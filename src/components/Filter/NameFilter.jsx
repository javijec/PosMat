import React from "react";

const NameFilter = ({ filterLastName, setFilterLastName, filterFirstName, setFilterFirstName }) => (
  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filterLastName">
        Filtrar por apellido:
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="filterLastName"
        type="text"
        placeholder="Ingrese el apellido"
        value={filterLastName}
        onChange={(e) => setFilterLastName(e.target.value)}
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filterFirstName">
        Filtrar por nombre:
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="filterFirstName"
        type="text"
        placeholder="Ingrese el nombre"
        value={filterFirstName}
        onChange={(e) => setFilterFirstName(e.target.value)}
      />
    </div>
  </div>
);

export default NameFilter;
