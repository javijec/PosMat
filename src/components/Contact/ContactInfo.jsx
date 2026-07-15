import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactInfo = ({ contactData }) => {
  return (
    <section className="h-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[var(--text-main)]">Información de contacto</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 shrink-0 text-ingenieria" />
          <div>
            <h3 className="font-semibold text-[var(--text-main)]">Email</h3>
            <p className="text-[var(--text-main)]/70">{contactData.email || "No especificado"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 shrink-0 text-ingenieria" />
          <div>
            <h3 className="font-semibold text-[var(--text-main)]">Teléfono</h3>
            <p className="text-[var(--text-main)]/70">{contactData.phone || "No especificado"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-ingenieria" />
          <div>
            <h3 className="font-semibold text-[var(--text-main)]">Dirección</h3>
            <p className="text-[var(--text-main)]/70">{contactData.adress || "No especificada"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 shrink-0 text-ingenieria" />
          <div>
            <h3 className="font-semibold text-[var(--text-main)]">Horario de atención</h3>
            <p className="text-[var(--text-main)]/70">
              {contactData.horario || "No especificado"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
