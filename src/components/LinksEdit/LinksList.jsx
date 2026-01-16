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

  const categories = Object.keys(groupedLinks).sort();

  return (
    <div className="space-y-10">
      {categories.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 uppercase tracking-widest text-xs font-bold text-gray-400">
          No hay links registrados
        </div>
      ) : (
        categories.map((category) => (
          <div key={category} className="group">
            <h3 className="text-sm font-black mb-4 text-indigo-600 uppercase tracking-[0.2em] flex items-center">
              <span className="bg-indigo-600 w-2 h-2 rounded-full mr-3"></span>
              {category}
              <span className="ml-4 flex-1 h-[1px] bg-gray-100 group-hover:bg-indigo-100 transition-colors"></span>
            </h3>
            <div className="space-y-3">
              {groupedLinks[category].map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LinksList;
