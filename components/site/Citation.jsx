import Image from "next/image";

export const CITATION_DEFAULT = {
  quote: "Dieu nous aime, et le mal ne l'emportera pas !",
  attribution: "Thème de l'édition 2026",
  bg_image_url: "/img/veillee-abbatiale.jpg",
  bg_image_alt: "Veillée à l'abbatiale du Mont-Saint-Michel",
};

export default function Citation({ data = CITATION_DEFAULT }) {
  const d = { ...CITATION_DEFAULT, ...(data || {}) };
  return (
    <section id="sec-cit" style={{ position: "relative", padding: "120px 32px", overflow: "hidden" }}>
      {d.bg_image_url && (
        <Image
          src={d.bg_image_url}
          alt={d.bg_image_alt || ""}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(7,34,58,0.78), rgba(7,34,58,0.62))",
        }}
      />
      <div style={{ position: "relative", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <div style={{ color: "var(--gold-400)", fontSize: 30, marginBottom: 18 }}>✦</div>
        <blockquote
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
            lineHeight: 1.4,
            color: "var(--gold-100)",
            margin: 0,
            textShadow: "0 2px 24px rgba(7,34,58,0.6)",
          }}
        >
          {d.quote}
        </blockquote>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold-300)",
            marginTop: 24,
          }}
        >
          {d.attribution}
        </div>
      </div>
    </section>
  );
}
