import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext"; // Nuevo import

const Footer = () => {
  const { user } = useAuth(); // Obtener usuario logueado

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>posgrado@fi.mdp.edu.ar</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>(0223) 481-6600</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Juan B. Justo 4302, Mar del Plata</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Otros</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Link to="/links" className="hover:text-blue-300">
                  Enlaces Útiles
                </Link>
                {user && (
                  <Link
                    to="/links/edit"
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </Link>
                )}
              </li>
              <li>
                <Link to="/archivos" className="hover:text-blue-300">
                  Archivos
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link to="/faq" className="hover:text-blue-300">
                  FAQ
                </Link>
                {user && (
                  <Link
                    to="/faq/edit"
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} Posgrado en Materiales. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
