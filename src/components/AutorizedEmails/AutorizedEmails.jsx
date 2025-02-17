import { useState, useEffect } from "react";
import { db } from "../../firebase/dbConnection";
import { collection, setDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

const AuthorizedEmails = () => {
  const [email, setEmail] = useState("");
  const [authorizedEmails, setAuthorizedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar emails autorizados
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

  // Agregar nuevo email
  const handleAddEmail = async (e) => {
    e.preventDefault();

    try {
      // Verificar si el email ya existe
      const q = query(collection(db, "authorizedEmails"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Este email ya está autorizado");
        return;
      }

      // Guardar el documento con el email como ID
      await setDoc(doc(db, "authorizedEmails", email), {
        email: email,
        createdAt: new Date().toISOString(),
      });

      setAuthorizedEmails([
        ...authorizedEmails,
        {
          id: email, // Ahora el ID es el email
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

  // Eliminar email
  const handleDeleteEmail = async (id) => {
    try {
      await deleteDoc(doc(db, "authorizedEmails", id));
      setAuthorizedEmails(authorizedEmails.filter((email) => email.id !== id));
    } catch (err) {
      setError("Error al eliminar el email");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestionar Emails Autorizados</h2>

      <form onSubmit={handleAddEmail} className="mb-6">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@gmail.com"
            className="flex-1 p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Agregar
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className="space-y-2">
        {authorizedEmails.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>{item.email}</span>
            <button onClick={() => handleDeleteEmail(item.id)} className="text-red-500 hover:text-red-700">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorizedEmails;
