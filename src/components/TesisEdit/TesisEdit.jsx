import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TesisEditItem from "./TesisEditItem";
import TesisForm from "./TesisForm";
import SearchForm from "./SearchForm";
import { fetchData } from "../../firebase/CRUD";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import EditPageContainer from "../shared/EditPageContainer";

const TesisEdit = () => {
  const collectionName = "tesis";
  const [editingId, setEditingId] = useState(-1);
  const [defaultValues, setDefaultValues] = useState({
    year: new Date().getFullYear(),
    name: "",
    title: "",
    url: "",
    director: "",
    co_director: "",
    tag: "maestria",
  });

  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");

  const { data: tesis = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];

      return result
        .map((doc) => ({
          id: doc.id,
          ...doc,
          year: Number(doc.year),
        }))
        .sort((a, b) => b.year - a.year);
    },
  });

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useFirebaseMutations({
      collectionName,
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
      addMessage: "Tesis agregada con éxito",
      updateMessage: "Tesis actualizada con éxito",
      deleteMessage: "Tesis eliminada con éxito",
    });

  const handleEdit = (t) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(t.id);
    setDefaultValues({
      ...t,
      tag: t.tag === "doctoral" ? "doctorado" : t.tag, // Normalizing old values if any
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta tesis?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingId === -1) {
      addMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: editingId, data });
    }
  };

  const resetForm = () => {
    setEditingId(-1);
    setDefaultValues({
      year: new Date().getFullYear(),
      name: "",
      title: "",
      url: "",
      director: "",
      co_director: "",
      tag: "maestria",
    });
  };

  const filteredData = useMemo(() => {
    return tesis.filter((t) => {
      const matchName = searchName
        ? t.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const matchTag = searchTag ? t.tag === searchTag : true;
      const matchTitle = searchTitle
        ? t.title.toLowerCase().includes(searchTitle.toLowerCase())
        : true;
      const matchYear = searchYear ? String(t.year) === searchYear : true;
      return matchName && matchTag && matchTitle && matchYear;
    });
  }, [tesis, searchName, searchTag, searchTitle, searchYear]);

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <EditPageContainer title="Panel de Tesis">
      <TesisForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Buscar y Filtrar
        </h2>
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

        <hr className="my-8 border-gray-100" />

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Repositorio de Tesis
        </h2>
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-500 py-10 italic bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              No se encontraron tesis que coincidan con los criterios.
            </p>
          ) : (
            filteredData.map((t) => (
              <TesisEditItem
                key={t.id}
                t={t}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </EditPageContainer>
  );
};

export default TesisEdit;
