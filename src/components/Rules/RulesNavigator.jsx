import React from "react";
import { Listbox } from "@headlessui/react";
import { Hash, ChevronLeft, ChevronRight } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RulesNavigator = ({
  data,
  selectedSection,
  onPrev,
  onNext,
  onSelect,
}) => {
  const selectedIndex = data.findIndex(
    (section) => section.id === selectedSection.id
  );

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onPrev}
        disabled={selectedIndex === 0}
        className="p-2 rounded-lg border border-gray-300 bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <Listbox
        value={selectedSection}
        onChange={onSelect}
        as="div"
        className="flex-1"
      >
        <Listbox.Button className="w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md border border-gray-300 focus:outline-none">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <Hash className="w-4 h-4 mr-1" />
              <span className="font-medium">{selectedIndex + 1}.</span>
            </div>
            <span className="block line-clamp-2 md:line-clamp-none">
              {selectedSection.title}
            </span>
          </div>
        </Listbox.Button>
        <Listbox.Options
          as="div"
          className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {data.map((section, index) => (
            <Listbox.Option
              key={section.id}
              value={section}
              className={({ active }) =>
                classNames(
                  active ? "text-ingenieria bg-gray-100" : "text-gray-900",
                  "cursor-pointer select-none relative py-2 pl-10 pr-4"
                )
              }
            >
              {({ selected }) => (
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  <span
                    className={classNames(
                      selected ? "font-medium" : "font-normal"
                    )}
                  >
                    {index + 1}.
                  </span>
                  <span className="ml-2 block line-clamp-2 md:line-clamp-none">
                    {section.title}
                  </span>
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      <button
        onClick={onNext}
        disabled={selectedIndex === data.length - 1}
        className="p-2 rounded-lg border border-gray-300 bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RulesNavigator;
