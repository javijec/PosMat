import React, { useState, useEffect } from "react";
import { fetchData } from "../../firebase/CRUD";
import ContactInfo from "./ContactInfo";
import ContactMap from "./ContactMap";

const Contact = () => {
  const [contactData, setContactData] = useState({
    adress: "",
    email: "",
    phone: "",
    horario: "",
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
          horario: doc.horario || "",
        });
      }
    };
    loadContact();
  }, []);

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Contacto</h1>

        <div className="md:flex md:gap-8">
          {/* Columna izquierda - Información y formulario */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <ContactInfo contactData={contactData} />
          </div>

          {/* Columna derecha - Mapa */}
          <div className="md:w-1/2">
            <ContactMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
