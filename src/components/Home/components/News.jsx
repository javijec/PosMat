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
    <section className="relative bg-[var(--bg-surface)] py-20 transition-colors">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-ingenieria)] mb-3">
              Actualidad
            </p>
          </div>

          <Link
            to="/news"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 font-semibold text-[var(--text-main)] hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)] transition-colors"
          >
            Ver todas las noticias
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
          <article className="overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <img
                src={activeItem.imageUrl || FALLBACK_IMAGE}
                alt={activeItem.title}
                className="h-full min-h-[280px] w-full object-cover"
              />

              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ingenieria)]">
                      {currentIndex === 0
                        ? "Destacada"
                        : `Noticia ${currentIndex + 1}`}
                    </span>
                    <span className="text-sm text-[var(--text-main)]/55">
                      {formatDate(activeItem.publishedAt)}
                    </span>
                  </div>

                  <h3 className="mb-4 text-3xl font-semibold leading-tight text-[var(--text-main)] md:text-4xl">
                    {activeItem.title}
                  </h3>

                  <p className="mb-6 text-base leading-7 text-[var(--text-main)]/75 md:text-lg">
                    {activeItem.summary}
                  </p>

                  {activeItem.content ? (
                    <p className="line-clamp-4 text-sm leading-7 text-[var(--text-main)]/65">
                      {activeItem.content}
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                      aria-label="Noticia anterior"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                      aria-label="Siguiente noticia"
                    >
                      →
                    </button>
                  </div>

                  <Link
                    to={`/news#news-${activeItem.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-ingenieria)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)]"
                  >
                    Leer noticia completa
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            {news.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`rounded-3xl border p-4 text-left transition-all ${
                  index === currentIndex
                    ? "border-[var(--color-ingenieria)] bg-[var(--color-ingenieria)]/8 shadow-sm"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--color-ingenieria)]/45"
                }`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ingenieria)]">
                  {formatDate(item.publishedAt)}
                </p>
                <h3 className="mb-2 text-lg font-semibold leading-snug text-[var(--text-main)]">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-6 text-[var(--text-main)]/70">
                  {item.summary}
                </p>

                <div className="mt-4 flex gap-2">
                  {news.map((_, dotIndex) => (
                    <span
                      key={`${item.id}-${dotIndex}`}
                      className={`h-1.5 rounded-full transition-all ${
                        dotIndex === index
                          ? "w-8 bg-[var(--color-ingenieria)]"
                          : "w-1.5 bg-[var(--text-main)]/20"
                      }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
