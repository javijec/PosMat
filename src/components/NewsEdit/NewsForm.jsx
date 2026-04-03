import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormTextarea from "../shared/FormTextarea";
import useConfirmExit from "../../hooks/useConfirmExit";

const newsSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  summary: z.string().min(1, "El resumen es obligatorio"),
  content: z.string().min(1, "El contenido es obligatorio"),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  publishedAt: z.string().min(1, "La fecha de publicación es obligatoria"),
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo procesar la imagen"));
    image.src = src;
  });

const resizeImage = async (file) => {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / image.width);
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.82);
};

const NewsForm = ({
  editingId,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues,
  });

  useConfirmExit(isDirty);

  const imagePreview = watch("imageUrl");

  useEffect(() => {
    reset(defaultValues);
    setUploadError("");
  }, [defaultValues, reset]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("El archivo seleccionado no es una imagen.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("La imagen original es demasiado pesada. Usa una menor a 8 MB.");
      return;
    }

    try {
      setUploadError("");
      const compressedImage = await resizeImage(file);
      setValue("imageUrl", compressedImage, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (_error) {
      setUploadError("No se pudo cargar la imagen seleccionada.");
    } finally {
      event.target.value = "";
    }
  };

  const clearImage = () => {
    setValue("imageUrl", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">
        {editingId === -1 ? "Agregar noticia" : "Editar noticia"}
      </h2>

      <p className="mb-6 text-sm text-gray-500">
        Carga una noticia nueva y aparecerá en la página de noticias. Las 4 más
        recientes también se mostrarán debajo del hero.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Título"
          {...register("title")}
          error={errors.title}
          placeholder="Ej: Abrió la convocatoria 2026"
          className="md:col-span-2"
        />

        <FormInput
          label="Fecha de publicación"
          type="date"
          {...register("publishedAt")}
          error={errors.publishedAt}
        />

        <FormInput
          label="URL de imagen"
          {...register("imageUrl")}
          error={errors.imageUrl}
          placeholder="https://..."
        />

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subir imagen
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-ingenieria)] file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-[var(--color-ingenieria-hover)]"
          />
          <p className="mt-2 text-xs text-gray-500">
            Puedes pegar una URL o subir una imagen desde tu computadora. Si subes una, la comprimimos automáticamente.
          </p>
          {uploadError ? (
            <p className="mt-2 text-xs text-red-500">{uploadError}</p>
          ) : null}
        </div>

        <FormTextarea
          label="Resumen"
          {...register("summary")}
          error={errors.summary}
          rows={4}
          placeholder="Texto corto para la tarjeta y la cabecera de la noticia."
          className="md:col-span-2"
        />

        <FormTextarea
          label="Contenido"
          {...register("content")}
          error={errors.content}
          rows={10}
          placeholder="Desarrollo completo de la noticia."
          className="md:col-span-2"
        />

        {imagePreview ? (
          <div className="md:col-span-2 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                Vista previa de imagen
              </h3>
              <button
                type="button"
                onClick={clearImage}
                className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Quitar imagen
              </button>
            </div>
            <img
              src={imagePreview}
              alt="Vista previa"
              className="max-h-80 w-full rounded-lg object-cover"
            />
          </div>
        ) : null}
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Publicar noticia" : "Guardar cambios"}
      />
    </form>
  );
};

export default NewsForm;
