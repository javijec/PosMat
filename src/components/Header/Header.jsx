import { Disclosure, Menu } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { path: "/", name: "Inicio" },
  { path: "/news", name: "Noticias" },
  { path: "/about", name: "Acerca de" },
  {
    name: "Comunidad",
    subItems: [
      { path: "/professors", name: "Profesores" },
      { path: "/students", name: "Estudiantes" },
    ],
  },
  {
    name: "Posgrado",
    subItems: [
      { path: "/rules", name: "Reglamento" },
      { path: "/courses", name: "Cursos" },
      { path: "/tesis", name: "Tesis" },
    ],
  },
  { path: "/contact", name: "Contacto" },
];

const desktopNavLinkClass = ({ isActive }) =>
  `rounded-md px-2 py-1 transition-colors ${
    isActive ? "bg-white/10 text-white font-medium" : "text-white/90 hover:bg-white/5 hover:text-white"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm transition-colors ${
    isActive
      ? "bg-white/15 text-white font-semibold"
      : "text-white/90 hover:bg-white/5 hover:text-white"
  }`;

const mobileSectionLabelClass =
  "px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55";

const Header = () => {
  const { user, logout } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await logout();
    }
  };

  const closeDisclosure = (close) => {
    if (close) {
      close();
    }
  };

  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-50 bg-[var(--bg-header)]/90 backdrop-blur-md text-white shadow-sm transition-all duration-300"
    >
      {({ open, close }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => closeDisclosure(close)}
            >
              <img
                src="https://www.fi.mdp.edu.ar/images/logofi-lightblue-with-text.png"
                alt="Facultad de Ingeniería"
                className="h-10"
              />
            </Link>

            <nav className="hidden lg:flex space-x-6 items-center">
              {menuItems.map((item, i) =>
                item.subItems ? (
                  <Menu
                    as="div"
                    key={i}
                    className="relative inline-block text-left"
                  >
                    {({ close: menuClose }) => (
                      <>
                        <Menu.Button className="rounded-md px-2 py-1 text-white/90 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                          {item.name}
                        </Menu.Button>
                        <Menu.Items className="absolute left-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-[var(--bg-header)] shadow-lg">
                          {item.subItems.map((subItem, j) => (
                            <Menu.Item key={j}>
                              {({ active }) => (
                                <NavLink
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    `block px-4 py-2 text-sm transition-colors ${
                                      isActive
                                        ? "bg-white/15 font-semibold text-white"
                                        : active
                                          ? "bg-white/10 text-white"
                                          : "text-white/90"
                                    }`
                                  }
                                  onClick={() => closeDisclosure(menuClose)}
                                >
                                  {subItem.name}
                                </NavLink>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </>
                    )}
                  </Menu>
                ) : (
                  <div key={i} className="flex items-center space-x-1">
                    <NavLink
                      to={item.path}
                      className={desktopNavLinkClass}
                    >
                      {item.name}
                    </NavLink>
                  </div>
                )
              )}

              {user && (
                <Menu as="div" className="relative inline-block text-left">
                  {({ close: menuClose }) => (
                    <>
                      <Menu.Button
                        className="rounded-full p-2 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        aria-label="Abrir menú de usuario"
                      >
                        <UserIcon className="h-5 w-5" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-[var(--bg-header)] shadow-lg z-10 rounded-md border border-white/10">
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/admin"
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-white/10" : ""
                              }`}
                              onClick={() => closeDisclosure(menuClose)}
                            >
                              Panel de Control
                            </NavLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                handleAuth();
                                closeDisclosure(menuClose);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-white/10" : ""
                              }`}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </>
                  )}
                </Menu>
              )}
            </nav>

            <div className="flex items-center space-x-2 lg:hidden">
              <Disclosure.Button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                aria-expanded={open}
              >
                {open ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="border-t border-white/10 bg-[var(--bg-header)]/95 px-4 pb-4 pt-3 shadow-lg lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Navegación principal móvil">
              {menuItems.map((item, i) =>
                item.subItems ? (
                  <div key={i}>
                    <span className={mobileSectionLabelClass}>{item.name}</span>
                    <div className="grid gap-1">
                      {item.subItems.map((subItem, j) => (
                        <NavLink
                          key={j}
                          to={subItem.path}
                          className={mobileNavLinkClass}
                          onClick={() => closeDisclosure(close)}
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={i}
                    to={item.path}
                    className={mobileNavLinkClass}
                    onClick={() => closeDisclosure(close)}
                  >
                    {item.name}
                  </NavLink>
                )
              )}

              <div className="mt-3 border-t border-white/10 pt-3">
                {user ? (
                  <>
                    <NavLink
                      to="/admin"
                      className={mobileNavLinkClass}
                      onClick={() => closeDisclosure(close)}
                    >
                      Panel de Control
                    </NavLink>
                    <button
                      onClick={() => {
                        handleAuth();
                        closeDisclosure(close);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : null}
              </div>
            </nav>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
