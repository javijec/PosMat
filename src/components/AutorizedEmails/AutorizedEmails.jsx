import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../../firebase/dbConnection";
import {
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import AuthorizedEmailForm from "./AuthorizedEmailForm";
import AuthorizedEmailsList from "./AuthorizedEmailsList";
import { toast } from "sonner";

const AuthorizedEmails = () => {
  const queryClient = useQueryClient();
  const collectionName = "authorizedEmails";

  const { data: authorizedEmails = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const emailsCollection = collection(db, collectionName);
      const emailsSnapshot = await getDocs(emailsCollection);
      return emailsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ email }) => {
      const q = query(
        collection(db, collectionName),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Este email ya está autorizado");
      }

      await setDoc(doc(db, collectionName, email), {
        email: email,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      toast.success("Email autorizado con éxito");
    },
    onError: (error) => {
      toast.error(error.message || "Error al autorizar el email");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(db, collectionName, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      toast.success("Email eliminado con éxito");
    },
    onError: (error) => {
      toast.error("Error al eliminar el email");
    },
  });

  const onSubmit = async (data) => {
    try {
      await addMutation.mutateAsync(data);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este email de la lista de autorizados?"
      )
    ) {
      deleteMutation.mutate(id);
    }
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
          Gestión de Accesos
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Autorizar Nuevo Email
          </h2>
          <p className="text-sm text-gray-500 mb-6 italic">
            Solo los usuarios con correos electrónicos en esta lista podrán
            registrarse en la plataforma.
          </p>

          <AuthorizedEmailForm
            onSubmit={onSubmit}
            isSubmitting={addMutation.isPending}
          />

          <hr className="my-10 border-gray-100" />

          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-between">
            Emails Autorizados
            <span className="text-xs bg-gray-100 text-gray-500 py-1 px-3 rounded-full font-bold">
              {authorizedEmails.length} TOTAL
            </span>
          </h2>
          <AuthorizedEmailsList
            authorizedEmails={authorizedEmails}
            onDeleteEmail={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorizedEmails;
