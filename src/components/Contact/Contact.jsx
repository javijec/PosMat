import React, { useState, useEffect } from "react";
import { fetchData } from "../../data";
import ContactInfo from "./ContactInfo";
import ContactMap from "./ContactMap";
import { MapPinned } from "lucide-react";
import PageHeader from "../shared/PageHeader";

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
    <main className="min-h-screen bg-[var(--bg-surface)] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          eyebrow="Posgrado"
          icon={MapPinned}
          title="Contacto"
          description="Canales de atención y ubicación de la Facultad de Ingeniería."
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <ContactInfo contactData={contactData} />
          </div>

          <div>
            <ContactMap />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
