import React from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { fetchData } from "../../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faUserGraduate,
  faFileAlt,
  faBook,
  faQuestionCircle,
  faLink,
  faEnvelope,
  faHome,
  faNewspaper,
  faCogs,
  faChevronRight,
  faExternalLinkAlt,
  faShieldAlt,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

const statsConfig = [
  {
    title: "Archivos y formularios",
    description: "Subir y organizar documentación pública",
    icon: faFolderOpen,
    path: "/archivos/edit",
    group: "Recursos",
  },
  {
    title: "Profesores",
    description: "Equipo docente e investigadores",
    collection: "professors",
    icon: faUserTie,
    color: "from-blue-500 to-blue-600",
    path: "/professors/edit",
  },
  {
    title: "Estudiantes",
    description: "Tesistas activos y temas de trabajo",
    collection: "students",
    icon: faUserGraduate,
    color: "from-emerald-500 to-emerald-600",
    path: "/students/edit",
  },
  {
    title: "Tesis",
    description: "Repositorio académico",
    collection: "tesis",
    icon: faFileAlt,
    color: "from-purple-500 to-purple-600",
    path: "/tesis/edit",
  },
  {
    title: "Cursos",
    description: "Oferta académica publicada",
    collection: "courses",
    icon: faBook,
    color: "from-amber-500 to-orange-500",
    path: "/courses/edit",
  },
];

const quickActions = [
  {
    title: "Noticias",
    description: "Publicar novedades y anuncios",
    icon: faNewspaper,
    path: "/news/edit",
    group: "Contenido dinámico",
  },
  {
    title: "Datos del posgrado",
    description: "Editar hero y datos principales",
    icon: faHome,
    path: "/home/edit",
    group: "Contenido institucional",
  },
  {
    title: "Acerca de / Misión",
    description: "Actualizar presentación institucional",
    icon: faCogs,
    path: "/about/edit",
    group: "Contenido institucional",
  },
  {
    title: "Reglamentos",
    description: "Gestionar secciones reglamentarias",
    icon: faCogs,
    path: "/rules/edit",
    group: "Contenido institucional",
  },
  {
    title: "Preguntas frecuentes",
    description: "Responder dudas habituales",
    icon: faQuestionCircle,
    path: "/faq/edit",
    group: "Recursos",
  },
  {
    title: "Enlaces útiles",
    description: "Mantener recursos externos",
    icon: faLink,
    path: "/links/edit",
    group: "Recursos",
  },
  {
    title: "Información de contacto",
    description: "Actualizar canales y ubicación",
    icon: faEnvelope,
    path: "/contact/edit",
    group: "Recursos",
  },
  {
    title: "Gestión de acceso",
    description: "Administrar emails autorizados",
    icon: faShieldAlt,
    path: "/manage-emails",
    group: "Administración",
  },
];

const AdminDashboard = () => {
  const statsQueries = useQueries({
    queries: statsConfig.map((stat) => ({
      queryKey: [stat.collection, "count"],
      queryFn: async () => {
        const data = await fetchData(stat.collection);
        return data?.length || 0;
      },
    })),
  });

  const isLoading = statsQueries.some((q) => q.isLoading);
  const hasStatsError = statsQueries.some((q) => q.isError);
  const totalContent = statsQueries.reduce(
    (total, query) => total + (Number(query.data) || 0),
    0
  );
  const groupedActions = quickActions.reduce((groups, action) => {
    groups[action.group] = [...(groups[action.group] || []), action];
    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-main)] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <section className="mb-8 overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
          <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ingenieria)]">
                Administración
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)] md:text-5xl">
                Panel de control
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--text-main)]/75 md:text-base">
                Gestioná contenidos, secciones públicas y accesos desde un solo
                lugar. Las acciones principales están agrupadas para que sea más
                rápido encontrar qué editar.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/news/edit"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--color-ingenieria)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-ingenieria-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
                >
                  Publicar noticia
                  <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-xs" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
                >
                  Ver sitio público
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-xs" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--color-ingenieria)]/10 p-5">
              <p className="text-sm font-semibold text-[var(--color-ingenieria)]">
                Contenido registrado
              </p>
              <p className="mt-3 text-4xl font-bold text-[var(--text-main)]">
                {isLoading ? "…" : totalContent}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-main)]/65">
                Total entre profesores, estudiantes, tesis y cursos.
              </p>
              {hasStatsError ? (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  Algunas estadísticas no pudieron cargarse.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">
            Resumen general
          </h2>
              <p className="mt-2 text-sm text-[var(--text-main)]/70">
                Un vistazo rápido al contenido principal publicado.
          </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {statsConfig.map((stat, index) => (
              <Link
                key={stat.title}
                to={stat.path}
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-ingenieria)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}
                  >
                    <FontAwesomeIcon icon={stat.icon} className="h-5 w-5" />
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-[var(--text-main)]/25 transition-colors group-hover:text-[var(--color-ingenieria)]"
                  />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-main)]/60">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-[var(--text-main)]" aria-live="polite">
                  {statsQueries[index]?.isLoading
                    ? "…"
                    : statsQueries[index]?.isError
                      ? "—"
                      : statsQueries[index]?.data || 0}
                </p>
                <p className="mt-2 text-sm leading-5 text-[var(--text-main)]/65">
                  {stat.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-main)]">
              Gestión de contenidos
            </h2>
            <p className="mt-2 text-sm text-[var(--text-main)]/70">
              Accedé rápidamente a cada sección editable del sitio.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {Object.entries(groupedActions).map(([group, actions]) => (
              <div
                key={group}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm"
              >
                <h3 className="mb-3 px-1 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-main)]/55">
                  {group}
                </h3>
                <div className="grid gap-3">
                  {actions.map((action) => (
                    <Link
                      key={action.title}
                      to={action.path}
                      className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-[var(--color-ingenieria)]/25 hover:bg-[var(--color-ingenieria)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] transition-colors group-hover:bg-[var(--color-ingenieria)] group-hover:text-white">
                        <FontAwesomeIcon icon={action.icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-snug text-[var(--text-main)]">
                          {action.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-[var(--text-main)]/62">
                          {action.description}
                        </p>
                      </div>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="shrink-0 text-[var(--text-main)]/25 transition-colors group-hover:text-[var(--color-ingenieria)]"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
