import React, { useState, useEffect } from "react";
import TesisEditItem from "./TesisEditItem";
import TesisForm from "./TesisForm";
import SearchForm from "./SearchForm";
import {
  fetchData,
  getItem,
  saveItem,
  addItem,
  deleteItem,
} from "../../firebase/CRUD";

const TesisEdit = () => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [Form, setForm] = useState({
    year: "",
    name: "",
    title: "",
    url: "",
    director: "",
    co_director: "",
    tag: "maestria",
  });
  const [data, setData] = useState([]);
  const collection = "tesis";
  const x = "tesis";

  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchTesis();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [data, searchName, searchTag, searchTitle, searchYear]);

  const fetchTesis = async () => {
    const Data = await fetchData(collection);
    const tesisData = Data.map((doc) => ({
      id: doc.id,
      ...doc,
      year: Number(doc.year),
    }));

    tesisData.sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
    });

    setData(tesisData);
  };

  const handleEdit = async (data) => {
    window.scrollTo(0, 0);
    const { id } = data;
    try {
      setEditingIndex(id);
      getItem(collection, id);
    } catch (error) {}
    setEditingIndex(id);

    setForm(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar ` + x + ` ?`)) return;
    try {
      await deleteItem(collection, id);
      fetchData(); // <-- Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingIndex(-1);
    setForm({
      year: "",
      name: "",
      title: "",
      url: "",
      director: "",
      co_director: "",
      tag: "maestria",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingIndex === -1) {
        await addItem(collection, Form);
        alert(x + " agregado");
      } else {
        await saveItem(collection, editingIndex, Form, { merge: true });
        alert(x + " actualizado");
        setEditingIndex(-1);
      }
    } catch (error) {
      console.error("Error adding/updating " + x + ":", error);
    }
    fetchData();
    handleAdd();
  };

  const handleSearch = () => {
    let filtered = data;

    if (searchName) {
      filtered = filtered.filter((tesis) =>
        tesis.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchTag) {
      filtered = filtered.filter((tesis) => tesis.tag === searchTag);
    }
    if (searchTitle) {
      filtered = filtered.filter((tesis) =>
        tesis.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (searchYear) {
      filtered = filtered.filter((tesis) => String(tesis.year) === searchYear);
    }

    setFilteredData(filtered);
  };

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Editar Tesis</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-2 px-4 rounded mb-4"
        >
          Agregar Tesis Nueva
        </button>

        <TesisForm
          Form={Form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingIndex={editingIndex}
        />

        <hr className="my-8" />

        <SearchForm
          searchName={searchName}
          searchTag={searchTag}
          searchTitle={searchTitle}
          searchYear={searchYear}
          setSearchName={setSearchName}
          setSearchTag={setSearchTag}
          setSearchTitle={setSearchTitle}
          setSearchYear={setSearchYear}
        />

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">Tesis Existentes</h2>
        <div>
          {filteredData.map((t, index) => (
            <TesisEditItem
              key={t.id}
              t={t}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TesisEdit;
