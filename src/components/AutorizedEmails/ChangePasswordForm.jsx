import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/AuthContext";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Ingresa tu contraseña actual"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmPassword"],
  });

const ChangePasswordForm = ({ onSuccess }) => {
  const { user, changePassword } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    await changePassword(data.currentPassword, data.newPassword);
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text-main)]">
          Usuario activo
        </label>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-main)]/75">
          {user?.email || "Sin sesión activa"}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text-main)]">
          Contraseña actual
        </label>
        <input
          {...register("currentPassword")}
          type="password"
          className={`w-full rounded-lg border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none transition-all ${
            errors.currentPassword
              ? "border-red-500 ring-1 ring-red-500"
              : "border-[var(--border-subtle)] focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]"
          }`}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-main)]">
            Nueva contraseña
          </label>
          <input
            {...register("newPassword")}
            type="password"
            className={`w-full rounded-lg border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none transition-all ${
              errors.newPassword
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[var(--border-subtle)] focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]"
            }`}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-main)]">
            Confirmar nueva contraseña
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            className={`w-full rounded-lg border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none transition-all ${
              errors.confirmPassword
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[var(--border-subtle)] focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-lg bg-[var(--color-ingenieria)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)] disabled:opacity-50"
      >
        {isSubmitting ? "Actualizando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
