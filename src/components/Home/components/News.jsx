import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../../data";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

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

const News = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: news = [] } = useQuery({
    queryKey: ["news", "latest-home"],
    queryFn: async () => {
      const result = await fetchData("news");
      if (!Array.isArray(result)) return [];
      return sortNewsByDate(result).slice(0, 4);
    },
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [news.length]);

  useEffect(() => {
    if (news.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [news.length]);

  if (!news.length) {
    return null;
  }

  const activeItem = news[currentIndex];
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % news.length);

  return (
    <section className="relative bg-[var(--bg-surface)] py-3 transition-colors">
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ingenieria)]">
              Actualidad
            </p>
          </div>

          <Link
            to="/news"
            className="hidden items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)] md:inline-flex"
          >
            Ver todas las noticias
          </Link>
        </div>

        <div className="grid gap-2 xl:grid-cols-[minmax(0,1.28fr)_220px]">
          <article className="overflow-hidden rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
            <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[130px_minmax(0,1fr)] lg:grid-cols-[1.05fr_0.95fr]">
              <img
                src={activeItem.imageUrl || FALLBACK_IMAGE}
                alt={activeItem.title}
                className="h-full min-h-[120px] w-full object-cover md:min-h-[140px] lg:min-h-[150px]"
              />

              <div className="flex flex-col justify-between p-2.5 md:p-3.5">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ingenieria)]">
                      {currentIndex === 0
                        ? "Destacada"
                        : `Noticia ${currentIndex + 1}`}
                    </span>
                    <span className="text-[10px] text-[var(--text-main)]/55">
                      {formatDate(activeItem.publishedAt)}
                    </span>
                  </div>

                  <h3 className="mb-1 text-[13px] font-semibold leading-tight text-[var(--text-main)] md:text-lg">
                    {activeItem.title}
                  </h3>

                  <p className="mb-1 line-clamp-2 text-[11px] leading-4 text-[var(--text-main)]/75 md:text-xs">
                    {activeItem.summary}
                  </p>

                  {activeItem.content ? (
                    <p className="hidden line-clamp-1 text-[10px] leading-4 text-[var(--text-main)]/65 sm:block">
                      {activeItem.content}
                    </p>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                      aria-label="Noticia anterior"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                      aria-label="Siguiente noticia"
                    >
                      →
                    </button>
                  </div>

                  <Link
                    to={`/news#news-${activeItem.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-ingenieria)] px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)] md:px-3 md:text-[11px]"
                  >
                    Leer completa
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
            {news.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`min-w-0 rounded-lg border p-2 text-left transition-all ${
                  index === currentIndex
                    ? "border-[var(--color-ingenieria)] bg-[var(--color-ingenieria)]/8 shadow-sm"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--color-ingenieria)]/45"
                }`}
              >
                <p className="mb-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ingenieria)]">
                  {formatDate(item.publishedAt)}
                </p>
                <h3 className="mb-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-[var(--text-main)]">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-[10px] leading-4 text-[var(--text-main)]/70">
                  {item.summary}
                </p>

                <div className="mt-2 flex gap-1">
                  {news.map((_, dotIndex) => (
                    <span
                      key={`${item.id}-${dotIndex}`}
                      className={`h-1 rounded-full transition-all ${
                        dotIndex === index
                          ? "w-4 bg-[var(--color-ingenieria)]"
                          : "w-1 bg-[var(--text-main)]/20"
                      }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex justify-center md:hidden">
          <Link
            to="/news"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
          >
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default News;
