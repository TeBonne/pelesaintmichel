"use client";

const labelStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.03em",
  color: "var(--navy-700)",
};
const inputStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 15,
  padding: "10px 12px",
  background: "var(--ivory)",
  color: "var(--ink)",
  border: "1.5px solid var(--stone-300)",
  borderRadius: "var(--r-sm)",
  outline: "none",
  width: "100%",
};

export default function Field({ label, value, onChange, type = "text", placeholder, rows = 3, hint, options = [], required = false }) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={labelStyle}>
        {label}
        {required && <span style={{ color: "var(--liturgic-red)" }} title="Champ obligatoire"> *</span>}
      </span>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
        />
      ) : type === "select" ? (
        <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
      {hint && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--stone-500)" }}>{hint}</span>
      )}
    </label>
  );
}
