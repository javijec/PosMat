import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchData } from "../../data";

const Footer = () => {
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
    <footer className="bg-[var(--bg-header)] py-7 text-white md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-5 text-xs md:grid-cols-3 md:gap-8 md:text-base">
          <div>
            <h3 className="mb-2 text-sm font-semibold md:mb-4 md:text-lg">
              Contacto
            </h3>
            <div className="space-y-1.5 md:space-y-2">
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 md:h-5 md:w-5" />
                <span>{contactData.email}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 md:h-5 md:w-5" />
                <span>{contactData.phone}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 md:h-5 md:w-5" />
                <span>{contactData.adress}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold md:mb-4 md:text-lg">
              Otros
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link to="/links" className="transition-colors hover:text-blue-300">
                  Enlaces Útiles
                </Link>
              </li>
              <li>
                <Link to="/archivos" className="transition-colors hover:text-blue-300">
                  Archivos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition-colors hover:text-blue-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 border-t border-white/15 pt-4 text-center text-[11px] leading-5 md:mt-8 md:pt-8 md:text-base">
          <p>
            &copy; {new Date().getFullYear()} Posgrado en Materiales. Todos los
            derechos reservados. Página creada por{" "}
            <a
              href="https://javijec.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              Javier Camargo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
