import React, { useMemo } from "react";
import LinkItem from "./LinkItem";

const LinksList = ({ data, onEdit, onDelete }) => {
  const groupedLinks = useMemo(() => {
    return data.reduce((groups, link) => {
      const category = link.category || "Sin Categoría";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(link);
      return groups;
    }, {});
  }, [data]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Links Existentes</h2>
      <div className="space-y-8">
        {Object.entries(groupedLinks).map(([category, links]) => (
          <div key={category} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              {category}
            </h3>
            <div className="space-y-4">
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksList;
