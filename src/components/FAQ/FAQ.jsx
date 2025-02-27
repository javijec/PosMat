import React, { useState, useEffect } from "react";
import { fetchData } from "../../firebase/CRUD";
import FaqItem from "./FaqItem";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const collection = "faq";

  useEffect(() => {
    const loadFAQs = async () => {
      const data = await fetchData(collection);
      setFaqs(data);
    };
    loadFAQs();
  }, []);

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-gray-900">
          Preguntas Frecuentes
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
