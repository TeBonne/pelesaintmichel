export default function Overline({ children, onDeep }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        color: onDeep ? "var(--gold-400)" : "var(--gold-700)",
      }}
    >
      {children}
    </div>
  );
}
