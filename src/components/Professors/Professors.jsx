import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import professors from "../../files/professors.json";

const Professors = () => {
  const [selectedProf, setSelectedProf] = useState(null);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16 text-gray-900">Lista de Profesores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professors.map((prof, index) => (
            <div
              key={index}
              onClick={() => setSelectedProf(prof)}
              className="bg-white rounded-xl shadow-sm p-8 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 group"
            >
              <p className="font-semibold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                {prof.name}
              </p>
              <p className="text-gray-600 mt-2">{prof.email}</p>
            </div>
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
                      {selectedProf?.name}
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
