import React from "react";
import { BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 auto-rows-fr">
          <Link to="/courses" className="group">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-[#447c82]" />}
              title="Cursos"
              description="Descubre los cursos disponibles"
            />
          </Link>
          <Link to="/professors" className="group">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-[#447c82]" />}
              title="Profesores"
              description="Aprende de investigadores y profesionales reconocidos en el campo."
            />
          </Link>
          <Link to="/students" className="group">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-[#447c82]" />}
              title="Alumnos"
              description="Conoce a nuestros estudiantes y sus logros."
            />
          </Link>
          <Link to="/tesis" className="group">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-[#447c82]" />}
              title="Tesis"
              description="Tesis de doctorado y maestría."
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
