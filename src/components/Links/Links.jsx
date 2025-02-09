import React from "react";
import linksData from "../../files/links.json";

const Links = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Enlaces Útiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {linksData.categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <ul className="space-y-3">
              {category.links.map((link, linkIndex) => (
                <li key={linkIndex} className="transition-colors duration-200">
                  <a
                    href={link.url}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{link.name}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  {link.description && <p className="text-sm text-gray-600 mt-1">{link.description}</p>}
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
