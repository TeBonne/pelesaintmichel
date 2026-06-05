export const STATS_DEFAULT = [
  { value: "3", title: "jours & 3 nuits", subtitle: "de Saint-Malo au Mont" },
  { value: "~20", title: "km par jour", subtitle: "sur sentiers balisés" },
  { value: "15–50", title: "par chapitre", subtitle: "petites unités de marche" },
  { value: "1000+", title: "ans d'histoire", subtitle: "les chemins du paradis" },
];

export default function Chiffres({ items = STATS_DEFAULT }) {
  const list = items && items.length ? items : STATS_DEFAULT;
  return (
    <section style={{ background: "var(--parchment)", padding: "64px 32px" }}>
      <div className="pele-grid-stats" style={{ maxWidth: 1180, margin: "0 auto" }}>
        {list.map((it, i) => (
          <div key={i} style={{ textAlign: "center", padding: "8px" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 50,
                color: "var(--navy-700)",
                lineHeight: 1,
              }}
            >
              {it.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 600,
                fontSize: 19,
                color: "var(--navy-700)",
                marginTop: 6,
              }}
            >
              {it.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--stone-500)",
                marginTop: 4,
              }}
            >
              {it.subtitle}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
