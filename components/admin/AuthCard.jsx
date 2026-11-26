/** Cadre commun des écrans d'authentification (mot de passe oublié, double authentification…),
 *  même habillage que la page de connexion. */

export const authInputStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 16,
  padding: "12px 14px",
  background: "var(--ivory)",
  color: "var(--ink)",
  border: "1.5px solid var(--stone-300)",
  borderRadius: "var(--r-sm)",
  outline: "none",
  width: "100%",
};

export const authLabelStyle = { fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--navy-700)" };

export const authTextStyle = { fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-soft)", margin: 0 };

export const authErrorStyle = { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--liturgic-red)", background: "rgba(123,34,48,0.08)", padding: "8px 12px", borderRadius: "var(--r-sm)" };

export const authNoticeStyle = { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--navy-700)", background: "var(--navy-100)", padding: "8px 12px", borderRadius: "var(--r-sm)" };

export const authLinkStyle = { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-300)", textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer" };

export function authButtonStyle(busy) {
  return {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "var(--navy-800)",
    background: "var(--gold-500)",
    padding: "13px 18px",
    borderRadius: "var(--r-sm)",
    border: "none",
    cursor: busy ? "default" : "pointer",
    opacity: busy ? 0.7 : 1,
    marginTop: 4,
  };
}

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy-900)", padding: 24 }}>
      <div style={{ width: "min(440px, 100%)", textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-medallion-cream.png" alt="Pèlerinage de Saint Michel" style={{ height: 92, marginBottom: 22 }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "0.04em", color: "var(--gold-200)", margin: "0 0 4px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-on-deep-muted)", margin: "0 0 26px" }}>{subtitle}</p>
        )}
        <div
          style={{
            background: "var(--parchment)",
            border: "1px solid var(--line)",
            borderTop: "3px solid var(--gold-500)",
            borderRadius: "var(--r-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "28px 28px 30px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "left",
          }}
        >
          {children}
        </div>
        {footer && <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>{footer}</div>}
      </div>
    </main>
  );
}
