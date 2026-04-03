import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="flex h-full flex-col items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-5 text-center shadow-sm transition-all duration-300 group hover:shadow-lg"
  >
    <div className="mb-3 flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl bg-ingenieria/10 p-3 group-hover:bg-ingenieria group-hover:text-white transition-all duration-300">
      {React.cloneElement(icon, {
        className:
          icon.props.className +
          " h-7 w-7 sm:h-8 sm:w-8 transition-colors group-hover:text-white",
      })}
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] group-hover:text-ingenieria transition-colors">
      {title}
    </h3>
    <div className="mt-2 h-1 w-8 rounded-md bg-ingenieria/20 transition-all duration-500 group-hover:w-12 group-hover:bg-ingenieria" />
  </motion.div>
);

export default FeatureCard;
