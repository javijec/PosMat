import React from "react";
import { BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-[#447c82]" />}
            title="Programas Especializados"
            description="Ofrecemos programas de maestría y doctorado en ciencia de materiales."
          />
          <Link to="/professors" className="group">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-[#447c82]" />}
              title="Profesores"
              description="Aprende de investigadores y profesionales reconocidos en el campo."
            />
          </Link>
          <FeatureCard
            icon={<Award className="h-8 w-8 text-[#447c82]" />}
            title="Investigación Avanzada"
            description="Acceso a laboratorios y equipamiento de última generación."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className="bg-[#447c82]/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-[#447c82]">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Features;
