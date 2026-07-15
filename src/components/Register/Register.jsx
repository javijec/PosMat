import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email("Debe ser un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const Register = () => {
  const { signUpWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signUpWithEmailAndPassword(data.email, data.password);
      toast.success("Cuenta creada con éxito");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Error al registrar la cuenta");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-surface)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 shadow-sm">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ingenieria)]">Administración</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Crear cuenta
            </h1>
            <p className="mt-2 text-sm text-[var(--text-main)]/65">
              Creá una cuenta para acceder al panel de gestión del Posgrado.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="mb-1 ml-1 block text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/65">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-200 shadow-sm"
                }`}
                placeholder="nombre@ejemplo.com"
              />
              {errors.email && (
                <p id="email-error" className="ml-1 mt-1 text-xs font-medium text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 ml-1 block text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/65">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 pr-12 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 transition-all ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200 shadow-sm"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--text-main)]/60 transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="ml-1 mt-1 text-xs font-medium text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 ml-1 block text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/65">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 pr-12 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200 shadow-sm"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--text-main)]/60 transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
                  aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="ml-1 mt-1 text-xs font-medium text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ingenieria)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ingenieria)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t pt-6">
              <p className="text-sm text-[var(--text-main)]/65">
              ¿Ya tenés una cuenta?{" "}
              <NavLink
                to="/login"
                className="rounded-md font-semibold text-[var(--color-ingenieria)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
              >
                Iniciar sesión
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
