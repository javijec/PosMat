import React from "react";
import { BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-[var(--bg-surface)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 auto-rows-fr">
          <Link to="/courses" className="group">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-[#447c82]" />}
              title="Cursos"
            />
          </Link>
          <Link to="/professors" className="group">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-[#447c82]" />}
              title="Profesores"
            />
          </Link>
          <Link to="/students" className="group">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-[#447c82]" />}
              title="Alumnos"
            />
          </Link>
          <Link to="/tesis" className="group">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-[#447c82]" />}
              title="Tesis"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
