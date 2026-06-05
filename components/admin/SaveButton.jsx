"use client";

export default function SaveButton({ status, error, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
      <button
        onClick={onClick}
        disabled={status === "saving"}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--gold-200)",
          background: "var(--navy-700)",
          padding: "11px 22px",
          borderRadius: "var(--r-sm)",
          border: "none",
          cursor: status === "saving" ? "default" : "pointer",
          opacity: status === "saving" ? 0.7 : 1,
        }}
      >
        {status === "saving" ? "Enregistrement…" : "Enregistrer"}
      </button>
      {status === "ok" && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "#2f7d3a" }}>
          Enregistré ✓
        </span>
      )}
      {status === "error" && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--liturgic-red)", lineHeight: 1.4 }}>
          {error ||
            "Enregistrement impossible. Vérifiez que tous les champs obligatoires (marqués d'un astérisque *) sont remplis, puis réessayez."}
        </span>
      )}
    </div>
  );
}
