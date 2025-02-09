import React from "react";
import { BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className="bg-[#447c82]/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-[#447c82]">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Features;
