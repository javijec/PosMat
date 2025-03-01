import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { Hash, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchData } from "../../firebase/CRUD";
import { sanitizeHtml } from "../../utils/htmlSanitizer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Rules = () => {
  const [data, setData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const collection = "rules";

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !selectedSection) {
      setSelectedSection(data[0]);
    }
  }, [data]);

  const fetchRules = async () => {
    try {
      const rulesData = await fetchData(collection);
      const sortedData = rulesData.sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching rules data: ", error);
    }
  };

  if (!selectedSection) return null;

  const selectedIndex = data.findIndex(
    (section) => section.id === selectedSection.id
  );

  const previousSection = () => {
    if (selectedIndex > 0) {
      setSelectedSection(data[selectedIndex - 1]);
    }
  };

  const nextSection = () => {
    if (selectedIndex < data.length - 1) {
      setSelectedSection(data[selectedIndex + 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">
        Reglamentos
      </h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={previousSection}
          disabled={selectedIndex === 0}
          className="p-2 rounded-lg border border-gray-300 bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <Listbox
          value={selectedSection}
          onChange={setSelectedSection}
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
          onClick={nextSection}
          disabled={selectedIndex === data.length - 1}
          className="p-2 rounded-lg border border-gray-300 bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-4 text-sm md:text-base prose prose-indigo max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(selectedSection.html),
          }}
        />
      </div>
    </div>
  );
};

export default Rules;
