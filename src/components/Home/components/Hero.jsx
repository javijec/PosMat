import React from "react";
import { useState, useEffect } from "react";
import { fetchData } from "../../../firebase/CRUD";

const Hero = () => {
  const [data, setData] = useState([]);
  const collection = "Home";

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const Home = await fetchData(collection);
      setData(Home[0]);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      setData({});
    }
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{
          backgroundImage:
            'url("https://www.fi.mdp.edu.ar/images/01.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Posgrado en Ciencia de Materiales
            </h1>
            <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-white/10">
              <p className="text-xl font-light leading-relaxed">
                Doctorado en Ciencia de Materiales{" "}
                <span className="text-blue-300">({data.doctorado})</span>
              </p>
              <p className="text-xl font-light mt-4 leading-relaxed">
                Maestría en Ciencia y Tecnología de Materiales{" "}
                <span className="text-blue-300">({data.master})</span>
              </p>
              <p className="text-xl mt-4">{data.director}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
