import Overline from "@/components/ui/Overline";
import GoldRule from "@/components/ui/GoldRule";

function Stars({ rating }) {
  if (!rating) return null;
  return (
    <div aria-label={`Note : ${rating} sur 5`} style={{ color: "var(--gold-500)", fontSize: 16, letterSpacing: 2, marginBottom: 10 }}>
      {"★".repeat(rating)}
      <span style={{ color: "var(--stone-300)" }}>{"★".repeat(Math.max(0, 5 - rating))}</span>
    </div>
  );
}

export default function Testimonials({ items = [] }) {
  if (!items || !items.length) return null;
  return (
    <section style={{ background: "var(--parchment)", padding: "72px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Overline>Témoignages</Overline>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "var(--navy-700)", margin: "8px 0 0" }}>
            Ils ont marché avec nous
          </h2>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <GoldRule />
          </div>
        </div>
        <div className="pele-grid-3">
          {items.map((t) => (
            <figure key={t.id} style={{ margin: 0, background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", padding: "24px 26px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
              <Stars rating={t.rating} />
              <blockquote style={{ margin: 0, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.55, color: "var(--ink)" }}>
                « {t.quote} »
              </blockquote>
              <figcaption style={{ marginTop: 16, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--navy-700)", fontWeight: 600 }}>
                {t.author}
                {t.role && <span style={{ display: "block", fontWeight: 400, color: "var(--stone-500)", marginTop: 2 }}>{t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
