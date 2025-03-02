import React, { useState, useEffect, useMemo } from "react";
import { fetchData } from "../../firebase/CRUD";

const Links = () => {
  const [links, setLinks] = useState([]);
  const collection = "links";

  useEffect(() => {
    const loadLinks = async () => {
      const res = await fetchData(collection);
      setLinks(res);
    };
    loadLinks();
  }, []);

  // Agrupar links por categoría
  const groupedLinks = useMemo(() => {
    return links.reduce((groups, link) => {
      const category = link.category || "Sin Categoría";
      if (!groups[category]) groups[category] = [];
      groups[category].push(link);
      return groups;
    }, {});
  }, [links]);

  return (
    <div className="container mx-auto max-w-250 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Enlaces Útiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(groupedLinks).map((category, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <ul className="space-y-3">
              {groupedLinks[category].map((link, linkIndex) => (
                <li key={linkIndex} className="transition-colors duration-200">
                  <a
                    href={link.url}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{link.name}</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  {link.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Links;
