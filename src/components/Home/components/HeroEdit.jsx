import React, { useState, useEffect } from "react";
import { fetchData, saveItem } from "../../../firebase/CRUD";

const HeroEdit = () => {
  const collection = "Home";
  const [heroData, setHeroData] = useState({
    doctorado: "",
    master: "",
    director: "",
  });
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    const loadHero = async () => {
      const data = await fetchData(collection);
      if (data.length > 0) {
        const doc = data[0];
        setDocId(doc.id);
        setHeroData({
          doctorado: doc.doctorado || "",
          master: doc.master || "",
          director: doc.director || "",
        });
      }
    };
    loadHero();
  }, []);

  const handleChange = (e) => {
    setHeroData({ ...heroData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (docId) {
      await saveItem(collection, docId, heroData, { merge: true });
      alert("Hero actualizado");
    } else {
      alert("Documento no encontrado");
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Hero</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctorado
            </label>
            <input
              type="text"
              name="doctorado"
              value={heroData.doctorado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Doctorado en Ciencia de Materiales"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maestría
            </label>
            <input
              type="text"
              name="master"
              value={heroData.master}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Maestría en Ciencia y Tecnología de Materiales"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Director
            </label>
            <input
              type="text"
              name="director"
              value={heroData.director}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nombre del director"
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

export default HeroEdit;
