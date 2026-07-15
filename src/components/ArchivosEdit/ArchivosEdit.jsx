import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteItem, deleteResourceFile, fetchData, addItem, uploadResourceFile } from "../../data";
import EditPageContainer from "../shared/EditPageContainer";
import ConfirmModal from "../shared/ConfirmModal";
import EmptyState from "../shared/EmptyState";
import { ListSkeleton } from "../shared/Skeleton";
import { faFolderOpen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";

const emptyForm = { name: "", tag: "formularios" };
const maxFileSize = 2 * 1024 * 1024;

const ArchivosEdit = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: () => fetchData("resources"),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Seleccioná un archivo");
      const uploaded = await uploadResourceFile(file);
      try {
        const id = await addItem("resources", {
          name: form.name.trim() || file.name,
          tag: form.tag.trim() || "sin categoría",
          path: uploaded.url,
        });
        if (!id) throw new Error("No se pudo registrar el archivo");
        return id;
      } catch (error) {
        await deleteResourceFile(uploaded.url);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      setForm(emptyForm);
      setFile(null);
      const input = document.getElementById("resource-file");
      if (input) input.value = "";
      toast.success("Archivo publicado correctamente");
    },
    onError: (error) => toast.error(error.message || "No se pudo publicar el archivo"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (resource) => {
      const deleted = await deleteItem("resources", resource.id);
      if (!deleted) throw new Error("No se pudo eliminar el registro del archivo");
      await deleteResourceFile(resource.path);
      return deleted;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Archivo eliminado");
    },
    onError: (error) => toast.error(error.message || "No se pudo eliminar el archivo"),
  });

  const submit = (event) => {
    event.preventDefault();
    if (!file) return toast.error("Seleccioná un archivo para subir");
    if (file.size > maxFileSize) return toast.error("El archivo no puede superar los 2 MB");
    uploadMutation.mutate();
  };

  return (
    <EditPageContainer title="Archivos y formularios">
      <form onSubmit={submit} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Publicar un archivo</h2>
        <p className="mt-1 text-sm text-[var(--text-main)]/65">Admite PDF, Word, Excel, PowerPoint y ZIP, hasta 2 MB.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--text-main)]">
            Nombre visible
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej.: Formulario de inscripción" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] px-3 py-2 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--text-main)]">
            Categoría
            <input value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} placeholder="formularios" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] px-3 py-2 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--text-main)] md:col-span-2">
            Archivo
            <input id="resource-file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" onChange={(event) => setFile(event.target.files?.[0] || null)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] p-2 font-normal" required />
          </label>
        </div>
        <button type="submit" disabled={uploadMutation.isPending} className="mt-5 rounded-lg bg-[var(--color-ingenieria)] px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {uploadMutation.isPending ? "Publicando…" : "Subir y publicar"}
        </button>
      </form>

      <section className="mt-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm">
        <h2 className="border-b border-[var(--border-subtle)] pb-4 text-2xl font-bold text-[var(--text-main)]">Archivos publicados</h2>
        {isLoading ? <div className="mt-6"><ListSkeleton items={4} /></div> : resources.length === 0 ? <div className="mt-6"><EmptyState icon={faFolderOpen} title="No hay archivos cargados" description="Los archivos que publiques aparecerán aquí y en la página pública." /></div> : (
          <ul className="mt-5 space-y-3">
            {resources.map((resource) => <li key={resource.id} className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-subtle)] p-4">
              <div className="min-w-0"><p className="truncate font-semibold text-[var(--text-main)]">{resource.name}</p><p className="mt-1 text-sm capitalize text-[var(--text-main)]/65">{resource.tag}</p></div>
              <button type="button" onClick={() => setDeleteTarget(resource)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Eliminar ${resource.name}`}><FontAwesomeIcon icon={faTrash} /></button>
            </li>)}
          </ul>
        )}
      </section>

      <ConfirmModal isOpen={Boolean(deleteTarget)} title="Eliminar archivo" message="El archivo dejará de estar disponible en la página pública." confirmLabel="Eliminar" onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </EditPageContainer>
  );
};

export default ArchivosEdit;
