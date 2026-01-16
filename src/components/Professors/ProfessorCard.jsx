import { motion } from "framer-motion";
import { Mail, ChevronRight } from "lucide-react";

const ProfessorCard = ({ professor, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onClick}
      className="bg-[var(--bg-card)] rounded-xl shadow-sm p-6 cursor-pointer border border-[var(--border-subtle)] hover:border-ingenieria/30 hover:shadow-md transition-all duration-300 group flex justify-between items-center"
    >
      <div>
        <h3 className="font-bold text-lg text-[var(--text-main)] group-hover:text-ingenieria transition-colors">
          {`${professor.title} ${professor.lastName}, ${professor.firstName}`}
        </h3>
        <div className="flex items-center text-[var(--text-main)]/60 mt-1 text-sm">
          <Mail className="w-3.5 h-3.5 mr-2" />
          {professor.email}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-ingenieria/40 group-hover:text-ingenieria group-hover:translate-x-1 transition-all" />
    </motion.div>
  );
};

export default ProfessorCard;
