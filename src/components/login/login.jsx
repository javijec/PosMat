import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Login = () => {
  const { signInWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(data.email, data.password);
      toast.success("¡Bienvenido!");
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Error al iniciar sesión. Verifique sus credenciales.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-surface)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ingenieria)]">Administración</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-main)]">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-[var(--text-main)]/65">Accedé al panel de gestión del Posgrado.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 transition-all focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 ${errors.email ? "border-red-500" : "border-[var(--border-subtle)] shadow-sm"}`}
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
                  autoComplete="current-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 pr-12 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 transition-all focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 ${errors.password ? "border-red-500" : "border-[var(--border-subtle)] shadow-sm"}`}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ingenieria)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ingenieria)]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-[var(--text-main)]/65">
            ¿No tenés una cuenta?{" "}
            <NavLink
              to="/register"
              className="rounded-md font-semibold text-[var(--color-ingenieria)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ingenieria)]/30"
            >
              Crear cuenta
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
