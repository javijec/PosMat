import React from "react";
import { useState, useEffect } from "react";
import { fetchData } from "../../firebase/CRUD";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

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
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Contacto</h1>

        <div className="lg:flex lg:gap-8">
          {/* Columna izquierda - Tabs de información y formulario */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-semibold mb-6">
                    Información de Contacto
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-ingenieria mr-3" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-gray-600">{contactData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-6 w-6 text-ingenieria mr-3" />
                      <div>
                        <h3 className="font-semibold">Teléfono</h3>
                        <p className="text-gray-600">{contactData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 text-ingenieria mr-3" />
                      <div>
                        <h3 className="font-semibold">Dirección</h3>
                        <p className="text-gray-600">{contactData.adress}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-ingenieria mr-3" />
                      <div>
                        <h3 className="font-semibold">Horario de Atención</h3>
                        <p className="text-gray-600">
                          {contactData.horario || "No especificado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Mapa */}
          <div className="lg:w-1/2">
            <div className="h-[200px] lg:h-[450px] bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.5050395530075!2d-57.58610460913509!3d-38.01200397299919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dec67072377d%3A0xc3c80a9a9de624d3!2sFacultad%20de%20Ingenier%C3%ADa!5e0!3m2!1ses-419!2sar!4v1739051762079!5m2!1ses-419!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
