import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
              PosMat
            </h1>
            <p className="mt-2 text-sm text-[var(--text-main)]/65">
              Crear una nueva cuenta de administrador
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/55">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-200 shadow-sm"
                }`}
                placeholder="nombre@ejemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/55">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 transition-all ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 shadow-sm"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 ml-1 block text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/55">
                Confirmar Contraseña
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className={`block w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-main)] outline-none placeholder:text-[var(--text-main)]/35 focus:border-[var(--color-ingenieria)] focus:ring-2 focus:ring-[var(--color-ingenieria)]/20 transition-all ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-200 shadow-sm"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative flex w-full justify-center rounded-xl bg-[var(--color-ingenieria)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ingenieria-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ingenieria)]/30 disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "REGISTRARSE"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t pt-6">
              <p className="text-sm text-[var(--text-main)]/65">
              ¿Ya tienes una cuenta?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-[var(--color-ingenieria)] hover:underline"
              >
                Inicia sesión aquí
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
