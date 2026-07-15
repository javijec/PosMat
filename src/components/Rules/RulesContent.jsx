import { ChevronLeft, ChevronRight } from "lucide-react";

const RulesContent = ({ selectedSection, current, total, onPrev, onNext, canGoPrev, canGoNext }) => (
  <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
    <header className="border-b border-gray-100 px-6 py-5 md:px-8">
      <p className="text-sm font-medium text-ingenieria">Sección {current} de {total}</p>
      <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">{selectedSection.title}</h2>
    </header>
    <div className="prose prose-slate max-w-none px-6 py-6 text-base leading-7 md:px-8 md:py-8 md:text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: selectedSection.html }} />
    <footer className="flex flex-col gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-between md:px-8">
      <button type="button" onClick={onPrev} disabled={!canGoPrev} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ingenieria/30 disabled:cursor-not-allowed disabled:opacity-40">
        <ChevronLeft className="h-4 w-4" /> Anterior
      </button>
      <button type="button" onClick={onNext} disabled={!canGoNext} className="inline-flex items-center justify-center gap-1 rounded-lg bg-ingenieria px-4 py-2 font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ingenieria/30 disabled:cursor-not-allowed disabled:opacity-40">
        Siguiente <ChevronRight className="h-4 w-4" />
      </button>
    </footer>
  </article>
);

export default RulesContent;
