import React from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Define navigation items locally
const menuItems = [
  { path: "/", name: "Inicio" },
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

const Header = () => (
  <Disclosure as="header" className="bg-ingenieria text-white shadow">
    {({ open }) => (
      <>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://www.fi.mdp.edu.ar/images/logofi-lightblue-with-text.png" alt="Logo" className="h-10" />
            <span className="text-xl font-bold">Posgrado en Materiales</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item, i) =>
              item.subItems ? (
                <Menu as="div" key={i} className="relative inline-block text-left">
                  <Menu.Button className="px-2 py-1 hover:text-gray-300 focus:outline-none">{item.name}</Menu.Button>
                  <Menu.Items className="absolute left-0 mt-2 w-40 bg-ingenieria shadow-lg z-10">
                    {item.subItems.map((subItem, j) => (
                      <Menu.Item key={j}>
                        {({ active }) => (
                          <NavLink to={subItem.path} className={`block px-4 py-2 ${active ? "bg-gray-700" : ""}`}>
                            {subItem.name}
                          </NavLink>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              ) : (
                <NavLink key={i} to={item.path} className="px-2 py-1 hover:text-gray-300">
                  {item.name}
                </NavLink>
              )
            )}
          </nav>
          <Disclosure.Button className="md:hidden focus:outline-none">
            {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </Disclosure.Button>
        </div>
        <Disclosure.Panel className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, i) =>
              item.subItems ? (
                <div key={i}>
                  <span className="block font-semibold">{item.name}</span>
                  <div className="pl-4">
                    {item.subItems.map((subItem, j) => (
                      <NavLink key={j} to={subItem.path} className="block hover:text-gray-300">
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={i} to={item.path} className="block hover:text-gray-300">
                  {item.name}
                </NavLink>
              )
            )}
          </nav>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
);

export default Header;
