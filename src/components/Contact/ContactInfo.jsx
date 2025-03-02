import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactInfo = ({ contactData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
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
  );
};

export default ContactInfo;
