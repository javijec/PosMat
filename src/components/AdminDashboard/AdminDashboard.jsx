import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
} from "@fortawesome/free-solid-svg-icons";

const statsConfig = [
  {
    title: "Profesores",
    collection: "professors",
    icon: faUserTie,
    color: "bg-blue-500",
    path: "/professors/edit",
  },
  {
    title: "Estudiantes",
    collection: "students",
    icon: faUserGraduate,
    color: "bg-green-500",
    path: "/students/edit",
  },
  {
    title: "Tesis",
    collection: "tesis",
    icon: faFileAlt,
    color: "bg-purple-500",
    path: "/tesis/edit",
  },
  {
    title: "Cursos",
    collection: "courses",
    icon: faBook,
    color: "bg-amber-500",
    path: "/courses/edit",
  },
];

const quickActions = [
  { title: "Preguntas Frecuentes", icon: faQuestionCircle, path: "/faq/edit" },
  { title: "Enlaces de Interés", icon: faLink, path: "/links/edit" },
  { title: "Información de Contacto", icon: faEnvelope, path: "/contact/edit" },
  { title: "Configuración Hero", icon: faHome, path: "/home/edit" },
  { title: "Noticias", icon: faNewspaper, path: "/news/edit" },
  { title: "Acerca de / Misión", icon: faCogs, path: "/about/edit" },
  { title: "Reglamentos", icon: faCogs, path: "/rules/edit" },
  { title: "Gestión de Acceso", icon: faUserTie, path: "/manage-emails" },
];

const AdminDashboard = () => {
  // Fetch counts for the main modules
  const statsQueries = statsConfig.map((stat) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: [stat.collection, "count"],
      queryFn: async () => {
        const data = await fetchData(stat.collection);
        return data?.length || 0;
      },
    })
  );

  const isLoading = statsQueries.some((q) => q.isLoading);

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ingenieria)]">
                Administración
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">
                Panel de Control
              </h1>
              <p className="mt-3 max-w-3xl text-base text-[var(--text-main)]/75">
                Gestiona el contenido del sitio desde un solo lugar, con el mismo
                estilo visual y estructura que el resto de la plataforma.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-main)] transition-colors hover:border-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria)]"
            >
              Ver sitio público
              <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-xs" />
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-[var(--text-main)]">
            Resumen general
          </h2>
          <p className="mb-6 text-sm text-[var(--text-main)]/70">
            Un vistazo rápido al contenido principal que ya está publicado.
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {statsConfig.map((stat, index) => (
              <Link
                key={stat.title}
                to={stat.path}
                className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-ingenieria)] hover:shadow-md"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} text-white shadow-sm`}
                  >
                    <FontAwesomeIcon icon={stat.icon} className="h-5 w-5" />
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-[var(--text-main)]/25 transition-colors group-hover:text-[var(--color-ingenieria)]"
                  />
                </div>

                <p className="text-sm font-medium uppercase tracking-wider text-[var(--text-main)]/60">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-[var(--text-main)]">
                  {isLoading ? "..." : statsQueries[index]?.data || 0}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-main)]">
              Gestión de contenidos
            </h2>
            <p className="mt-2 text-sm text-[var(--text-main)]/70">
              Accede rápidamente a cada sección editable del sitio.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="group flex min-w-0 flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm transition-all duration-200 hover:border-[var(--color-ingenieria)] hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] transition-colors group-hover:bg-[var(--color-ingenieria)] group-hover:text-white">
                    <FontAwesomeIcon icon={action.icon} />
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="shrink-0 text-[var(--text-main)]/25 transition-colors group-hover:text-[var(--color-ingenieria)]"
                  />
                </div>

                <span className="text-sm font-semibold leading-snug text-[var(--text-main)]">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
