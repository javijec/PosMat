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

    return (Number.isNaN(first) ? 0 : first) - (Number.isNaN(second) ? 0 : second);
  });

const News = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: news = [], isLoading } = useQuery({
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
    if (news.length <= 1 || isPaused) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [isPaused, news.length]);

  if (isLoading) {
    return (
      <section className="relative bg-[var(--bg-surface)] py-6 transition-colors sm:py-8">
        <div className="mx-auto max-w-5xl px-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ingenieria)]">
            Actualidad
          </p>
          <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
            <div className="h-40 animate-pulse bg-[var(--bg-muted)] sm:h-48" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-28 animate-pulse rounded bg-[var(--bg-muted)]" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--bg-muted)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--bg-muted)]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--bg-muted)]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!news.length) {
    return null;
  }

  const activeItem = news[currentIndex];
  const hasMultipleNews = news.length > 1;
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % news.length);

  return (
    <section
      className="relative bg-[var(--bg-surface)] py-6 transition-colors sm:py-8"
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ingenieria)]">
              Actualidad
            </p>
            <h2 className="text-xl font-bold text-[var(--text-main)] sm:text-2xl">
              Últimas noticias
            </h2>
          </div>

          <Link
            to="/news"
            className="hidden items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2 text-xs font-semibold text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)] md:inline-flex"
          >
            Ver todas las noticias
          </Link>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.28fr)_240px]">
          <article className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[1.05fr_0.95fr]">
              <img
                src={activeItem.imageUrl || FALLBACK_IMAGE}
                alt={activeItem.title}
                className="h-40 w-full object-cover sm:h-full sm:min-h-[180px] lg:min-h-[220px]"
              />

              <div className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ingenieria)]">
                      {currentIndex === 0
                        ? "Destacada"
                        : `Noticia ${currentIndex + 1}`}
                    </span>
                    <span className="text-xs text-[var(--text-main)]/55">
                      {formatDate(activeItem.publishedAt)}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold leading-tight text-[var(--text-main)] md:text-xl">
                    {activeItem.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-6 text-[var(--text-main)]/75">
                    {activeItem.summary}
                  </p>

                  {activeItem.content ? (
                    <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-[var(--text-main)]/65 md:block">
                      {activeItem.content}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {hasMultipleNews ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={goToPrevious}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                        aria-label="Noticia anterior"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                        aria-label="Siguiente noticia"
                      >
                        →
                      </button>
                    </div>
                  ) : (
                    <span />
                  )}

                  <Link
                    to={`/news#news-${activeItem.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-ingenieria)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)]"
                  >
                    Leer completa
                  </Link>
                </div>

                {hasMultipleNews ? (
                  <div className="mt-4 flex gap-1.5 md:hidden">
                    {news.map((item, dotIndex) => (
                      <button
                        key={`mobile-dot-${item.id}`}
                        type="button"
                        onClick={() => setCurrentIndex(dotIndex)}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIndex === currentIndex
                            ? "w-8 bg-[var(--color-ingenieria)]"
                            : "w-2 bg-[var(--text-main)]/20"
                        }`}
                        aria-label={`Ver noticia ${dotIndex + 1}`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </article>

          {hasMultipleNews ? (
          <div className="hidden grid-cols-2 gap-2 md:grid xl:grid-cols-1">
            {news.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`min-w-0 rounded-xl border p-3 text-left transition-all ${
                  index === currentIndex
                    ? "border-[var(--color-ingenieria)] bg-[var(--color-ingenieria)]/8 shadow-sm"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--color-ingenieria)]/45"
                }`}
              >
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ingenieria)]">
                  {formatDate(item.publishedAt)}
                </p>
                <h3 className="mb-1 line-clamp-2 text-xs font-semibold leading-snug text-[var(--text-main)]">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-[11px] leading-4 text-[var(--text-main)]/70">
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
          ) : null}
        </div>

        <div className="mt-4 flex justify-center md:hidden">
          <Link
            to="/news"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2 text-xs font-semibold text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
          >
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default News;
