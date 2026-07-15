import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FolderOpen } from "lucide-react";
import PageHeader from "../shared/PageHeader";

const resources = [
  { name: "Modelo Informe anual", path: "/assets/modelo_informe_anual.doc", tag: "formularios" },
  { name: "Planilla de Inscripción al doctorado", path: "/assets/formulario-inscripcion-doctorado-2021.docx", tag: "formularios" },
  { name: "Planilla de Inscripción a la maestría", path: "/assets/formulario-inscripcion-maestria-2021.docx", tag: "formularios" },
  { name: "Presentación de un nuevo curso de posgrado", path: "/assets/propuesta_nuevo_curso.doc", tag: "formularios" },
];

const Archivos = () => {
  const groupedResources = resources.reduce((groups, resource) => ({ ...groups, [resource.tag]: [...(groups[resource.tag] || []), resource] }), {});

  return (
    <main className="min-h-screen bg-[var(--bg-surface)] py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4">
        <PageHeader eyebrow="Documentación" icon={FolderOpen} title="Recursos" description="Modelos, formularios y documentación para trámites académicos." />
        {Object.entries(groupedResources).map(([tag, taggedResources]) => (
          <section key={tag} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold capitalize text-[var(--text-main)]">{tag}</h2>
            <ul className="space-y-3">
              {taggedResources.map((resource) => (
                <li key={resource.path} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm">
                  <span className="text-lg font-medium text-[var(--text-main)]">{resource.name}</span>
                  <a href={resource.path} target="_blank" rel="noopener noreferrer" className="shrink-0 font-semibold text-[var(--color-ingenieria)] hover:opacity-80" aria-label={`Descargar ${resource.name}`}>
                    <FontAwesomeIcon icon={faDownload} className="rounded-md bg-[var(--color-ingenieria)] px-3 py-1 text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
};

export default Archivos;
