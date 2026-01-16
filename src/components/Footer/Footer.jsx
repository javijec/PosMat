import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchData } from "../../firebase/CRUD";

const Footer = () => {
  const { user } = useAuth();
  const [contactData, setContactData] = useState({
    adress: "",
    email: "",
    phone: "",
  });
  const collection = "contacto";

  useEffect(() => {
    const loadContact = async () => {
      const data = await fetchData(collection);
      if (data.length > 0) {
        const doc = data[0];
        setContactData({
          adress: doc.adress || "",
          email: doc.email || "",
          phone: doc.phone || "",
        });
      }
    };
    loadContact();
  }, []);

  return (
    <footer className="bg-[var(--bg-header)] text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>{contactData.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>{contactData.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{contactData.adress}</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Otros</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 justify-between">
                <Link to="/links" className="hover:text-blue-300">
                  Enlaces Útiles
                </Link>
              </li>
              <li className="flex items-center gap-2 justify-between">
                <Link to="/archivos" className="hover:text-blue-300 ">
                  Archivos
                </Link>
              </li>
              <li className="flex items-center gap-2 justify-between">
                <Link to="/faq" className="hover:text-blue-300 ">
                  FAQ
                </Link>
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
