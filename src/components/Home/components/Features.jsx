import React from "react";
import { BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-ingenieria" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Programas Especializados</h3>
            <p className="text-gray-600">Ofrecemos programas de maestría y doctorado en ciencia de materiales.</p>
          </div>
          <Link to="/professors">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-ingenieria" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profesores</h3>
              <p className="text-gray-600">Aprende de investigadores y profesionales reconocidos en el campo.</p>
            </div>
          </Link>
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-ingenieria" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Investigación Avanzada</h3>
            <p className="text-gray-600">Acceso a laboratorios y equipamiento de última generación.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
