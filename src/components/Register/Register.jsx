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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              PosMat
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium italic">
              Crear una nueva cuenta de administrador
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
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
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
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
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Confirmar Contraseña
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "REGISTRARSE"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <NavLink
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Inicia sesión aquí
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
