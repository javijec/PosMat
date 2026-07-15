import React from "react";
import { BookOpen, FileText, GraduationCap, Mail, ScrollText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const quickLinks = [
  {
    path: "/courses",
    title: "Cursos",
    description: "Consultá la oferta académica y filtrá por año, semestre o tipo.",
    icon: BookOpen,
  },
  {
    path: "/tesis",
    title: "Tesis",
    description: "Explorá tesis de doctorado y maestría por año, autor o director.",
    icon: GraduationCap,
  },
  {
    path: "/rules",
    title: "Reglamentos",
    description: "Encontrá requisitos, procedimientos y documentación académica.",
    icon: ScrollText,
  },
  {
    path: "/professors",
    title: "Profesores",
    description: "Accedé al equipo docente e investigadores del Posgrado.",
    icon: Users,
  },
  {
    path: "/students",
    title: "Estudiantes",
    description: "Conocé tesistas y temas de investigación en curso.",
    icon: FileText,
  },
  {
    path: "/contact",
    title: "Contacto",
    description: "Ubicación, horarios y canales de atención de la coordinación.",
    icon: Mail,
  },
];

const Features = () => {
  return (
    <section className="bg-[var(--bg-surface)] py-8 transition-colors md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-5 max-w-2xl sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ingenieria)]">
            Accesos rápidos
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--text-main)] sm:text-2xl md:text-3xl">
            Encontrá rápido la información del Posgrado
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-main)]/70 md:text-base">
            Los accesos más usados reunidos en un solo lugar para navegar sin perder tiempo.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {quickLinks.map(({ path, title, description, icon: Icon }) => (
            <Link key={path} to={path} className="group">
              <FeatureCard
                icon={<Icon className="text-[#447c82]" />}
                title={title}
                description={description}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
