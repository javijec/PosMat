import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 dark:bg-[#132f32] ${
        isOpen
          ? "border-ingenieria/50 shadow-md shadow-ingenieria/10"
          : "border-slate-200 hover:border-ingenieria/40 hover:shadow-md dark:border-[#204d52]"
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center gap-5 px-5 py-5 text-left sm:px-6"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ingenieria/10 text-sm font-bold text-ingenieria">
          ?
        </span>
        <span className="flex-1 text-base font-semibold leading-6 text-slate-900 sm:text-lg dark:text-[#e2f1f2]">{question}</span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-ingenieria transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6 dark:border-[#204d52] dark:bg-[#0e272b]">
          <div
            className="prose prose-slate max-w-none leading-7 text-slate-600 prose-a:text-ingenieria dark:prose-invert dark:text-[#b6d0d3]"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
};

export default FaqItem;
