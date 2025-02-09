import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { headerRoutes } from "../../routes";

const Header = () => {
  const location = useLocation();

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
                <span className="text-xl font-bold text-white">Posgrado en Materiales</span>
              </Link>

              <Disclosure.Button className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-[#346266] focus:outline-none">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>

              <div className="hidden md:flex space-x-8">
                {headerRoutes.map((route, index) =>
                  route.routes ? (
                    <Disclosure key={index} as="div" className="relative group">
                      {({ open, close }) => (
                        <>
                          <Disclosure.Button className="transition-colors text-white hover:text-black relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:bg-[#447c82] after:transition-all after:w-0">
                            {route.name}
                          </Disclosure.Button>
                          <Transition
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Disclosure.Panel className="absolute left-0 mt-2 w-48 bg-ingenieria rounded-md shadow-lg py-1 z-10">
                              {route.routes.map((subRoute) => (
                                <CustomNavLink key={subRoute.path} to={subRoute.path} onClick={() => close()}>
                                  {subRoute.name}
                                </CustomNavLink>
                              ))}
                            </Disclosure.Panel>
                          </Transition>
                        </>
                      )}
                    </Disclosure>
                  ) : (
                    <CustomNavLink key={route.path} to={route.path}>
                      {route.name}
                    </CustomNavLink>
                  )
                )}
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
                  {headerRoutes.map((route, index) =>
                    route.routes ? (
                      <div key={index}>
                        <NavLinkMobile to="#">{route.name}</NavLinkMobile>
                        {route.routes.map((subRoute) => (
                          <NavLinkMobile key={subRoute.path} to={subRoute.path}>
                            {subRoute.name}
                          </NavLinkMobile>
                        ))}
                      </div>
                    ) : (
                      <NavLinkMobile key={route.path} to={route.path}>
                        {route.name}
                      </NavLinkMobile>
                    )
                  )}
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
};

const CustomNavLink = ({ to, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-2 text-sm transition-colors text-white hover:text-black relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:bg-[#447c82] after:transition-all ${
          isActive ? "text-[#447c82] after:w-full" : "after:w-0"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

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
