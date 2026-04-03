import React, { useState, useEffect } from "react";
import { fetchData } from "../../../data";

const defaultHeroData = {
  doctorado: "",
  master: "",
  director: "",
};

const normalizeDirectorLabel = (value) =>
  String(value || "")
    .replace(/^\s*director(?:a)?\s*:\s*/i, "")
    .trim();

const getDirectorTitle = (value) => {
  const text = String(value || "").trim();
  if (/^\s*(directora|dra\.?)\b/i.test(text)) return "Directora:";
  if (/^\s*(director|dr\.?)\b/i.test(text)) return "Director:";
  return "Director:";
};

const Hero = () => {
  const [data, setData] = useState(defaultHeroData);
  const collection = "Home";

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const homeData = await fetchData(collection);
      setData(homeData?.[0] ?? defaultHeroData);
    } catch (error) {
      console.error("Error al obtener la configuración de inicio:", error);
      setData(defaultHeroData);
    }
  };

  return (
    <div className="relative h-[400px] md:h-[520px] overflow-hidden bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            'url("https://www.fi.mdp.edu.ar/images/01.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl relative py-6">
            <div>
              <h1 className="mb-5 text-3xl md:text-5xl font-extrabold leading-[1.05] tracking-tight">
                Posgrado en <br />
                <span className="text-ingenieria brightness-125">
                  Ciencia de Materiales
                </span>
              </h1>
            </div>

            <div className="rounded-lg border border-white/15 bg-black/30 p-5 md:p-6">
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-base md:text-xl font-light leading-relaxed">
                  Doctorado en Ciencia de Materiales{" "}
                  <span className="rounded-md border border-ingenieria/50 bg-ingenieria/30 px-2.5 py-0.5 text-xs font-semibold md:text-sm">
                    {data.doctorado}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-base md:text-xl font-light leading-relaxed">
                  Maestría en Ciencia y Tecnología de Materiales{" "}
                  <span className="rounded-md border border-ingenieria/50 bg-ingenieria/30 px-2.5 py-0.5 text-xs font-semibold md:text-sm">
                    {data.master}
                  </span>
                </p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm md:text-base font-medium text-white/80">
                  <span className="text-ingenieria-hover">{getDirectorTitle(data.director)}</span>{" "}
                  {normalizeDirectorLabel(data.director)}
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
