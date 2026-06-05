export const metadata = { title: "Page introuvable — Pèlerinage de Saint Michel" };

const LINKS = [
  ["Accueil", "/"],
  ["Le pèlerinage", "/le-pelerinage"],
  ["Programme", "/programme"],
  ["Prier", "/prier"],
  ["FAQ", "/faq"],
  ["Ressources", "/ressources"],
  ["Boutique", "/boutique"],
  ["Nous soutenir", "/nous-soutenir"],
];

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 560 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-medallion-cream.png" alt="Pèlerinage de Saint Michel" style={{ height: 88, marginBottom: 18 }} />
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 64, color: "var(--gold-500)", lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 28, color: "var(--gold-100)", margin: "10px 0 8px" }}>
          Cette page s'est égarée en chemin
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--fg-on-deep-muted)", lineHeight: 1.6, margin: "0 0 24px" }}>
          La page que vous cherchez n'existe pas ou a été déplacée. Reprenez la marche par l'une de ces étapes :
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--navy-800)", background: "var(--gold-500)", textDecoration: "none", padding: "9px 16px", borderRadius: "var(--r-pill)" }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
