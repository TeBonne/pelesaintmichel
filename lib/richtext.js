/** Petits utilitaires pour les champs « texte enrichi » (sans dépendance : utilisables partout). */

/** Vrai si la valeur contient du HTML (sinon c'est un ancien contenu en texte brut). */
export function isRichText(value) {
  return /<\/?[a-z][^>]*>/i.test(value || "");
}

/** Version texte brut d'un contenu enrichi (données structurées SEO, extraits…). */
export function toPlainText(value) {
  const v = value || "";
  if (!isRichText(v)) return v;
  return v
    .replace(/<\/(p|li|h[1-6]|blockquote)>|<br\s*\/?>|<hr\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
