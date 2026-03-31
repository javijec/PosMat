import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/dbConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { fetchData } from "../data";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthorizedEmail = async (email) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const authorizedEmails = await fetchData("authorizedEmails", { force: true });

    return authorizedEmails.some(
      (item) => item.email?.trim().toLowerCase() === normalizedEmail
    );
  };

  const loginUser = async (email, password) => {
    try {
      const result = await firebaseSignIn(auth, email, password);

      const isAuthorized = await checkAuthorizedEmail(result.user.email);

      if (!isAuthorized) {
        await signOut(auth);
        throw new Error("Email no autorizado. Contacta al administrador.");
      }

      return result.user;
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError(error.message);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email, password) => {
    try {
      // Primero verificamos si el email está autorizado
      const isAuthorized = await checkAuthorizedEmail(email);

      if (!isAuthorized) {
        throw new Error("Email no autorizado. Contacta al administrador.");
      }

      // Si está autorizado, procedemos a crear el usuario
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error en el registro:", error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithEmailAndPassword: loginUser,
    signUpWithEmailAndPassword,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
