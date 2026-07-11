import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, BookOpen, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchData } from "../../data";
import AboutSection from "./AboutSection";

const About = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAbout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const aboutData = await fetchData("about");
      setData(
        [...(aboutData || [])].sort(
          (a, b) => (a.position || 0) - (b.position || 0)
        )
      );
    } catch (fetchError) {
      console.error("Error fetching about data: ", fetchError);
      setError("No se pudo cargar la información del Posgrado.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status">
        <div className="text-center text-gray-600">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-ingenieria" />
          <p className="mt-4">Cargando información del Posgrado…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Información no disponible</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={fetchAbout} className="mt-6 rounded-lg bg-ingenieria px-4 py-2 font-medium text-white hover:opacity-90">Reintentar</button>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-white">
      <section className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-20">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
              <FlaskConical className="h-4 w-4" /> Ciencia y Tecnología de Materiales
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Sobre el Posgrado</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Formación avanzada, investigación y desarrollo para desafíos actuales en ciencia de materiales.</p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-blue-50">
              Contactanos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=85"
            alt="Laboratorio de investigación"
            className="h-64 w-full rounded-2xl object-cover shadow-2xl md:h-80"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-gray-400" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">Información próximamente</h2>
            <p className="mt-2 text-gray-600">Estamos actualizando los datos del Posgrado.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((section) => <AboutSection key={section.id || section.title} section={section} />)}
          </div>
        )}
      </section>
    </main>
  );
};

export default About;
