import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchData, saveItem } from "../../firebase/CRUD";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const contactSchema = z.object({
  horario: z.string().min(1, "El horario es obligatorio"),
  adress: z.string().min(1, "La dirección es obligatoria"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
});

const ContactEdit = () => {
  const queryClient = useQueryClient();
  const collectionName = "contacto";

  const { data: contactList = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: () => fetchData(collectionName),
  });

  const contactData = contactList[0] || {};
  const docId = contactData.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      horario: contactData.horario || "",
      adress: contactData.adress || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
    },
  });

  useEffect(() => {
    if (contactData.id) {
      reset({
        horario: contactData.horario || "",
        adress: contactData.adress || "",
        email: contactData.email || "",
        phone: contactData.phone || "",
      });
    }
  }, [contactData, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) =>
      saveItem(collectionName, docId, data, { merge: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      toast.success("Información de contacto actualizada con éxito");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Hubo un error al actualizar el contacto.");
    },
  });

  const onSubmit = (data) => {
    if (!docId) {
      toast.error("No se encontró el documento de contacto para actualizar.");
      return;
    }
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 border-l-4 border-indigo-600 pl-4">
          Editar Contacto
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faClock}
                  className="mr-2 text-indigo-500"
                />
                Horario de Atención
              </label>
              <input
                {...register("horario")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.horario
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="Ej: Lunes a Viernes: 9:00 - 17:00"
              />
              {errors.horario && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.horario.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-2 text-indigo-500"
                />
                Dirección
              </label>
              <input
                {...register("adress")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.adress ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Ej: Juan B. Justo 4302, Mar del Plata"
              />
              {errors.adress && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.adress.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-2 text-indigo-500"
                />
                Correo Electrónico
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Ej: posgrado@fi.mdp.edu.ar"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mr-2 text-indigo-500"
                />
                Teléfono de Contacto
              </label>
              <input
                {...register("phone")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  errors.phone ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Ej: (0223) 481-6600"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactEdit;
