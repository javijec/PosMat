import React from "react";

const AuthorizedEmailsList = ({ authorizedEmails, handleDeleteEmail }) => (
  <div className="space-y-2">
    {authorizedEmails.map((item) => (
      <div
        key={item.id}
        className="flex justify-between items-center p-3 bg-gray-50 rounded"
      >
        <span>{item.email}</span>
        <button
          onClick={() => handleDeleteEmail(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          Eliminar
        </button>
      </div>
    ))}
  </div>
);

export default AuthorizedEmailsList;
