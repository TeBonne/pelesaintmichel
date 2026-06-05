const BASE = "https://www.pelesaintmichel.fr";

/** Fil d'Ariane : barre visible + données structurées BreadcrumbList.
 *  Props : current (nom de la page), path (chemin de la page). */
export default function Breadcrumb({ current, path }) {
  const items = [
    { name: "Accueil", path: "/" },
    { name: current, path },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: BASE + it.path,
    })),
  };

  return (
    <nav aria-label="Fil d'Ariane" style={{ background: "var(--parchment-2)", borderBottom: "1px solid var(--line)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 32px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <a href="/" style={{ color: "var(--navy-600)", textDecoration: "none" }}>Accueil</a>
        <span style={{ color: "var(--gold-600)" }}>›</span>
        <span aria-current="page" style={{ color: "var(--ink)", fontWeight: 600 }}>{current}</span>
      </div>
    </nav>
  );
}
