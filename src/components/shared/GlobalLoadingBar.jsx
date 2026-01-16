import React from "react";
import { useIsMutating } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A sleek, NProgress-style loading bar that appears at the top of the browser
 * whenever a TanStack Query mutation (add, update, delete) is pending.
 */
const GlobalLoadingBar = () => {
  const isMutating = useIsMutating();

  return (
    <AnimatePresence>
      {isMutating > 0 && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-ingenieria)] z-[9999] shadow-[0_0_10px_rgba(68,124,130,0.5)]"
        />
      )}
    </AnimatePresence>
  );
};

export default GlobalLoadingBar;
