import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-ingenieria border-b border-ingenieria/10 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="https://www.fi.mdp.edu.ar/images/logofi-lightblue-with-text.png"
                  alt="Logo"
                  className="h-12"
                />
                <span className="text-xl font-bold text-gray-900">Posgrado en Materiales</span>
              </Link>

              <Disclosure.Button className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-[#346266] focus:outline-none">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>

              <div className="hidden md:flex space-x-8">
                <CustomNavLink to="/">Inicio</CustomNavLink>
                <CustomNavLink to="/about">Acerca de</CustomNavLink>
                <CustomNavLink to="/courses">Cursos</CustomNavLink>
                <CustomNavLink to="/contact">Contacto</CustomNavLink>
              </div>
            </div>

            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <NavLinkMobile to="/">Inicio</NavLinkMobile>
                  <NavLinkMobile to="/about">Acerca de</NavLinkMobile>
                  <NavLinkMobile to="/courses">Cursos</NavLinkMobile>
                  <NavLinkMobile to="/contact">Contacto</NavLinkMobile>
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
};

const CustomNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `transition-colors text-white hover:text-black relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:bg-[#447c82] after:transition-all ${
        isActive ? "text-[#447c82] after:w-full" : "after:w-0"
      }`
    }
  >
    {children}
  </NavLink>
);

const NavLinkMobile = ({ to, children }) => (
  <Disclosure.Button
    as={Link}
    to={to}
    className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#346266] transition-colors"
  >
    {children}
  </Disclosure.Button>
);

export default Header;
