import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FeatureCard = ({ icon, title, description, action = "Abrir" }) => (
  <motion.div
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="group flex h-full items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 text-left shadow-sm transition-all duration-300 hover:border-[var(--color-ingenieria)]/35 hover:shadow-md sm:flex-col sm:gap-0 sm:rounded-2xl sm:p-5"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ingenieria/10 p-2.5 transition-all duration-300 group-hover:bg-ingenieria group-hover:text-white sm:mb-4 sm:h-11 sm:w-11 sm:rounded-xl">
      {React.cloneElement(icon, {
        className:
          icon.props.className +
          " h-5 w-5 transition-colors group-hover:text-white",
      })}
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="text-base font-bold leading-tight text-[var(--text-main)] transition-colors group-hover:text-ingenieria sm:text-lg">
        {title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-main)]/68 sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-6">
        {description}
      </p>
    </div>

    <span className="ml-auto mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ingenieria/10 text-[var(--color-ingenieria)] transition-colors group-hover:bg-ingenieria group-hover:text-white sm:ml-0 sm:mt-4 sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-sm sm:font-semibold sm:group-hover:bg-transparent sm:group-hover:text-[var(--color-ingenieria)]">
      <span className="sr-only sm:not-sr-only">{action}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:ml-1" />
    </span>
  </motion.div>
);

export default FeatureCard;
