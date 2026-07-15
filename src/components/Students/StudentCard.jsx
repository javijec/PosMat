import { Mail, UserCircle2 } from "lucide-react";

const StudentCard = ({ student }) => {
  const imageUrl = student.imageUrl || student.photoUrl;
  const name = [student.lastName, student.firstName].filter(Boolean).join(", ");
  const program = student.program === "doctorado" ? "Doctorado" : "Maestría";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)]/35">{imageUrl ? <img src={imageUrl} alt={`Foto de ${name}`} className="h-full w-full object-cover" /> : <UserCircle2 className="h-10 w-10" />}</div>
        <div className="min-w-0"><h2 className="text-lg font-bold text-[var(--text-main)]">{name || "Estudiante"}</h2><span className="mt-1 inline-block rounded-full bg-[var(--color-ingenieria)]/10 px-2.5 py-0.5 text-xs font-semibold text-ingenieria">{program}</span></div>
      </div>
      {student.thesis_topic && <div className="mt-6 border-t border-[var(--border-subtle)] pt-5"><p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-main)]/55">Tema de tesis</p><p className="mt-2 text-sm leading-6 text-[var(--text-main)]/80">{student.thesis_topic}</p></div>}
      {(student.director || student.codirector || student.email) && <div className="mt-6 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-sm leading-6 text-[var(--text-main)]/70">{student.director && <p><span className="font-semibold text-[var(--text-main)]/85">Director/a:</span> {student.director}</p>}{student.codirector && <p><span className="font-semibold text-[var(--text-main)]/85">Codirector/a:</span> {student.codirector}</p>}{student.email && <a className="flex items-center gap-2 break-all text-ingenieria hover:underline" href={`mailto:${student.email}`}><Mail className="h-4 w-4 shrink-0" />{student.email}</a>}</div>}
    </article>
  );
};

export default StudentCard;
