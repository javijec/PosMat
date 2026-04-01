import React, { useRef, useState } from "react";
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
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faDownload,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { exportToCSV } from "../../utils/csvExport";
import {
  EMPTY_THESIS_FORM,
  importThesisFromPdf,
} from "../../utils/thesisPdfImport";

const splitLegacyJurors = (value) => {
  if (!value || typeof value !== "string") {
    return ["", "", ""];
  }

  const items = value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return [items[0] || "", items[1] || "", items[2] || ""];
};

const TesisEdit = () => {
  const collectionName = "tesis";
  const [editingId, setEditingId] = useState(-1);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [defaultValues, setDefaultValues] = useState({ ...EMPTY_THESIS_FORM });
  const [isImportingPdf, setIsImportingPdf] = useState(false);
  const pdfInputRef = useRef(null);

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
      onSuccess: () => {
        setEditingId(-1);
        resetForm();
      },
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
      juror_1: item.juror_1 ?? juror1,
      juror_2: item.juror_2 ?? juror2,
      juror_3: item.juror_3 ?? juror3,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
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
    setDefaultValues({ ...EMPTY_THESIS_FORM });
  };

  const handlePdfSelected = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsImportingPdf(true);

    try {
      const parsedData = await importThesisFromPdf(file);
      setEditingId(-1);
      setDefaultValues(parsedData);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("PDF procesado. Revisá los datos antes de guardar.");
    } catch (error) {
      console.error("Error importing thesis PDF:", error);
      toast.error("No se pudo procesar el PDF.");
    } finally {
      event.target.value = "";
      setIsImportingPdf(false);
    }
  };

  return (
    <EditPageContainer title="Panel de Tesis">
      <div className="mb-4 flex justify-end">
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          onChange={handlePdfSelected}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => pdfInputRef.current?.click()}
          disabled={isImportingPdf}
          className="inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          {isImportingPdf ? "Procesando PDF..." : "Importar PDF"}
        </button>
      </div>

      <TesisForm
        editingId={editingId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={isPending}
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
