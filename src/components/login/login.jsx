import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Login = () => {
  const { signInWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();

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
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className={`block w-full rounded-lg border bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 ${errors.email ? "border-red-500" : "border-[var(--border-subtle)]"}`}
                placeholder="Correo electrónico"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                className={`block w-full rounded-lg border bg-[var(--bg-card)] px-3 py-2.5 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 ${errors.password ? "border-red-500" : "border-[var(--border-subtle)]"}`}
                placeholder="Contraseña"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative flex w-full justify-center rounded-lg bg-[var(--color-ingenieria)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ingenieria)]/30 disabled:opacity-50"
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-[var(--text-main)]/65">
            ¿No tienes una cuenta?{" "}
            <NavLink
              to="/register"
              className="font-semibold text-[var(--color-ingenieria)] hover:underline"
            >
              Regístrate
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
