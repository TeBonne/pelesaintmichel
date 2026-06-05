export default function GoldRule({ icon = "✦", width = 220 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width, color: "var(--gold-600)" }}>
      <span style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, var(--gold-500))" }} />
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ height: 1, flex: 1, background: "linear-gradient(90deg, var(--gold-500), transparent)" }} />
    </div>
  );
}
