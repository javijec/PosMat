import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEnvelope,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const AuthorizedEmailsList = ({
  authorizedEmails,
  onDeleteEmail,
  isDeleting,
}) => {
  if (authorizedEmails.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 uppercase tracking-widest text-xs font-bold text-gray-400">
        No hay emails autorizados
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {authorizedEmails.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <span className="font-bold text-gray-900 block">
                {item.email}
              </span>
              {item.createdAt && (
                <span className="text-[10px] text-gray-400 uppercase font-black flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-[8px]"
                  />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onDeleteEmail(item.id)}
            disabled={isDeleting}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-30"
            title="Eliminar autorización"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AuthorizedEmailsList;
