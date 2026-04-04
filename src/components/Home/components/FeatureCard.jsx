import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="flex h-full flex-col items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-3 text-center shadow-sm transition-all duration-300 group sm:rounded-xl sm:p-5 hover:shadow-lg"
  >
    <div className="mb-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ingenieria/10 p-2.5 transition-all duration-300 group-hover:bg-ingenieria group-hover:text-white sm:mb-3 sm:h-16 sm:w-16 sm:rounded-xl sm:p-3">
      {React.cloneElement(icon, {
        className:
          icon.props.className +
          " h-5 w-5 transition-colors group-hover:text-white sm:h-8 sm:w-8",
      })}
    </div>
    <h3 className="text-sm font-semibold leading-tight text-[var(--text-main)] transition-colors group-hover:text-ingenieria sm:text-xl sm:font-bold">
      {title}
    </h3>
    <div className="mt-1.5 h-0.5 w-6 rounded-md bg-ingenieria/20 transition-all duration-500 group-hover:w-8 group-hover:bg-ingenieria sm:mt-2 sm:h-1 sm:w-8 sm:group-hover:w-12" />
  </motion.div>
);

export default FeatureCard;
