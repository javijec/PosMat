// src/components/Header/Header.jsx
import React from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

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
  `px-2 py-1 transition-colors ${
    isActive ? "text-white font-medium" : "text-white/90 hover:text-white"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 transition-colors ${
    isActive
      ? "bg-white/10 text-white font-medium"
      : "text-white/90 hover:bg-white/5 hover:text-white"
  }`;

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
                alt="Logo"
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
                        <Menu.Button className="px-2 py-1 hover:text-gray-300 focus:outline-none">
                          {item.name}
                        </Menu.Button>
                        <Menu.Items className="absolute left-0 mt-2 w-48 bg-ingenieria shadow-lg z-10">
                          {item.subItems.map((subItem, j) => (
                            <Menu.Item key={j}>
                              {({ active }) => (
                                <div className="flex items-center justify-between px-4 py-2">
                                  <NavLink
                                    to={subItem.path}
                                    className={`block ${
                                      active ? "text-gray-300" : ""
                                    }`}
                                    onClick={() => closeDisclosure(menuClose)}
                                  >
                                    {subItem.name}
                                  </NavLink>
                                </div>
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
                      <Menu.Button className="p-2 hover:bg-white/10 rounded-full transition-colors">
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


              <Disclosure.Button className="lg:hidden focus:outline-none">
                {open ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden px-4 pb-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item, i) =>
                item.subItems ? (
                  <div key={i}>
                    <span className="block font-semibold">{item.name}</span>
                    <div className="pl-4">
                      {item.subItems.map((subItem, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between py-1"
                        >
                          <NavLink
                            to={subItem.path}
                            className="block hover:text-gray-300"
                            onClick={() => closeDisclosure(close)}
                          >
                            {subItem.name}
                          </NavLink>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <NavLink
                      to={item.path}
                      className="block hover:text-gray-300"
                      onClick={() => closeDisclosure(close)}
                    >
                      {item.name}
                    </NavLink>
                  </div>
                )
              )}

              <div className="mt-4">
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
