import React from "react";

const News = () => {
  return (
    <div className="py-16 bg-[var(--bg-surface)] transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Últimas Noticias
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-[var(--bg-card)] rounded-xl shadow-md overflow-hidden border border-[var(--border-subtle)] hover:shadow-lg transition-all"
            >
              <img
                src={`https://images.unsplash.com/photo-156277405${item}053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                alt="News"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[var(--text-main)]">
                  Título de la Noticia {item}
                </h3>
                <p className="text-[var(--text-main)]/70 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <a
                  href="#"
                  className="text-[var(--color-ingenieria)] hover:text-[var(--color-ingenieria-hover)] font-semibold transition-colors"
                >
                  Leer más →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
