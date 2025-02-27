import React from "react";

const Hero = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
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
                Doctorado en Ciencia de Materiales
                <span className="text-blue-300">
                  (Categoría "A" CONEAU Res.222/2021)
                </span>
              </p>
              <p className="text-xl font-light mt-4 leading-relaxed">
                Maestría en Ciencia y Tecnología de Materiales
                <span className="text-blue-300">(CONEAU Res.221/2021)</span>
              </p>
              <p className="text-xl mt-4">Directora: Dra. Josefina Ballarre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
