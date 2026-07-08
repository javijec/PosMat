import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormActions from "../shared/FormActions";
import FormInput from "../shared/FormInput";
import useConfirmExit from "../../hooks/useConfirmExit";

const professorSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  title: z.string().min(1, "El título es obligatorio"),
  imageUrl: z.string().trim().optional().or(z.literal("")),
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

const getCroppedImage = async (imageSrc, cropPixels) => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return canvas.toDataURL("image/jpeg", 0.82);
};

const ProfessorForm = ({
  editingId,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(professorSchema),
    defaultValues,
  });

  useConfirmExit(isDirty);
  const imagePreview = watch("imageUrl");

  useEffect(() => {
    reset(defaultValues);
    setUploadError("");
    setCropModalOpen(false);
    setCropImageSrc("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropPixels(null);
    setCroppedPreview("");
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
      const dataUrl = await readFileAsDataUrl(file);
      setCropImageSrc(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropPixels(null);
      setCropModalOpen(true);
    } catch (_error) {
      setUploadError("No se pudo cargar la imagen seleccionada.");
    } finally {
      event.target.value = "";
    }
  };

  const handleCropComplete = (_croppedArea, croppedAreaPixels) => {
    setCropPixels(croppedAreaPixels);
  };

  useEffect(() => {
    let isActive = true;

    const updatePreview = async () => {
      if (!cropImageSrc || !cropPixels) {
        setCroppedPreview("");
        return;
      }

      try {
        const preview = await getCroppedImage(cropImageSrc, cropPixels);
        if (isActive) setCroppedPreview(preview);
      } catch (_error) {
        if (isActive) setCroppedPreview("");
      }
    };

    updatePreview();

    return () => {
      isActive = false;
    };
  }, [cropImageSrc, cropPixels]);

  const handleConfirmCrop = async () => {
    if (!cropImageSrc || !cropPixels) return;

    try {
      const croppedImage = await getCroppedImage(cropImageSrc, cropPixels);
      setValue("imageUrl", croppedImage, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setCropModalOpen(false);
      setCropImageSrc("");
      setCropPixels(null);
    } catch (_error) {
      setUploadError("No se pudo recortar la imagen seleccionada.");
    }
  };

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setCropImageSrc("");
    setCropPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
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
        {editingId === -1 ? "Agregar Nuevo Profesor" : "Editar Profesor"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          {...register("firstName")}
          error={errors.firstName}
          placeholder="Ej: Juan"
        />

        <FormInput
          label="Apellido"
          {...register("lastName")}
          error={errors.lastName}
          placeholder="Ej: Pérez"
        />

        <FormInput
          label="Título Académico"
          {...register("title")}
          error={errors.title}
          placeholder="Ej: Dr."
        />

        <FormInput
          label="Email"
          {...register("email")}
          error={errors.email}
          placeholder="Ej: juan.perez@ejemplo.com"
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
            Puedes pegar una URL o subir una imagen desde tu computadora. Si
            subes una, la recortamos antes de guardarla.
          </p>
          {uploadError ? (
            <p className="mt-2 text-xs text-red-500">{uploadError}</p>
          ) : null}
        </div>

        {imagePreview ? (
          <div className="md:col-span-2 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                Vista previa en la tarjeta
              </h3>
              <button
                type="button"
                onClick={clearImage}
                className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Quitar imagen
              </button>
            </div>
            <div className="flex justify-center">
              <div className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-main)]">
                    {watch("title") || "Título"}{" "}
                    {watch("lastName") || ""} {watch("firstName") || ""}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Así se verá la imagen de perfil en la tarjeta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={editingId !== -1}
        submitLabel={editingId === -1 ? "Agregar Profesor" : "Guardar Cambios"}
      />

      {cropModalOpen && cropImageSrc ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Recortar imagen
                </h3>
                <p className="text-sm text-gray-500">
                  Ajustá el recorte cuadrado antes de guardarla.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelCrop}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
              <div className="relative h-[420px] w-full overflow-hidden rounded-xl bg-black">
                <Cropper
                  image={cropImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-main)]/60">
                  Vista previa final
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Así va a quedar la foto en la tarjeta.
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                    {croppedPreview ? (
                      <img
                        src={croppedPreview}
                        alt="Vista previa recortada"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <p className="text-sm font-medium">
                          Mové la imagen para ver la previsualización
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Zoom
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancelCrop}
                    className="rounded-md border border-gray-200 px-5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCrop}
                    className="rounded-md bg-[var(--color-ingenieria)] px-5 py-2 font-medium text-white transition-colors hover:bg-[var(--color-ingenieria-hover)]"
                  >
                    Usar recorte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
};

export default ProfessorForm;
