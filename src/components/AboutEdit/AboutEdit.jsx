import React, { useState, useEffect } from "react";
import { fetchData, saveItem, deleteItem, addItem } from "../../firebase/CRUD";
import AboutForm from "./AboutForm";
import AboutList from "./AboutList";

const AboutEdit = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(-1);
  const collection = "about";

  useEffect(() => {
    loadAbouts();
  }, []);

  const loadAbouts = async () => {
    const abouts = await fetchData(collection);
    setData(abouts.sort((a, b) => (a.position || 0) - (b.position || 0)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Complete ambos campos.");
      return;
    }
    try {
      if (editingId === -1) {
        const newPosition =
          data.length > 0
            ? Math.max(...data.map((f) => f.position || 0)) + 1
            : 1;
        const aboutToAdd = {
          ...form,
          content: form.content,
          position: newPosition,
        };
        await addItem(collection, aboutToAdd);
      } else {
        const updatedAbout = {
          title: form.title,
          content: form.content,
        };
        await saveItem(collection, editingId, updatedAbout, { merge: true });
      }
      setForm({ title: "", content: "" });
      setEditingId(-1);
      loadAbouts();
    } catch (error) {
      console.error("Error guardando About:", error);
    }
  };

  const handleEditClick = (about) => {
    window.scrollTo(0, 0);
    setEditingId(about.id);
    setForm({
      title: about.title,
      content: about.content,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar About?")) return;
    try {
      await deleteItem(collection, id);
      loadAbouts();
    } catch (error) {
      console.error("Error deleting About:", error);
    }
  };

  const handleMoveUp = async (about) => {
    const index = data.findIndex((f) => f.id === about.id);
    if (index > 0) {
      const prevAbout = data[index - 1];
      const tempPos = about.position || 0;
      await Promise.all([
        saveItem(
          collection,
          about.id,
          { position: prevAbout.position },
          { merge: true }
        ),
        saveItem(
          collection,
          prevAbout.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadAbouts();
    }
  };

  const handleMoveDown = async (about) => {
    const index = data.findIndex((f) => f.id === about.id);
    if (index < data.length - 1) {
      const nextAbout = data[index + 1];
      const tempPos = about.position || 0;
      await Promise.all([
        saveItem(
          collection,
          about.id,
          { position: nextAbout.position },
          { merge: true }
        ),
        saveItem(
          collection,
          nextAbout.id,
          { position: tempPos },
          { merge: true }
        ),
      ]);
      loadAbouts();
    }
  };

  const handleModelChange = (model) => {
    setForm({ ...form, content: model });
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar About</h1>
        {/* Renderizamos el formulario a través del componente AboutForm */}
        <AboutForm
          form={form}
          editingId={editingId}
          setForm={setForm}
          handleSubmit={handleSubmit}
          handleModelChange={handleModelChange}
        />
        {/* Renderizamos la lista de Abouts a través del componente AboutList */}
        <AboutList
          data={data}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
        />
      </div>
    </div>
  );
};

export default AboutEdit;
