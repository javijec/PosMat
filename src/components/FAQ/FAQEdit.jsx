import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import FAQForm from "./FAQForm";
import FAQList from "./FAQList";

const FAQEdit = () => {
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "" });
  const collection = "faq";

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const data = await fetchData(collection);
    setFaqs(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
  };

  const handleEditClick = (faq) => {
    window.scrollTo(0, 0);
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
    });
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

  const handleMoveUp = async (faq) => {
    const index = faqs.findIndex((f) => f.id === faq.id);
    if (index > 0) {
      const prevFaq = faqs[index - 1];
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

  const handleModelChange = (html) => {
    setForm({ ...form, answer: html });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      alert("Complete ambos campos.");
      return;
    }

    try {
      if (editingId === null) {
        const newPosition =
          faqs.length > 0
            ? Math.max(...faqs.map((f) => f.position || 0)) + 1
            : 1;
        await addItem(collection, { ...form, position: newPosition });
      } else {
        await saveItem(collection, editingId, form, { merge: true });
      }
      setForm({ question: "", answer: "" });
      setEditingId(null);
      loadFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar FAQ</h1>

        <FAQForm
          form={form}
          editingId={editingId}
          setForm={setForm}
          handleSubmit={handleSubmit}
          handleModelChange={handleModelChange}
        />

        <FAQList
          faqs={faqs}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
        />
      </div>
    </div>
  );
};

export default FAQEdit;
