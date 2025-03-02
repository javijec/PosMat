// src/components/Header/Header.jsx
import React from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { path: "/", name: "Inicio", editPath: "/home/edit" },
  { path: "/about", name: "Acerca de", editPath: "/about/edit" },
  {
    name: "Comunidad",
    subItems: [
      {
        path: "/professors",
        name: "Profesores",
        editPath: "/professors/edit",
      },
      {
        path: "/students",
        name: "Estudiantes",
        editPath: "/students/edit",
      },
    ],
  },
  {
    name: "Posgrado",
    subItems: [
      { path: "/rules", name: "Reglamento", editPath: "/rules/edit" }, // sin editPath = sin botón de edición
      {
        path: "/courses",
        name: "Cursos",
        editPath: "/courses/edit",
      },
      {
        path: "/tesis",
        name: "Tesis",
        editPath: "/tesis/edit",
      },
    ],
  },
  { path: "/contact", name: "Contacto", editPath: "/contact/edit" },
];

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
    <Disclosure as="header" className="bg-ingenieria text-white shadow">
      {({ open, close }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
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
                                  {user && subItem.editPath && (
                                    <NavLink
                                      to={subItem.editPath}
                                      className="ml-2 p-1 hover:bg-gray-700 rounded"
                                      onClick={() => closeDisclosure(menuClose)}
                                    >
                                      <PencilSquareIcon className="h-4 w-4" />
                                    </NavLink>
                                  )}
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
                      className="px-2 py-1 hover:text-gray-300"
                    >
                      {item.name}
                    </NavLink>
                    {user && item.editPath && (
                      <NavLink
                        to={item.editPath}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </NavLink>
                    )}
                  </div>
                )
              )}

              {/* User Menu */}
              <Menu as="div" className="relative inline-block text-left">
                {({ close: menuClose }) => (
                  <>
                    <Menu.Button className="p-2 hover:bg-ingenieria-dark rounded-full transition-colors">
                      <UserIcon className="h-5 w-5" />
                    </Menu.Button>
                    {user ? (
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-ingenieria shadow-lg z-10 rounded-md">
                        {user.email === "javijec@gmail.com" && (
                          <Menu.Item>
                            {({ active }) => (
                              <NavLink
                                to="/manage-emails"
                                className={`block px-4 py-2 text-sm ${
                                  active ? "bg-gray-700" : ""
                                }`}
                                onClick={() => closeDisclosure(menuClose)}
                              >
                                Gestionar Emails
                              </NavLink>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                handleAuth();
                                closeDisclosure(menuClose);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-gray-700" : ""
                              }`}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    ) : (
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-ingenieria shadow-lg z-10 rounded-md">
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/login"
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-gray-700" : ""
                              }`}
                              onClick={() => closeDisclosure(menuClose)}
                            >
                              Ingresar
                            </NavLink>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    )}
                  </>
                )}
              </Menu>
            </nav>

            <Disclosure.Button className="lg:hidden focus:outline-none">
              {open ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Disclosure.Button>
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
                          {user && subItem.editPath && (
                            <NavLink
                              to={subItem.editPath}
                              className="ml-2 p-1 hover:bg-gray-700 rounded"
                              onClick={() => closeDisclosure(close)}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </NavLink>
                          )}
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
                    {user && item.editPath && (
                      <NavLink
                        to={item.editPath}
                        className="p-1 hover:bg-gray-700 rounded"
                        onClick={() => closeDisclosure(close)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </NavLink>
                    )}
                  </div>
                )
              )}

              <div className="mt-4">
                {user ? (
                  <>
                    {user.email && (
                      <NavLink
                        to="/manage-emails"
                        className="block text-sm text-gray-300 hover:text-white mb-2"
                      >
                        Gestionar Emails
                      </NavLink>
                    )}
                    <button
                      onClick={handleAuth}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="w-full px-4 py-2 text-left hover:bg-gray-700"
                  >
                    Ingresar
                  </NavLink>
                )}
              </div>
            </nav>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
