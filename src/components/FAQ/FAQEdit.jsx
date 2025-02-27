import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const FAQEdit = () => {
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ question: "", answer: "" });
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const collection = "faq";

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const data = await fetchData(collection);
    setFaqs(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar FAQ?")) return;
    try {
      await deleteItem(collection, id);
      loadFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleEditClick = (faq) => {
    setEditingId(faq.id);
    setEditingForm({
      question: faq.question,
      answer: faq.answer.replace(/<br\s*\/?>/gi, "\n"),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingForm({ question: "", answer: "" });
  };

  const handleChangeEditing = (e) => {
    setEditingForm({ ...editingForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedFAQ = {
        question: editingForm.question,
        answer: editingForm.answer.replace(/\n/g, "<br/>"),
      };
      await saveItem(collection, editingId, updatedFAQ, { merge: true });
      setEditingId(null);
      setEditingForm({ question: "", answer: "" });
      loadFAQs();
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const handleAddNewFAQ = async () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      alert("Complete ambos campos para la nueva FAQ.");
      return;
    }
    try {
      const newPosition =
        faqs.length > 0 ? Math.max(...faqs.map((f) => f.position || 0)) + 1 : 1;
      const faqToAdd = {
        ...newFAQ,
        answer: newFAQ.answer.replace(/\n/g, "<br/>"),
        position: newPosition,
      };
      await addItem(collection, faqToAdd);
      setNewFAQ({ question: "", answer: "" });
      loadFAQs();
    } catch (error) {
      console.error("Error adding new FAQ:", error);
    }
  };

  // Funciones para mover FAQ
  const handleMoveUp = async (faq) => {
    const index = faqs.findIndex((f) => f.id === faq.id);
    if (index > 0) {
      const prevFaq = faqs[index - 1];
      // Intercambiar posiciones
      const tempPos = faq.position || 0;
      await Promise.all([
        saveItem(
          collection,
          faq.id,
          { position: prevFaq.position },
          { merge: true }
        ),
        saveItem(
          collection,
          prevFaq.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadFAQs();
    }
  };

  const handleMoveDown = async (faq) => {
    const index = faqs.findIndex((f) => f.id === faq.id);
    if (index < faqs.length - 1) {
      const nextFaq = faqs[index + 1];
      const tempPos = faq.position || 0;
      await Promise.all([
        saveItem(
          collection,
          faq.id,
          { position: nextFaq.position },
          { merge: true }
        ),
        saveItem(
          collection,
          nextFaq.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadFAQs();
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar FAQ</h1>
        {/* Formulario para agregar nueva FAQ */}
        <div className="mb-8 p-4 border rounded-md">
          <h2 className="text-xl mb-2">Agregar nueva FAQ</h2>
          <input
            name="question"
            value={newFAQ.question}
            onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Pregunta"
          />
          <textarea
            name="answer"
            value={newFAQ.answer}
            onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 h-24"
            placeholder="Respuesta (usa saltos de línea, sin HTML)"
          />
          <button
            onClick={handleAddNewFAQ}
            className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
          >
            Agregar FAQ
          </button>
        </div>
        {/* Lista de FAQ */}
        <div>
          {faqs.map((faq) =>
            editingId === faq.id ? (
              <div
                key={faq.id}
                className="p-4 border rounded-md mb-4 bg-gray-50"
              >
                <input
                  name="question"
                  value={editingForm.question}
                  onChange={handleChangeEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Pregunta"
                />
                <textarea
                  name="answer"
                  value={editingForm.answer}
                  onChange={handleChangeEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 h-32"
                  placeholder="Respuesta (usa saltos de línea, sin HTML)"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center bg-blue-600 text-white py-1 px-3 rounded shadow hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 mr-1" />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center bg-gray-300 text-gray-800 py-1 px-3 rounded shadow hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div key={faq.id} className="p-4 border rounded-md mb-4 bg-white">
                <h2 className="font-semibold text-lg">{faq.question}</h2>
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(faq)}
                    className="flex items-center bg-indigo-600 text-white py-1 px-2 rounded shadow hover:bg-indigo-700 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveUp(faq)}
                    className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                  >
                    <ArrowUpIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(faq)}
                    className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                  >
                    <ArrowDownIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQEdit;
