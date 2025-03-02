import React from "react";
import LinkItem from "./LinkItem";

const LinksList = ({ data, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Links Existentes</h2>
      <div className="space-y-4">
        {data.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default LinksList;
