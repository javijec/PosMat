import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

/**
 * A custom hook to prevent users from accidentally leaving a page with unsaved changes.
 * @param {boolean} isDirty - Whether the form has unsaved changes.
 * @param {string} message - The message to show in the confirmation dialog.
 */
const useConfirmExit = (
  isDirty,
  message = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
) => {
  // Prevent browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, message]);

  // Prevent internal navigation (React Router)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmed = window.confirm(message);
      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  return blocker;
};

export default useConfirmExit;
