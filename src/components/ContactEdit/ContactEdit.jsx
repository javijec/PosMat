import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchData } from "../../firebase/CRUD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useFirebaseMutations } from "../../hooks/useFirebaseMutations";
import EditPageContainer from "../shared/EditPageContainer";
import FormActions from "../shared/FormActions";
import { toast } from "sonner";

const contactSchema = z.object({
  horario: z.string().min(1, "El horario es obligatorio"),
  adress: z.string().min(1, "La dirección es obligatoria"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
});

const ContactEdit = () => {
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

  const { updateMutation, isPending } = useFirebaseMutations({
    collectionName,
    updateMessage: "Información de contacto actualizada con éxito",
  });

  const onSubmit = (data) => {
    if (!docId) {
      toast.error("No se encontró el documento de contacto para actualizar.");
      return;
    }
    updateMutation.mutate({ id: docId, data });
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <EditPageContainer title="Editar Contacto" maxWidth="2xl">
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
                errors.horario ? "border-red-500 bg-red-50" : "border-gray-200"
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

          <FormActions
            isSubmitting={isPending}
            isEditing={true}
            submitLabel="Guardar Cambios"
            hideCancel={true}
          />
        </form>
      </div>
    </EditPageContainer>
  );
};

export default ContactEdit;
