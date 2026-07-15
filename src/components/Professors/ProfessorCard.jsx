import { Mail, UserCircle2 } from "lucide-react";

const ProfessorCard = ({ professor }) => {
  const imageUrl = professor.imageUrl || professor.photoUrl;
  const fullName = [professor.title, professor.firstName, professor.lastName].filter(Boolean).join(" ");

  return (
    <article className="flex h-full gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--bg-surface)] text-[var(--text-main)]/35">
        {imageUrl ? <img src={imageUrl} alt={`Foto de ${fullName}`} className="h-full w-full object-cover" /> : <UserCircle2 className="h-8 w-8" />}
      </div>
      <div className="min-w-0 self-center">
        <h2 className="text-lg font-bold leading-snug text-[var(--text-main)]">{fullName || "Profesor/a"}</h2>
        {professor.email && <a href={`mailto:${professor.email}`} className="mt-2 flex items-center gap-2 break-all text-sm text-[var(--text-main)]/65 transition hover:text-ingenieria"><Mail className="h-4 w-4 shrink-0" />{professor.email}</a>}
      </div>
    </article>
  );
};

export default ProfessorCard;
