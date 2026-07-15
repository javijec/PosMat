import React, { useState, useEffect } from "react";
import { CircleHelp, MessageCircleQuestion } from "lucide-react";
import { fetchData } from "../../data";
import FaqItem from "./FaqItem";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const collection = "faq";

  useEffect(() => {
    const loadFAQs = async () => {
      const data = await fetchData(collection);
      setFaqs(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
    };
    loadFAQs();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#0a1f21] dark:via-[#0a1f21] dark:to-[#0e272b]">
      <section className="border-b border-slate-200 bg-slate-900 text-white dark:border-[#204d52]">
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
        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-[#204d52] dark:bg-[#132f32]">
            <CircleHelp className="mx-auto h-10 w-10 text-ingenieria" />
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-[#e2f1f2]">No hay preguntas disponibles</h2>
            <p className="mt-2 text-slate-600 dark:text-[#b6d0d3]">Estamos actualizando esta sección.</p>
          </div>
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
