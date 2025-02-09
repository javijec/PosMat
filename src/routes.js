export const headerRoutes = [
  { path: "/", name: "Inicio" },
  { path: "/about", name: "Acerca de" },

  {
    name: "Comunidad",
    routes: [
      { path: "/professors", name: "Profesores" },
      { path: "/students", name: "Estudiantes" },
    ],
  },
  {
    name: "Posgrado",
    routes: [
      { path: "/rules", name: "Reglamentos" },
      { path: "/courses", name: "Cursos" },
      { path: "/tesis", name: "Tesis" },
    ],
  },
  { path: "/contact", name: "Contacto" },
];
