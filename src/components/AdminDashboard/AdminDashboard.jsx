import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../firebase/CRUD";
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Panel de Control
        </h1>
        <p className="mt-2 text-lg opacity-80">
          Bienvenido al centro de administración. Aquí puedes gestionar todos
          los contenidos de la plataforma.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsConfig.map((stat, index) => (
          <Link
            key={stat.title}
            to={stat.path}
            className="group bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-card)] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}
              >
                <FontAwesomeIcon icon={stat.icon} className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-60 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold">
                  {isLoading ? "..." : statsQueries[index]?.data || 0}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></span>
            Gestión de Contenidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="flex items-center justify-between p-5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FontAwesomeIcon icon={action.icon} />
                  </div>
                  <span className="font-semibold opacity-90">
                    {action.title}
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-300 group-hover:text-indigo-600"
                />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-2 h-8 bg-pink-500 rounded-full mr-3"></span>
            Accesos Rápidos
          </h2>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">¿Necesitas ayuda?</h3>
              <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                Recuerda que todos los cambios se sincronizan automáticamente
                con la base de datos de producción.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Ver Sitio Público
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 text-xs"
                />
              </Link>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
