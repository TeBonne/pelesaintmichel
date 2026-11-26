import sanitizeHtml from "sanitize-html";
import { isRichText } from "@/lib/richtext";

// Liste blanche : seules ces balises et ces attributs sortent sur le site,
// quoi que contienne la base (pas de script, pas de style libre, pas d'iframe).
const SANITIZE_OPTIONS = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "blockquote", "a", "h4", "hr"],
  allowedAttributes: { a: ["href", "target", "rel"], p: ["style"], h4: ["style"] },
  allowedStyles: { "*": { "text-align": [/^(left|right|center|justify)$/] } },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    // Les liens vers d'autres sites s'ouvrent dans un nouvel onglet, sans accès à la page d'origine.
    a: (tagName, attribs) => {
      const href = attribs.href || "";
      const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?pelesaintmichel\.(fr|vercel\.app)(\/|$)/i.test(href);
      return { tagName, attribs: external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href } };
    },
  },
};

/**
 * Affiche un champ « texte enrichi » du back-office (gras, listes, liens…).
 * Les anciens contenus en texte brut sont rendus tels quels, dans un paragraphe.
 */
export default function RichText({ html, style }) {
  if (!html || !String(html).trim()) return null;
  if (!isRichText(html)) {
    return (
      <div className="pele-rich" style={style}>
        <p>{html}</p>
      </div>
    );
  }
  return <div className="pele-rich" style={style} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html, SANITIZE_OPTIONS) }} />;
}
