import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, CalendarDays, Newspaper, Search, X } from "lucide-react";
import { fetchData } from "../../data";
import EmptyState from "../shared/EmptyState";
import LoadingState from "../shared/LoadingState";

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

    return (Number.isNaN(first) ? 0 : first) - (Number.isNaN(second) ? 0 : second);
  });

const NewsPage = () => {
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [query, setQuery] = useState("");

  const { data: news = [], isLoading, error, refetch, isFetching } = useQuery({
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

  const filteredNews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return news;

    return news.filter((item) =>
      `${item.title || ""} ${item.summary || ""} ${item.content || ""}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [news, query]);

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

  const featuredNews = filteredNews[0] || null;
  const secondaryNews = filteredNews.slice(1);
  const resultLabel = query.trim()
    ? `${filteredNews.length} resultado${filteredNews.length === 1 ? "" : "s"} para “${query.trim()}”`
    : `${news.length} noticia${news.length === 1 ? "" : "s"} publicada${news.length === 1 ? "" : "s"}`;

  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-ingenieria)]">
            Noticias
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[var(--text-main)] md:text-5xl">
            Todas las novedades del Posgrado en Ciencia de Materiales
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-main)]/75 md:text-base">
            Un espacio para publicar anuncios, actividades, llamados y eventos.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-main)]/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por título, resumen o contenido"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] py-3 pl-9 pr-9 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20"
                aria-label="Buscar noticias"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]/55 hover:text-[var(--text-main)]"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {!isLoading && !error && news.length > 0 ? (
              <p className="text-sm text-[var(--text-main)]/60">{resultLabel}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {isLoading ? (
          <LoadingState label="Cargando noticias…" />
        ) : error ? (
          <EmptyState icon={AlertCircle} title="No se pudieron cargar las noticias" description="Revisá la conexión e intentá nuevamente." actionLabel={isFetching ? "Reintentando…" : "Reintentar"} onAction={() => refetch()} actionDisabled={isFetching} variant="error" />
        ) : news.length === 0 ? (
          <EmptyState icon={Newspaper} title="Todavía no hay noticias publicadas" description="Desde el panel de administración ya podés crear las primeras." />
        ) : filteredNews.length === 0 ? (
          <EmptyState icon={Search} title="No encontramos noticias" description="Probá con otra palabra de búsqueda." actionLabel="Limpiar búsqueda" onAction={() => setQuery("")} />
        ) : (
          <div className="space-y-5">
            {featuredNews ? (
              <article
                id={`news-${featuredNews.id}`}
                className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => openNewsModal(featuredNews.id)}
                  className="grid w-full text-left transition-colors hover:bg-black/[0.02] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
                >
                  <img
                    src={featuredNews.imageUrl || FALLBACK_IMAGE}
                    alt={featuredNews.title}
                    className="h-52 w-full object-cover sm:h-64 lg:h-full lg:min-h-[330px]"
                  />

                  <div className="flex flex-col justify-between p-5 md:p-7">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ingenieria)]">
                          Destacada
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-main)]/55">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(featuredNews.publishedAt)}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold leading-tight text-[var(--text-main)] md:text-3xl">
                        {featuredNews.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--text-main)]/74 md:text-base md:leading-7">
                        {featuredNews.summary}
                      </p>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ingenieria)]">
                      Leer noticia completa <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              </article>
            ) : null}

            {secondaryNews.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {secondaryNews.map((item) => (
                  <li key={item.id} id={`news-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => openNewsModal(item.id)}
                    className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-left shadow-sm transition-all hover:border-[var(--color-ingenieria)]/35 hover:shadow-md"
                  >
                    <img
                      src={item.imageUrl || FALLBACK_IMAGE}
                      alt={item.title}
                      className="h-36 w-full object-cover sm:h-44"
                    />

                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--color-ingenieria)]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ingenieria)]">
                          Novedad
                        </span>
                        <span className="text-[11px] text-[var(--text-main)]/55">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>

                      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-[var(--text-main)] transition-colors group-hover:text-[var(--color-ingenieria)]">
                        {item.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[var(--text-main)]/72">
                        {item.summary}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-ingenieria)]">
                        Leer noticia
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            ) : null}
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

          <div className="fixed inset-0 overflow-y-auto p-0 sm:p-4">
            <div className="flex min-h-full items-end justify-center sm:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-3 scale-[0.98]"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-3 scale-[0.98]"
              >
                <Dialog.Panel className="w-full max-w-6xl overflow-hidden rounded-t-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl sm:rounded-[1.75rem]">
                  {selectedNews ? (
                    <div className="grid max-h-[100dvh] sm:max-h-[calc(100vh-4rem)] md:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
                      <div className="flex max-h-[42vh] items-center justify-center bg-black md:max-h-none md:min-h-[640px] md:p-5">
                        <img
                          src={selectedNews.imageUrl || FALLBACK_IMAGE}
                          alt={selectedNews.title}
                          className="h-full max-h-[42vh] w-full object-cover md:max-h-[72vh] md:object-contain"
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
                            <X className="h-4 w-4" />
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
    </main>
  );
};

export default NewsPage;
