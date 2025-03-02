import { useState, useEffect } from "react";
import { db } from "../../firebase/dbConnection";
import {
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import AuthorizedEmailForm from "./AuthorizedEmailForm";
import AuthorizedEmailsList from "./AuthorizedEmailsList";

const AuthorizedEmails = () => {
  const [email, setEmail] = useState("");
  const [authorizedEmails, setAuthorizedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAuthorizedEmails = async () => {
      try {
        const emailsCollection = collection(db, "authorizedEmails");
        const emailsSnapshot = await getDocs(emailsCollection);
        const emailsList = emailsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAuthorizedEmails(emailsList);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los emails");
        setLoading(false);
      }
    };
    loadAuthorizedEmails();
  }, []);

  const handleAddEmail = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "authorizedEmails"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Este email ya está autorizado");
        return;
      }

      await setDoc(doc(db, "authorizedEmails", email), {
        email: email,
        createdAt: new Date().toISOString(),
      });

      setAuthorizedEmails([
        ...authorizedEmails,
        {
          id: email,
          email: email,
          createdAt: new Date().toISOString(),
        },
      ]);

      setEmail("");
      setError("");
    } catch (err) {
      setError("Error al agregar el email");
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      await deleteDoc(doc(db, "authorizedEmails", id));
      setAuthorizedEmails(authorizedEmails.filter((item) => item.id !== id));
    } catch (err) {
      setError("Error al eliminar el email");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestionar Emails Autorizados</h2>
      <AuthorizedEmailForm
        email={email}
        setEmail={setEmail}
        error={error}
        handleAddEmail={handleAddEmail}
      />
      <AuthorizedEmailsList
        authorizedEmails={authorizedEmails}
        handleDeleteEmail={handleDeleteEmail}
      />
    </div>
  );
};

export default AuthorizedEmails;
