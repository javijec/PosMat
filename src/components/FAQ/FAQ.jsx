import React, { useState, useEffect } from "react";
import { AlertCircle, CircleHelp, MessageCircleQuestion } from "lucide-react";
import { fetchData } from "../../data";
import FaqItem from "./FaqItem";
import EmptyState from "../shared/EmptyState";
import LoadingState from "../shared/LoadingState";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const collection = "faq";

  useEffect(() => {
    const loadFAQs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchData(collection);
        setFaqs((data || []).sort((a, b) => (a.position || 0) - (b.position || 0)));
      } catch (loadError) {
        console.error("Error fetching FAQ data: ", loadError);
        setError("No se pudieron cargar las preguntas frecuentes.");
      } finally {
        setIsLoading(false);
      }
    };
    loadFAQs();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <section className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-18">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
            <MessageCircleQuestion className="h-4 w-4" /> Centro de ayuda
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Encontrá respuestas rápidas sobre el Posgrado en Ciencia y Tecnología de Materiales.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {isLoading ? (
          <LoadingState label="Cargando preguntas frecuentes…" />
        ) : error ? (
          <EmptyState icon={AlertCircle} title="No se pudieron cargar las preguntas" description={error} variant="error" />
        ) : faqs.length === 0 ? (
          <EmptyState icon={CircleHelp} title="No hay preguntas disponibles" description="Estamos actualizando esta sección." />
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default FAQ;
