import { createContext, useContext, useEffect, useState } from "react";
import { activeAuthProvider, authProvider } from "../auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    typeof activeAuthProvider.getPersistedUser === "function"
      ? activeAuthProvider.getPersistedUser()
      : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loginUser = async (email, password) => {
    try {
      setError(null);
      const result = await activeAuthProvider.signIn(email, password);
      setUser(result);
      return result;
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError(error.message);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email, password) => {
    try {
      setError(null);
      const result = await activeAuthProvider.signUp(email, password);
      setUser(result);
      return result;
    } catch (error) {
      console.error("Error en el registro:", error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await activeAuthProvider.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = activeAuthProvider.observeAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    loading,
    authProvider,
    signInWithEmailAndPassword: loginUser,
    signUpWithEmailAndPassword,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
