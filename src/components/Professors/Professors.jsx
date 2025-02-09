import React, { useState, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import professors from "../../files/professors.json";
import ProfessorCard from "./ProfessorCard";

const Professors = () => {
  const [selectedProf, setSelectedProf] = useState(null);
  const [filterLastName, setFilterLastName] = useState("");
  const [filterFirstName, setFilterFirstName] = useState("");

  const filteredProfessors = useMemo(() => {
    let filtered = professors;

    if (filterLastName) {
      filtered = filtered.filter((prof) => prof.lastName.toUpperCase().startsWith(filterLastName.toUpperCase()));
    }

    if (filterFirstName) {
      filtered = filtered.filter((prof) => prof.firstName.toLowerCase().includes(filterFirstName.toLowerCase()));
    }

    return filtered;
  }, [filterLastName, filterFirstName]);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16 text-gray-900">Lista de Profesores</h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessors.map((prof, index) => (
            <ProfessorCard key={index} professor={prof} onClick={() => setSelectedProf(prof)} />
          ))}
        </div>

        <Transition appear show={!!selectedProf} as={React.Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setSelectedProf(null)}>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900">
                      {`${selectedProf?.title} ${selectedProf?.firstName} ${selectedProf?.lastName}`}
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-gray-600">{selectedProf?.email}</p>
                      {/* Add more professor details here */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default Professors;
