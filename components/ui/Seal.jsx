export default function Seal({ children, size = 64 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flex: "none",
        border: "2px solid var(--gold-500)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--gold-500)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {children}
    </div>
  );
}
