import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TesisEditItem from "./TesisEditItem";
import TesisForm from "./TesisForm";
import { fetchData } from "../../data";
import { useDataMutations } from "../../hooks/useDataMutations";
import { useFilters } from "../../hooks/useFilters";
import EditPageContainer from "../shared/EditPageContainer";
import SearchBar from "../shared/SearchBar";
import FilterGrid from "../shared/FilterGrid";
import ConfirmModal from "../shared/ConfirmModal";
import EmptyState from "../shared/EmptyState";
import { ListSkeleton } from "../shared/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { exportToCSV } from "../../utils/csvExport";
import { deleteTesisPdf, uploadTesisPdf } from "../../data/providers/postgresProvider";
import { toast } from "sonner";

const isFilledString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const splitLegacyJurors = (value) => {
  if (!value) {
    return ["", "", ""];
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    return [items[0] || "", items[1] || "", items[2] || ""];
  }

  if (typeof value !== "string") {
    return ["", "", ""];
  }

  const separator = /[;\n]/.test(value) ? /[;\r\n]+/ : /,/;
  const items = value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

  return [items[0] || "", items[1] || "", items[2] || ""];
};

const getJurorValue = (currentValue, fallbackValue) =>
  isFilledString(currentValue) ? currentValue.trim() : fallbackValue;

const TesisEdit = () => {
  const collectionName = "tesis";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    title: "",
    year: "",
    tag: "",
    degree_title: "",
    url: "",
    director: "",
    co_director: "",
    workplace: "",
    defense_date: "",
    juror_1: "",
    juror_2: "",
    juror_3: "",
    summary_es: "",
    abstract_en: "",
  });

  const { data: tesis = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const result = await fetchData(collectionName);
      if (!result || !Array.isArray(result)) return [];
      return [...result].sort((a, b) => {
        const yearA = Number(a.year) || 0;
        const yearB = Number(b.year) || 0;

        if (yearB !== yearA) {
          return yearB - yearA;
        }

        return (a.title || "").localeCompare(b.title || "");
      });
    },
  });

  const { filters, updateFilter, filteredData } = useFilters(
    tesis,
    { name: "", title: "", tag: "", year: "" },
    (item, f) => {
      const matchName =
        !f.name || item.name?.toLowerCase().includes(f.name.toLowerCase());
      const matchTitle =
        !f.title || item.title?.toLowerCase().includes(f.title.toLowerCase());
      const matchTag =
        !f.tag || item.tag?.toLowerCase().includes(f.tag.toLowerCase());
      const matchYear = !f.year || item.year?.toString().includes(f.year);
      return matchName && matchTitle && matchTag && matchYear;
    }
  );

  const { addMutation, updateMutation, deleteMutation, isPending } =
    useDataMutations({
      collectionName,
      addMessage: "Tesis agregada con éxito",
      updateMessage: "Tesis actualizada con éxito",
      deleteMessage: "Tesis eliminada con éxito",
    });

  const handleEdit = (item) => {
    const [juror1, juror2, juror3] = splitLegacyJurors(item.jurors);

    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingId(item.id);
    setDefaultValues({
      ...item,
      juror_1: getJurorValue(item.juror_1, juror1),
      juror_2: getJurorValue(item.juror_2, juror2),
      juror_3: getJurorValue(item.juror_3, juror3),
    });
  };

  const handleConfirmDelete = async () => {
    const thesis = tesis.find((item) => item.id === deleteId);
    if (!thesis) return;

    setDeleteId(null);
    try {
      if (thesis.url) await deleteTesisPdf(thesis.url);
      await deleteMutation.mutateAsync(thesis.id);
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar la tesis y su PDF");
    }
  };

  const onSubmit = async ({ pdfFile, ...data }) => {
    setIsSaving(true);
    let createdId = null;
    let uploadedUrl = null;

    try {
      if (editingId === -1) {
        createdId = await addMutation.mutateAsync({ ...data, url: "" });
        if (pdfFile) {
          const { url } = await uploadTesisPdf(pdfFile, createdId);
          uploadedUrl = url;
          await updateMutation.mutateAsync({ id: createdId, data: { url } });
        }
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
        if (pdfFile) {
          const { url } = await uploadTesisPdf(pdfFile, editingId);
          await updateMutation.mutateAsync({ id: editingId, data: { url } });
        }
      }

      resetForm();
    } catch (error) {
      if (createdId) {
        if (uploadedUrl) await deleteTesisPdf(uploadedUrl).catch(() => undefined);
        await deleteMutation.mutateAsync(createdId).catch(() => undefined);
      }
      toast.error(error.message || "No se pudo guardar la tesis");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(-1);
    setDefaultValues({
      name: "",
      title: "",
      year: "",
      tag: "",
      degree_title: "",
      url: "",
      director: "",
      co_director: "",
      workplace: "",
      defense_date: "",
      juror_1: "",
      juror_2: "",
      juror_3: "",
      summary_es: "",
      abstract_en: "",
    });
  };

  return (
    <EditPageContainer title="Panel de Tesis">
      <TesisForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending || isSaving}
        onCancel={resetForm}
      />

      <div className="mt-12 bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--border-subtle)]">
        <div className="flex justify-between items-center mb-6 border-b border-[var(--border-subtle)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">
            Tesis Registradas
          </h2>
          <button
            onClick={() => exportToCSV(tesis, "tesis")}
            className="inline-flex items-center px-4 py-2 bg-[var(--color-ingenieria)]/10 text-[var(--color-ingenieria)] hover:bg-[var(--color-ingenieria)] hover:text-white rounded-lg transition-all text-sm font-semibold border border-[var(--color-ingenieria)]/20 shadow-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exportar CSV
          </button>
        </div>

        <FilterGrid>
          <SearchBar
            value={filters.name}
            onChange={(v) => updateFilter("name", v)}
            placeholder="Buscar por tesista..."
          />
          <SearchBar
            value={filters.title}
            onChange={(v) => updateFilter("title", v)}
            placeholder="Buscar por título..."
          />
          <SearchBar
            value={filters.tag}
            onChange={(v) => updateFilter("tag", v)}
            placeholder="Buscar por tag/área..."
          />
          <SearchBar
            value={filters.year}
            onChange={(v) => updateFilter("year", v)}
            placeholder="Buscar por año..."
          />
        </FilterGrid>

        {isLoading ? (
          <ListSkeleton items={5} />
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon={faFileAlt}
            title="No se encontraron tesis"
            description="Intenta ajustar los filtros de búsqueda"
          />
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <TesisEditItem
                key={item.id}
                t={item}
                expanded={expandedId === item.id}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === item.id ? null : item.id
                  )
                }
                handleEdit={handleEdit}
                handleDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Eliminar Tesis"
        message="¿Estás seguro de que quieres eliminar esta tesis? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </EditPageContainer>
  );
};

export default TesisEdit;
