import React, { useState, useEffect } from "react";
import { fetchData, saveItem, addItem, deleteItem } from "../../firebase/CRUD";
import LinkForm from "./components/LinkForm";
import LinksList from "./components/LinksList";

const LinksEdit = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    category: "",
  });
  const collection = "links";
  const x = "link";

  useEffect(() => {
    loadLinks();
  }, [data]);

  const loadLinks = async () => {
    const res = await fetchData(collection);
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar ${x}?`)) return;
    try {
      await deleteItem(collection, id);
      loadLinks();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = (item) => {
    window.scrollTo(0, 0);
    setEditingId(item.id);
    setForm(item);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewLink = () => {
    setEditingId(null);
    setForm({ name: "", url: "", description: "", category: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await saveItem(collection, editingId, form, { merge: true });
        alert(`${x} actualizado`);
      } else {
        await addItem(collection, form);
        alert(`${x} agregado`);
      }
      loadLinks();
      handleNewLink();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Links</h1>
        <div className="mb-4">
          <button
            onClick={handleNewLink}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Agregar Link Nuevo
          </button>
        </div>
        <LinkForm
          form={form}
          editingId={editingId}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <hr className="mb-8" />
        <LinksList data={data} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default LinksEdit;
