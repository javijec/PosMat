import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import { sanitizeHtml } from "../../utils/htmlSanitizer";
import RulesForm from "./RulesForm";
import RulesList from "./RulesList";

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
          html: sanitizeHtml(form.html),
          position: newPosition,
        };
        await addItem(collection, ruleToAdd);
      } else {
        const updatedRule = {
          title: form.title,
          html: sanitizeHtml(form.html),
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
      html: sanitizeHtml(rule.html),
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

  const handleModelChange = (model) => {
    setForm({ ...form, html: model });
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar reglamentos</h1>
        <RulesForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          onSubmit={handleSubmit}
          onModelChange={handleModelChange}
        />
        {/* Se reemplaza la lista de reglas por el componente RulesList */}
        <RulesList
          data={data}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      </div>
    </div>
  );
};

export default RulesEdit;
