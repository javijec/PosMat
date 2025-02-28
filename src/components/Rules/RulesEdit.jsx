import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const RulesEdit = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: "", html: "" });
  const [editingId, setEditingId] = useState(-1);
  const collection = "rules";

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const rules = await fetchData(collection);
    setData(rules.sort((a, b) => (a.position || 0) - (b.position || 0)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.html.trim()) {
      alert("Complete ambos campos.");
      return;
    }
    try {
      if (editingId === -1) {
        const newPosition =
          data.length > 0
            ? Math.max(...data.map((f) => f.position || 0)) + 1
            : 1;
        const ruleToAdd = {
          ...form,
          html: form.html,
          position: newPosition,
        };
        await addItem(collection, ruleToAdd);
      } else {
        const updatedRule = {
          title: form.title,
          html: form.html,
        };
        await saveItem(collection, editingId, updatedRule, { merge: true });
      }
      setForm({ title: "", html: "" });
      setEditingId(-1);
      loadRules();
    } catch (error) {
      console.error("Error al guardar la regla:", error);
    }
  };

  const handleEditClick = (rule) => {
    window.scrollTo(0, 0);
    setEditingId(rule.id);
    setForm({
      title: rule.title,
      html: rule.html,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar regla?")) return;
    try {
      await deleteItem(collection, id);
      loadRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const handleMoveUp = async (rule) => {
    const index = data.findIndex((f) => f.id === rule.id);
    if (index > 0) {
      const prevRule = data[index - 1];
      const tempPos = rule.position || 0;
      await Promise.all([
        saveItem(
          collection,
          rule.id,
          { position: prevRule.position },
          { merge: true }
        ),
        saveItem(
          collection,
          prevRule.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadRules();
    }
  };

  const handleMoveDown = async (rule) => {
    const index = data.findIndex((f) => f.id === rule.id);
    if (index < data.length - 1) {
      const nextRule = data[index + 1];
      const tempPos = rule.position || 0;
      await Promise.all([
        saveItem(
          collection,
          rule.id,
          { position: nextRule.position },
          { merge: true }
        ),
        saveItem(
          collection,
          nextRule.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadRules();
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar reglamentos</h1>
        {/* Formulario unificado para agregar/editar */}
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-md">
          <h2 className="text-xl mb-2">
            {editingId === -1
              ? "Agregar nuevo reglamento"
              : "Editar reglamento"}
          </h2>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Título"
          />
          <textarea
            name="html"
            value={form.html}
            onChange={(e) => setForm({ ...form, html: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Contenido"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
          >
            {editingId === -1 ? "Agregar Reglamento" : "Guardar Cambios"}
          </button>
        </form>

        {/* Lista de reglas */}
        <div>
          {data.map((rule) => (
            <div key={rule.id} className="p-4 border rounded-md mb-4 bg-white">
              <h2 className="font-semibold text-lg">{rule.title}</h2>
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{ __html: rule.html }}
              />
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditClick(rule)}
                  className="flex items-center bg-indigo-600 text-white py-1 px-2 rounded shadow hover:bg-indigo-700 transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveUp(rule)}
                  className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                >
                  <ArrowUpIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveDown(rule)}
                  className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                >
                  <ArrowDownIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RulesEdit;
