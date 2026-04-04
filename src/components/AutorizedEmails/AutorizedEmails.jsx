import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AuthorizedEmailForm from "./AuthorizedEmailForm";
import AuthorizedEmailsList from "./AuthorizedEmailsList";
import ChangePasswordForm from "./ChangePasswordForm";
import ConfirmModal from "../shared/ConfirmModal";
import { toast } from "sonner";
import { addItem, deleteItem, fetchData } from "../../data";

const AuthorizedEmails = () => {
  const queryClient = useQueryClient();
  const [emailToDelete, setEmailToDelete] = React.useState(null);
  const collectionName = "authorizedEmails";

  const { data: authorizedEmails = [], isLoading } = useQuery({
    queryKey: [collectionName],
    queryFn: () => fetchData(collectionName, { force: true }),
  });

  const addMutation = useMutation({
    mutationFn: async ({ email }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const alreadyExists = authorizedEmails.some(
        (item) => item.email?.trim().toLowerCase() === normalizedEmail
      );

      if (alreadyExists) {
        throw new Error("Este email ya está autorizado");
      }

      const id = await addItem(collectionName, {
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
      });

      if (!id) {
        throw new Error("No se pudo autorizar el email");
      }
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
      const deleted = await deleteItem(collectionName, id);

      if (!deleted) {
        throw new Error("No se pudo eliminar el email");
      }
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

  const handleConfirmDelete = () => {
    if (emailToDelete) {
      deleteMutation.mutate(emailToDelete);
      setEmailToDelete(null);
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
    <div className="py-16 bg-[var(--bg-main)] min-h-screen transition-colors">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-[var(--text-main)] border-l-4 border-[var(--color-ingenieria)] pl-4">
          Gestión de Accesos
        </h1>

        <div className="bg-[var(--bg-card)] p-8 rounded-xl shadow-sm border border-[var(--border-subtle)]">
          <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)]">
            Seguridad de la Cuenta
          </h2>
          <p className="text-sm text-[var(--text-main)]/50 mb-6 italic">
            Aquí puedes actualizar la contraseña del usuario que inició sesión.
          </p>

          <ChangePasswordForm
            onSuccess={() => toast.success("Contraseña actualizada con éxito")}
          />

          <hr className="my-10 border-[var(--border-subtle)]" />

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)]">
            Autorizar Nuevo Email
          </h2>
          <p className="text-sm text-[var(--text-main)]/50 mb-6 italic">
            Solo los usuarios con correos electrónicos en esta lista podrán
            registrarse en la plataforma.
          </p>

          <AuthorizedEmailForm
            onSubmit={onSubmit}
            isSubmitting={addMutation.isPending}
          />

          <hr className="my-10 border-[var(--border-subtle)]" />

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)] flex items-center justify-between">
            Emails Autorizados
            <span className="text-xs bg-[var(--bg-surface)] text-[var(--text-main)]/50 py-1 px-3 rounded-full font-bold">
              {authorizedEmails.length} TOTAL
            </span>
          </h2>
          <AuthorizedEmailsList
            authorizedEmails={authorizedEmails}
            onDeleteEmail={(id) => setEmailToDelete(id)}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!emailToDelete}
        title="Eliminar Email Autorizado"
        message="¿Estás seguro de que deseas eliminar este email de la lista de autorizados? El usuario ya no podrá registrarse o re-autenticarse si es eliminado."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmailToDelete(null)}
      />
    </div>
  );
};

export default AuthorizedEmails;
