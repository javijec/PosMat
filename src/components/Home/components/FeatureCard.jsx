import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-[var(--bg-card)] p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border-subtle)] h-full flex flex-col items-center text-center group"
  >
    <div className="bg-ingenieria/10 p-5 rounded-xl w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-ingenieria group-hover:text-white transition-all duration-300 shrink-0">
      {React.cloneElement(icon, {
        className:
          icon.props.className +
          " h-10 w-10 transition-colors group-hover:text-white",
      })}
    </div>
    <h3 className="text-2xl font-bold text-[var(--text-main)] group-hover:text-ingenieria transition-colors">
      {title}
    </h3>
    <div className="mt-4 w-12 h-1 bg-ingenieria/20 group-hover:w-20 group-hover:bg-ingenieria transition-all duration-500 rounded-md" />
  </motion.div>
);

export default FeatureCard;
