import React from "react";
import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faLink,
  faUnlink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const baseClasses =
    "p-2 hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-main)]/60";
  const activeClasses =
    "bg-[var(--bg-surface)] text-[var(--color-ingenieria)] font-bold";

  const setLink = () => {
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-[var(--border-subtle)] flex flex-wrap gap-1 p-1 bg-[var(--bg-card)]">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${baseClasses} ${
          editor.isActive("bold") ? activeClasses : ""
        }`}
        title="Negrita"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${baseClasses} ${
          editor.isActive("italic") ? activeClasses : ""
        }`}
        title="Cursiva"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${baseClasses} ${
          editor.isActive("underline") ? activeClasses : ""
        }`}
        title="Subrayado"
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>

      <div className="w-px h-6 bg-[var(--border-subtle)] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`${baseClasses} ${
          editor.isActive({ textAlign: "left" }) ? activeClasses : ""
        }`}
        title="Alinear a la izquierda"
      >
        <FontAwesomeIcon icon={faAlignLeft} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`${baseClasses} ${
          editor.isActive({ textAlign: "center" }) ? activeClasses : ""
        }`}
        title="Centrar"
      >
        <FontAwesomeIcon icon={faAlignCenter} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`${baseClasses} ${
          editor.isActive({ textAlign: "right" }) ? activeClasses : ""
        }`}
        title="Alinear a la derecha"
      >
        <FontAwesomeIcon icon={faAlignRight} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`${baseClasses} ${
          editor.isActive({ textAlign: "justify" }) ? activeClasses : ""
        }`}
        title="Justificar"
      >
        <FontAwesomeIcon icon={faAlignJustify} />
      </button>

      <div className="w-px h-6 bg-[var(--border-subtle)] mx-1 self-center" />

      <button
        type="button"
        onClick={setLink}
        className={`${baseClasses} ${
          editor.isActive("link") ? activeClasses : ""
        }`}
        title="Agregar enlace"
      >
        <FontAwesomeIcon icon={faLink} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        className={baseClasses}
        disabled={!editor.isActive("link")}
        title="Quitar enlace"
      >
        <FontAwesomeIcon icon={faUnlink} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseClasses} ${
          editor.isActive("bulletList") ? activeClasses : ""
        }`}
        title="Lista con viñetas"
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseClasses} ${
          editor.isActive("orderedList") ? activeClasses : ""
        }`}
        title="Lista numerada"
      >
        <FontAwesomeIcon icon={faListOl} />
      </button>
    </div>
  );
};

export default MenuBar;
