import React, { useState, useEffect } from "react";
import { fetchData, saveItem } from "../../firebase/CRUD";

const ContactEdit = () => {
  const collection = "contacto";
  const [contactData, setContactData] = useState({
    horario: "",
    adress: "",
    email: "",
    phone: "",
  });
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    const loadContact = async () => {
      const data = await fetchData(collection);
      if (data.length > 0) {
        const doc = data[0];
        setDocId(doc.id);
        setContactData({
          horario: doc.horario || "",
          adress: doc.adress || "",
          email: doc.email || "",
          phone: doc.phone || "",
        });
      }
    };
    loadContact();
  }, []);

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (docId) {
      await saveItem(collection, docId, contactData, { merge: true });
      alert("Contacto actualizado");
    } else {
      alert("Documento no encontrado");
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Contacto</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horario
            </label>
            <input
              type="text"
              name="horario"
              value={contactData.horario}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Lunes a Viernes: 9:00 - 17:00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="adress"
              value={contactData.adress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Juan B. Justo 4302, Mar del Plata"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="posgrado@fi.mdp.edu.ar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              value={contactData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="(0223) 481-6600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactEdit;
