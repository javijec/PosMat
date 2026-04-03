import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../data";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80";

const formatDate = (value) => {
  if (!value) return "Sin fecha";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const sortNewsByDate = (items) =>
  [...items].sort((a, b) => {
    const first = new Date(`${b.publishedAt || ""}T00:00:00`).getTime();
    const second = new Date(`${a.publishedAt || ""}T00:00:00`).getTime();

    return first - second;
  });

const NewsPage = () => {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const result = await fetchData("news");
      if (!Array.isArray(result)) return [];
      return sortNewsByDate(result);
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-ingenieria)]">
            Noticias
          </p>
          <h1 className="max-w-3xl text-4xl md:text-5xl font-bold text-[var(--text-main)] leading-tight">
            Todas las novedades del Posgrado en Ciencia de Materiales
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--text-main)]/75 leading-8">
            Un espacio para publicar anuncios, actividades, llamados y eventos.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {isLoading ? (
          <div className="grid gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
              >
                <div className="h-72 animate-pulse bg-black/5" />
                <div className="space-y-4 p-8">
                  <div className="h-4 w-40 animate-pulse rounded bg-black/5" />
                  <div className="h-8 w-2/3 animate-pulse rounded bg-black/5" />
                  <div className="h-4 w-full animate-pulse rounded bg-black/5" />
                  <div className="h-4 w-full animate-pulse rounded bg-black/5" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] px-8 py-16 text-center">
            <h2 className="text-2xl font-semibold text-[var(--text-main)]">
              Todavía no hay noticias publicadas
            </h2>
            <p className="mt-3 text-[var(--text-main)]/70">
              Desde el panel de administración ya puedes crear las primeras.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {news.map((item, index) => (
              <article
                key={item.id}
                id={`news-${item.id}`}
                className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm"
              >
                <div className="grid lg:grid-cols-[1.15fr_1fr]">
                  <img
                    src={item.imageUrl || FALLBACK_IMAGE}
                    alt={item.title}
                    className="h-full min-h-[280px] w-full object-cover"
                  />

                  <div className="p-8 md:p-10">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ingenieria)]">
                        {index === 0 ? "Destacada" : "Novedad"}
                      </span>
                      <span className="text-sm text-[var(--text-main)]/55">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold leading-tight text-[var(--text-main)]">
                      {item.title}
                    </h2>

                    <p className="mt-4 text-lg leading-8 text-[var(--text-main)]/75">
                      {item.summary}
                    </p>

                    {item.content ? (
                      <div className="mt-6 whitespace-pre-line text-[var(--text-main)]/80 leading-8">
                        {item.content}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsPage;
