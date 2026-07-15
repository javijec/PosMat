import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { fetchData } from "../../data";
import PageHeader from "../shared/PageHeader";

const Links = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const loadLinks = async () => setLinks(await fetchData("links"));
    loadLinks();
  }, []);

  const groupedLinks = useMemo(
    () => links.reduce((groups, link) => {
      const category = link.category || "Sin categoría";
      groups[category] = [...(groups[category] || []), link];
      return groups;
    }, {}),
    [links]
  );

  return (
    <main className="min-h-screen bg-[var(--bg-surface)] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader eyebrow="Recursos" icon={LinkIcon} title="Enlaces útiles" description="Sitios y recursos de consulta para la comunidad del Posgrado." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
            <section key={category} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-[var(--text-main)]">{category}</h2>
              <ul className="space-y-3">
                {categoryLinks.map((link) => (
                  <li key={link.id || `${category}-${link.url}`}>
                    <a href={link.url} className="inline-flex items-center gap-1 text-[var(--color-ingenieria)] hover:underline" target="_blank" rel="noopener noreferrer">
                      <span>{link.name}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    {link.description ? <p className="mt-1 text-sm text-[var(--text-main)]/65">{link.description}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Links;
