import React, { useState, useEffect } from "react";
import { fetchData } from "../../../data";

const Hero = () => {
  const [data, setData] = useState({
    doctorado: "",
    master: "",
    director: "",
  });
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
      setData({ doctorado: "", master: "", director: "" });
    }
  };

  return (
    <div className="relative h-[480px] md:h-[650px] overflow-hidden bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            'url("https://www.fi.mdp.edu.ar/images/01.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl relative">
            <div>
              <h1 className="text-4xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
                Posgrado en <br />
                <span className="text-ingenieria brightness-125">
                  Ciencia de Materiales
                </span>
              </h1>
            </div>

            <div className="bg-black/30 p-8 rounded-lg border border-white/15">
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-light leading-relaxed flex items-center gap-3">
                  Doctorado en Ciencia de Materiales{" "}
                  <span className="bg-ingenieria/30 px-3 py-0.5 rounded-md text-sm font-semibold border border-ingenieria/50">
                    {data.doctorado}
                  </span>
                </p>
                <p className="text-xl md:text-2xl font-light leading-relaxed flex items-center gap-3">
                  Maestría en Ciencia y Tecnología de Materiales{" "}
                  <span className="bg-ingenieria/30 px-3 py-0.5 rounded-md text-sm font-semibold border border-ingenieria/50">
                    {data.master}
                  </span>
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-lg font-medium text-white/80">
                  <span className="text-ingenieria-hover">Director:</span>{" "}
                  {data.director}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
