import React from "react";
import { BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <div className="pt-6 pb-3 sm:py-10 md:py-12 bg-[var(--bg-surface)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 md:gap-5 auto-rows-fr">
          <Link to="/courses" className="group">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-[#447c82]" />}
              title="Cursos"
            />
          </Link>
          <Link to="/professors" className="group">
            <FeatureCard
              icon={<Users className="h-6 w-6 text-[#447c82]" />}
              title="Profesores"
            />
          </Link>
          <Link to="/students" className="group">
            <FeatureCard
              icon={<Users className="h-6 w-6 text-[#447c82]" />}
              title="Alumnos"
            />
          </Link>
          <Link to="/tesis" className="group">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-[#447c82]" />}
              title="Tesis"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
