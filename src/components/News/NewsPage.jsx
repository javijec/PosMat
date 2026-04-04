import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const result = await fetchData("news");
      if (!Array.isArray(result)) return [];
      return sortNewsByDate(result);
    },
  });

  const selectedNews = useMemo(
    () => news.find((item) => item.id === selectedNewsId) || null,
    [news, selectedNewsId]
  );

  useEffect(() => {
    if (!news.length) return;

    const hash = window.location.hash.replace("#news-", "");
    if (!hash) return;

    const matchedItem = news.find((item) => String(item.id) === hash);
    if (matchedItem) {
      setSelectedNewsId(matchedItem.id);
    }
  }, [news]);

  const openNewsModal = (itemId) => {
    setSelectedNewsId(itemId);
    window.history.replaceState(null, "", `#news-${itemId}`);
  };

  const closeNewsModal = () => {
    setSelectedNewsId(null);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-ingenieria)]">
            Noticias
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[var(--text-main)] md:text-4xl">
            Todas las novedades del Posgrado en Ciencia de Materiales
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-main)]/75 md:text-base">
            Un espacio para publicar anuncios, actividades, llamados y eventos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4"
              >
                <div className="mb-3 h-4 w-32 animate-pulse rounded bg-black/5" />
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-black/5" />
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-black/5" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-black/5" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] px-8 py-12 text-center">
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Todavía no hay noticias publicadas
            </h2>
            <p className="mt-2 text-sm text-[var(--text-main)]/70">
              Desde el panel de administración ya puedes crear las primeras.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
            <ul className="divide-y divide-[var(--border-subtle)]">
              {news.map((item, index) => (
                <li key={item.id} id={`news-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => openNewsModal(item.id)}
                    className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-black/[0.02] md:flex-row md:items-start md:gap-4 md:px-5"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <img
                        src={item.imageUrl || FALLBACK_IMAGE}
                        alt={item.title}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover md:h-20 md:w-20"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ingenieria)]">
                            {index === 0 ? "Destacada" : "Novedad"}
                          </span>
                          <span className="text-[11px] text-[var(--text-main)]/55">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>

                        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--text-main)] md:text-lg">
                          {item.title}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--text-main)]/72">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:w-auto md:flex-shrink-0 md:justify-end">
                      <span className="text-xs font-medium text-[var(--color-ingenieria)]">
                        Leer noticia
                      </span>
                      <span className="text-sm text-[var(--text-main)]/40">
                        →
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Transition appear show={Boolean(selectedNews)} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeNewsModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-3 scale-[0.98]"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-3 scale-[0.98]"
              >
                <Dialog.Panel className="w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl">
                  {selectedNews ? (
                    <div className="grid max-h-[calc(100vh-4rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                      <div className="flex min-h-[280px] items-center justify-center bg-black p-3 md:min-h-[640px] md:p-5">
                        <img
                          src={selectedNews.imageUrl || FALLBACK_IMAGE}
                          alt={selectedNews.title}
                          className="max-h-[72vh] w-full object-contain"
                        />
                      </div>

                      <div className="flex min-h-0 flex-col border-t border-[var(--border-subtle)] md:border-t-0 md:border-l">
                        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-4 md:px-6">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ingenieria)]">
                                Noticias
                              </span>
                              <span className="text-xs text-[var(--text-main)]/55">
                                {formatDate(selectedNews.publishedAt)}
                              </span>
                            </div>

                            <Dialog.Title className="text-xl font-bold leading-tight text-[var(--text-main)] md:text-2xl">
                              {selectedNews.title}
                            </Dialog.Title>
                          </div>

                          <button
                            type="button"
                            onClick={closeNewsModal}
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-main)]/70 transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
                            aria-label="Cerrar noticia"
                          >
                            ×
                          </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
                          {selectedNews.summary ? (
                            <p className="mb-5 text-sm leading-6 text-[var(--text-main)]/78 md:text-base md:leading-7">
                              {selectedNews.summary}
                            </p>
                          ) : null}

                          {selectedNews.content ? (
                            <div className="whitespace-pre-line text-sm leading-7 text-[var(--text-main)]/82 md:text-base">
                              {selectedNews.content}
                            </div>
                          ) : (
                            <p className="text-sm text-[var(--text-main)]/65">
                              Esta noticia no tiene contenido ampliado.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default NewsPage;
