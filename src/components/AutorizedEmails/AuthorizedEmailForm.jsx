import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Debe ser un correo electrónico válido"),
});

const AuthorizedEmailForm = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const handleFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            {...register("email")}
            type="email"
            placeholder="nombre@ejemplo.com"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all font-bold disabled:opacity-50 h-fit"
        >
          {isSubmitting ? "Agregando..." : "Autorizar Email"}
        </button>
      </div>
    </form>
  );
};

export default AuthorizedEmailForm;
