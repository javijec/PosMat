import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#447c82] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://www.fi.mdp.edu.ar/images/logofi-lightblue-with-text.png" alt="Logo" className="h-10" />
            <span className="text-xl font-bold">Posgrado en Materiales</span>
          </Link>

          {/* Botón hamburguesa */}
          <button onClick={toggleMenu} className="md:hidden p-2 rounded-md hover:bg-[#346266] focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          {/* Menú escritorio */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Inicio
            </Link>
            <Link to="/about" className="hover:text-blue-200 transition-colors">
              Acerca de
            </Link>
            <Link to="/courses" className="hover:text-blue-200 transition-colors">
              Cursos
            </Link>
            <Link to="/contact" className="hover:text-blue-200 transition-colors">
              Contacto
            </Link>
          </div>
        </div>

        {/* Menú móvil */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-[#346266] transition-colors">
              Inicio
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-[#346266] transition-colors">
              Acerca de
            </Link>
            <Link to="/courses" className="block px-3 py-2 rounded-md hover:bg-[#346266] transition-colors">
              Cursos
            </Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-[#346266] transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
