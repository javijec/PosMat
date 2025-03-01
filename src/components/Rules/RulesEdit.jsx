import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/third_party/spell_checker.min.js";
import "froala-editor/js/languages/es.js";
import "froala-editor/js/third_party/font_awesome.min.js";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import { sanitizeHtml } from "../../utils/htmlSanitizer";

const RulesEdit = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: "", html: "" });
  const [editingId, setEditingId] = useState(-1);
  const collection = "rules";

  const [froalaOptions] = useState({
    toolbarButtons: [
      "bold",
      "italic",
      "underline",
      "subscript",
      "superscript",
      "align",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "quote",
      "insertLink",
      "emoticons",
      "specialCharacters",
      "undo",
      "redo",
      "clearFormatting",
    ],
  });

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
          <FroalaEditor
            model={form.html}
            onModelChange={handleModelChange}
            config={froalaOptions}
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
                  <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="flex items-center bg-red-600 text-white py-1 px-2 rounded shadow hover:bg-red-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveUp(rule)}
                  className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveDown(rule)}
                  className="flex items-center bg-green-600 text-white py-1 px-2 rounded shadow hover:bg-green-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
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
