import React from "react";

const Hero = () => {
  return (
    <div
      className="bg-cover bg-center h-[500px] relative"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Posgrado en Materiales</h1>
            <div className="mt-4 bg-black bg-opacity-50 p-4 rounded">
              <p className="text-lg">
                Doctorado en Ciencia de Materiales
                <br />
                (Categoría "A" CONEAU Res.222/2021)
              </p>
              <p className="text-lg mt-2">
                Maestría en Ciencia y Tecnología de Materiales <br />
                (CONEAU Res.221/2021)
              </p>
              <p className="text-lg mt-2">Directora: Dra. Josefina Ballarre</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-ingenieria hover:bg-ingenieria-hover text-white rounded">
                  Más Información
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
