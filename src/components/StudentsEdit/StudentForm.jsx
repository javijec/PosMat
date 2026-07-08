import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import FormSelect from "../shared/FormSelect";
import useConfirmExit from "../../hooks/useConfirmExit";

const studentSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").or(z.literal("")),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  director: z.string().min(1, "El director es obligatorio"),
  codirector: z.string().optional(),
  thesis_topic: z.string().min(1, "El tema de tesis es obligatorio"),
  program: z.enum(["maestria", "doctorado"]),
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
  const maxWidth = 1200;
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

const StudentForm = ({
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
    resolver: zodResolver(studentSchema),
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
      setUploadError(
        "La imagen original es demasiado pesada. Usa una menor a 8 MB."
      );
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
      className="mb-8 p-6 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editingId === -1 ? "Agregar Nuevo Estudiante" : "Editar Estudiante"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          {...register("firstName")}
          error={errors.firstName}
        />

        <FormInput
          label="Apellido"
          {...register("lastName")}
          error={errors.lastName}
        />

        <FormInput
          label="Director"
          {...register("director")}
          error={errors.director}
        />

        <FormInput label="Codirector (Opcional)" {...register("codirector")} />

        <FormInput
          label="Tema de Tesis"
          {...register("thesis_topic")}
          error={errors.thesis_topic}
          className="md:col-span-2"
        />

        <FormSelect
          label="Programa"
          {...register("program")}
          options={[
            { value: "doctorado", label: "Doctorado" },
            { value: "maestria", label: "Maestría" },
          ]}
        />

        <FormInput
          label="Email (Opcional)"
          {...register("email")}
          error={errors.email}
        />

        <FormInput
          label="URL de imagen"
          {...register("imageUrl")}
          error={errors.imageUrl}
          placeholder="https://... o deja vacío si vas a subir una imagen"
          className="md:col-span-2"
        />

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subir imagen de perfil
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
        submitLabel={
          editingId === -1 ? "Agregar Estudiante" : "Guardar Cambios"
        }
      />
    </form>
  );
};

export default StudentForm;
