import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <div className="relative h-[480px] md:h-[650px] overflow-hidden bg-gray-900">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            'url("https://www.fi.mdp.edu.ar/images/01.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
                Posgrado en <br />
                <span className="text-ingenieria brightness-125">
                  Ciencia de Materiales
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-light leading-relaxed flex items-center gap-3">
                  Doctorado en Ciencia de Materiales{" "}
                  <span className="bg-ingenieria/30 px-3 py-0.5 rounded-full text-sm font-semibold border border-ingenieria/50">
                    {data.doctorado}
                  </span>
                </p>
                <p className="text-xl md:text-2xl font-light leading-relaxed flex items-center gap-3">
                  Maestría en Ciencia y Tecnología de Materiales{" "}
                  <span className="bg-teal-500/30 px-3 py-0.5 rounded-full text-sm font-semibold border border-teal-500/50">
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
