import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/dbConnection";
import { fetchData } from "../../data";

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.uid,
    email: user.email,
    role: "admin",
    provider: "firebase",
  };
};

const checkAuthorizedEmail = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const authorizedEmails = await fetchData("authorizedEmails", { force: true });

  return authorizedEmails.some(
    (item) => item.email?.trim().toLowerCase() === normalizedEmail
  );
};

const observeAuthState = (callback) =>
  onAuthStateChanged(auth, (user) => {
    callback(normalizeUser(user));
  });

const getCurrentUser = async () => normalizeUser(auth.currentUser);

const signIn = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const isAuthorized = await checkAuthorizedEmail(result.user.email);

  if (!isAuthorized) {
    await signOut(auth);
    throw new Error("Email no autorizado. Contacta al administrador.");
  }

  return normalizeUser(result.user);
};

const signUp = async (email, password) => {
  const isAuthorized = await checkAuthorizedEmail(email);

  if (!isAuthorized) {
    throw new Error("Email no autorizado. Contacta al administrador.");
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  return normalizeUser(result.user);
};

const logout = async () => {
  await signOut(auth);
  return true;
};

export { getCurrentUser, logout, observeAuthState, signIn, signUp };
