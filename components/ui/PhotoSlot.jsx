import Image from "next/image";

/**
 * Emplacement photo — affiche une vraie image (src) ou un placeholder noble.
 */
export default function PhotoSlot({
  label,
  src,
  ratio = "16/9",
  radius = "var(--r-md)",
  pos = "center",
  style = {},
}) {
  if (src) {
    return (
      <div
        style={{
          position: "relative",
          aspectRatio: ratio,
          borderRadius: radius,
          overflow: "hidden",
          background: "var(--navy-800)",
          ...style,
        }}
      >
        <Image src={src} alt={label || ""} fill sizes="(max-width: 820px) 100vw, 380px" style={{ objectFit: "cover", objectPosition: pos }} />
      </div>
    );
  }
  return (
    <div
      style={{
        aspectRatio: ratio,
        borderRadius: radius,
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(120% 130% at 50% 0%, #1E5A85 0%, #103A5C 50%, #0A2940 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          background:
            "radial-gradient(closest-side at 50% 38%, rgba(214,183,117,0.30), transparent 70%)",
        }}
      />
      <div style={{ position: "relative", textAlign: "center", color: "var(--gold-300)", padding: 16 }}>
        <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.85 }}>✦</div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          Photo
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 2,
            color: "var(--gold-100)",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
