"use client";
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { isRichText } from "@/lib/richtext";

const labelStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.03em",
  color: "var(--navy-700)",
};

const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [4] }, // un seul niveau d'intertitre : le titre de la carte est déjà un H3
    code: false,
    codeBlock: false,
    // target/rel sont décidés à l'affichage (liens externes → nouvel onglet), pas dans l'éditeur.
    link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { target: null, rel: null } },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Les anciens contenus en texte brut deviennent des paragraphes à l'ouverture dans l'éditeur. */
function toEditorHtml(value) {
  const v = value || "";
  if (isRichText(v)) return v;
  return v
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function normalizeHref(raw) {
  const v = (raw || "").trim();
  if (!v) return "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(v)) return v;
  if (/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(v)) return "mailto:" + v;
  return "https://" + v;
}

function Btn({ on = false, disabled = false, title, onClick, children }) {
  return (
    <button
      type="button"
      className={`adm-rich-btn${on ? " adm-on" : ""}`}
      title={title}
      aria-label={title}
      aria-pressed={on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // garde la sélection dans l'éditeur
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const ALIGN_LINES = { left: [14, 9, 14, 7], center: [14, 8, 14, 6], right: [14, 9, 14, 7], justify: [14, 14, 14, 14] };

function AlignIcon({ mode }) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
      {ALIGN_LINES[mode].map((w, i) => {
        const x = mode === "right" ? 15 - w : mode === "center" ? (16 - w) / 2 : 1;
        return <rect key={i} x={x} y={1 + i * 3.5} width={w} height="1.6" rx="0.8" fill="currentColor" />;
      })}
    </svg>
  );
}

/** Éditeur de texte enrichi (WYSIWYG) : mise en forme, listes, liens, alignement. Produit du HTML. */
export default function RichTextField({ label, value, onChange, hint, required = false }) {
  const lastEmitted = useRef(value || "");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: toEditorHtml(value),
    immediatelyRender: false, // rendu serveur Next.js : l'éditeur démarre côté navigateur
    shouldRerenderOnTransaction: true, // la barre d'outils reflète la sélection
    editorProps: { attributes: { class: "pele-rich adm-rich-content", role: "textbox", "aria-multiline": "true", "aria-label": label } },
    onUpdate: ({ editor }) => {
      // L'éditeur garde un paragraphe vide en fin de texte (pour pouvoir écrire après une liste) : on ne l'enregistre pas.
      const html = editor.isEmpty ? "" : editor.getHTML().replace(/(<p[^>]*><\/p>)+$/, "");
      lastEmitted.current = html;
      onChangeRef.current(html);
    },
  });

  // Valeur changée de l'extérieur (ligne déplacée ou supprimée dans une liste) : on recharge le contenu.
  useEffect(() => {
    if (!editor) return;
    const v = value || "";
    if (v === lastEmitted.current) return;
    lastEmitted.current = v;
    editor.commands.setContent(toEditorHtml(v), { emitUpdate: false });
  }, [value, editor]);

  const run = (fn) => () => fn(editor.chain().focus()).run();
  const inLink = !!editor?.isActive("link");
  const noSelection = !editor || (editor.state.selection.empty && !inLink);

  const openLink = () => {
    setLinkUrl(editor.getAttributes("link").href || "");
    setLinkOpen(true);
  };
  const applyLink = () => {
    const href = normalizeHref(linkUrl);
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href) chain.setLink({ href }).run();
    else chain.unsetLink().run();
    setLinkOpen(false);
  };
  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={labelStyle}>
        {label}
        {required && <span style={{ color: "var(--liturgic-red)" }} title="Champ obligatoire"> *</span>}
      </span>

      <div className="adm-rich">
        {editor && (
          <div className="adm-rich-toolbar" role="toolbar" aria-label={`Mise en forme — ${label}`}>
            <select
              className="adm-rich-btn"
              aria-label="Style du bloc"
              value={editor.isActive("heading", { level: 4 }) ? "h4" : "p"}
              onChange={(e) => (e.target.value === "h4" ? editor.chain().focus().setHeading({ level: 4 }).run() : editor.chain().focus().setParagraph().run())}
            >
              <option value="p">Paragraphe</option>
              <option value="h4">Intertitre</option>
            </select>
            <span className="adm-rich-sep" />
            <Btn title="Gras (Ctrl+B)" on={editor.isActive("bold")} onClick={run((c) => c.toggleBold())}><b>G</b></Btn>
            <Btn title="Italique (Ctrl+I)" on={editor.isActive("italic")} onClick={run((c) => c.toggleItalic())}><i>I</i></Btn>
            <Btn title="Souligné (Ctrl+U)" on={editor.isActive("underline")} onClick={run((c) => c.toggleUnderline())}><u>S</u></Btn>
            <Btn title="Barré" on={editor.isActive("strike")} onClick={run((c) => c.toggleStrike())}><s>ab</s></Btn>
            <span className="adm-rich-sep" />
            <Btn title="Liste à puces" on={editor.isActive("bulletList")} onClick={run((c) => c.toggleBulletList())}>• Liste</Btn>
            <Btn title="Liste numérotée" on={editor.isActive("orderedList")} onClick={run((c) => c.toggleOrderedList())}>1. Liste</Btn>
            <Btn title="Citation" on={editor.isActive("blockquote")} onClick={run((c) => c.toggleBlockquote())}>« »</Btn>
            <span className="adm-rich-sep" />
            <Btn title={noSelection ? "Lien : sélectionnez d'abord le texte à transformer en lien" : "Insérer ou modifier un lien"} on={inLink} disabled={noSelection} onClick={openLink}>Lien</Btn>
            <span className="adm-rich-sep" />
            <Btn title="Aligner à gauche" on={editor.isActive({ textAlign: "left" })} onClick={run((c) => c.setTextAlign("left"))}><AlignIcon mode="left" /></Btn>
            <Btn title="Centrer" on={editor.isActive({ textAlign: "center" })} onClick={run((c) => c.setTextAlign("center"))}><AlignIcon mode="center" /></Btn>
            <Btn title="Aligner à droite" on={editor.isActive({ textAlign: "right" })} onClick={run((c) => c.setTextAlign("right"))}><AlignIcon mode="right" /></Btn>
            <Btn title="Justifier" on={editor.isActive({ textAlign: "justify" })} onClick={run((c) => c.setTextAlign("justify"))}><AlignIcon mode="justify" /></Btn>
            <span className="adm-rich-sep" />
            <Btn title="Ligne de séparation" onClick={run((c) => c.setHorizontalRule())}>―</Btn>
            <Btn title="Effacer la mise en forme" onClick={run((c) => c.unsetAllMarks().clearNodes().unsetTextAlign())}>Effacer</Btn>
            <span className="adm-rich-sep" />
            <Btn title="Annuler (Ctrl+Z)" disabled={!editor.can().undo()} onClick={run((c) => c.undo())}>↶</Btn>
            <Btn title="Rétablir (Ctrl+Y)" disabled={!editor.can().redo()} onClick={run((c) => c.redo())}>↷</Btn>
          </div>
        )}

        {linkOpen && (
          <div className="adm-rich-linkbar">
            <input
              type="text"
              value={linkUrl}
              autoFocus
              placeholder="https://… ou /programme ou adresse@exemple.fr"
              aria-label="Adresse du lien"
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                } else if (e.key === "Escape") {
                  setLinkOpen(false);
                }
              }}
            />
            <button type="button" className="adm-rich-btn" onClick={applyLink}>Appliquer</button>
            {inLink && <button type="button" className="adm-rich-btn" onClick={removeLink}>Retirer le lien</button>}
            <button type="button" className="adm-rich-btn" onClick={() => setLinkOpen(false)}>Annuler</button>
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      {hint && <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--stone-500)" }}>{hint}</span>}
    </div>
  );
}
