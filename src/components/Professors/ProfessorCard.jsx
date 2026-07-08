import React from "react";
import { Mail, UserCircle2 } from "lucide-react";

const ProfessorCard = ({ professor, onClick }) => {
  const imageUrl = professor.imageUrl || professor.photoUrl || "";

  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg-card)] rounded-xl shadow-sm p-6 border border-[var(--border-subtle)] transition-colors duration-300 flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)]/30">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Foto de ${professor.firstName} ${professor.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-8 w-8" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg text-[var(--text-main)]">
            {`${professor.title} ${professor.lastName}, ${professor.firstName}`}
          </h3>
          <div className="flex items-center text-[var(--text-main)]/60 mt-1 text-sm break-all">
            <Mail className="w-3.5 h-3.5 mr-2 shrink-0" />
            {professor.email || "Sin correo registrado"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorCard;
