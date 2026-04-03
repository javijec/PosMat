import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../shared/EmptyState";
import { ListSkeleton } from "../shared/Skeleton";

const formatDate = (value) => {
  if (!value) return "Sin fecha";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const NewsList = ({ news, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <ListSkeleton items={4} />;
  }

  if (!news.length) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No hay noticias cargadas"
          description="Agrega la primera noticia desde el formulario para empezar a mostrar novedades en el inicio."
        />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {news.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  {formatDate(item.publishedAt)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.summary}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-colors hover:bg-indigo-100"
                title="Editar noticia"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                title="Eliminar noticia"
              >
                <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default NewsList;
