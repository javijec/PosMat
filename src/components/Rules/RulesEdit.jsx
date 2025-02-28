import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import rulesData from "../../files/rules.json";

const RulesEdit = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ title: "", html: "" });
  const [newRule, setNewRule] = useState({ title: "", html: "" });
  const collection = "rules";

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const data = await fetchData(collection);
    setData(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
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

  const handleEditClick = (rule) => {
    setEditingId(rule.id);
    setEditingForm({
      title: rule.title,
      html: rule.html.replace(/<br\s*\/?>/gi, "\n"),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingForm({ title: "", html: "" });
  };

  const handleChangeEditing = (e) => {
    setEditingForm({ ...editingForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedRule = {
        title: editingForm.title,
        html: editingForm.html.replace(/\n/g, "<br/>"),
      };
      await saveItem(collection, editingId, updatedRule, { merge: true });
      setEditingId(null);
      setEditingForm({ title: "", html: "" });
      loadRules();
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const handleAddNewRule = async () => {
    if (!newRule.title.trim() || !newRule.html.trim()) {
      alert("Complete ambos campos para la nueva regla.");
      return;
    }
    try {
      const newPosition =
        data.length > 0 ? Math.max(...data.map((f) => f.position || 0)) + 1 : 1;
      const ruleToAdd = {
        ...newRule,
        html: newRule.html.replace(/\n/g, "<br/>"),
        position: newPosition,
      };
      await addItem(collection, ruleToAdd);
      setNewRule({ title: "", html: "" });
      loadRules();
    } catch (error) {
      console.error("Error adding new rule:", error);
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

  const handleLoadFromJson = async () => {
    if (
      !window.confirm(
        "¿Desea cargar los datos desde rules.json? Esto reemplazará todos los datos existentes."
      )
    ) {
      return;
    }

    try {
      // Primero eliminamos los documentos existentes
      const existingData = await fetchData(collection);
      await Promise.all(
        existingData.map((doc) => deleteItem(collection, doc.id))
      );

      // Luego agregamos los nuevos datos
      await Promise.all(rulesData.map((rule) => addItem(collection, rule)));

      alert("Datos cargados exitosamente");
      loadRules();
    } catch (error) {
      console.error("Error loading rules from JSON:", error);
      alert("Error al cargar los datos");
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Editar reglamentos</h1>
          <button
            onClick={handleLoadFromJson}
            className="bg-purple-600 text-white py-2 px-4 rounded shadow hover:bg-purple-700 transition-colors"
          >
            Cargar desde JSON
          </button>
        </div>
        {/* Formulario para agregar nueva regla */}
        <div className="mb-8 p-4 border rounded-md">
          <h2 className="text-xl mb-2">Agregar nuevo reglamento</h2>
          <input
            name="title"
            value={newRule.title}
            onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Título"
          />
          <textarea
            name="html"
            value={newRule.html}
            onChange={(e) => setNewRule({ ...newRule, html: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 h-24"
            placeholder="Contenido HTML"
          />
          <button
            onClick={handleAddNewRule}
            className="bg-green-600 text-white py-1 px-3 rounded shadow hover:bg-green-700 transition-colors"
          >
            Agregar Reglamento
          </button>
        </div>
        {/* Lista de reglas */}
        <div>
          {data.map((rule) =>
            editingId === rule.id ? (
              <div
                key={rule.id}
                className="p-4 border rounded-md mb-4 bg-gray-50"
              >
                <input
                  name="title"
                  value={editingForm.title}
                  onChange={handleChangeEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Título"
                />
                <textarea
                  name="html"
                  value={editingForm.html}
                  onChange={handleChangeEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 h-32"
                  placeholder="Contenido HTML"
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
              <div
                key={rule.id}
                className="p-4 border rounded-md mb-4 bg-white"
              >
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RulesEdit;
