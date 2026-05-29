/* ============================================================
   Site web — Gabarit de page (pages de rubriques)
   Réutilise ui.jsx (Button, Overline, GoldRule, useIsMobile).
   ============================================================ */

// Bandeau de page : titre sur photo + voile bleu nuit
function PageHero({ kicker, title, subtitle, photo = "mont-procession.jpg", pos = "center 40%" }) {
  return (
    <section style={{ position: "relative", minHeight: 360, display: "flex", alignItems: "flex-end",
      overflow: "hidden" }}>
      <img src={"assets/photos/" + photo} alt="" style={{ position: "absolute", inset: 0,
        width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(7,34,58,0.62) 0%, rgba(7,34,58,0.30) 45%, rgba(7,34,58,0.88) 100%)" }} />
      <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto", padding: "0 32px 48px", width: "100%" }}>
        {kicker && <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12,
          letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: 14 }}>{kicker}</div>}
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.2rem,4.6vw,3.4rem)",
          letterSpacing: "0.02em", color: "var(--gold-100)", margin: 0, lineHeight: 1.08,
          textShadow: "0 2px 24px rgba(7,34,58,0.55)" }}>{title}</h1>
        {subtitle && <p style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontStyle: "italic",
          fontSize: 22, color: "var(--gold-100)", margin: "14px 0 0", maxWidth: 640,
          textShadow: "0 1px 14px rgba(7,34,58,0.6)" }}>{subtitle}</p>}
      </div>
    </section>
  );
}

// Sous-navigation (onglets de sous-rubriques) — sticky sous le header
function SubNav({ items, active, base = "" }) {
  return (
    <div style={{ position: "sticky", top: 68, zIndex: 20, background: "var(--parchment-2)",
      borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", display: "flex", gap: 6,
        flexWrap: "wrap", overflowX: "auto" }}>
        {items.map(([label, href]) => {
          const on = label === active;
          return (
            <a key={label} href={href} style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5,
              letterSpacing: "0.02em", color: on ? "var(--navy-700)" : "var(--ink-soft)", textDecoration: "none",
              padding: "15px 14px", borderBottom: on ? "2px solid var(--gold-500)" : "2px solid transparent",
              whiteSpace: "nowrap" }}>{label}</a>
          );
        })}
      </div>
    </div>
  );
}

// Section de contenu
function Section({ id, bg = "var(--parchment)", pad = "72px 32px", children }) {
  return (
    <section id={id} style={{ background: bg, padding: pad }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>{children}</div>
    </section>
  );
}
function SectionWide({ id, bg = "var(--ivory)", children }) {
  return (
    <section id={id} style={{ background: bg, padding: "72px 32px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionHead({ over, title, center }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 26 }}>
      {over && <Overline>{over}</Overline>}
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.4rem)",
        color: "var(--navy-700)", margin: "8px 0 0", lineHeight: 1.15 }}>{title}</h2>
      {center && <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}><GoldRule /></div>}
    </div>
  );
}

function Prose({ children }) {
  return <div style={{ fontFamily: "var(--font-body)", fontSize: 17.5, lineHeight: 1.7,
    color: "var(--ink)" }}>{children}</div>;
}

// Bande d'appel à l'action (bleu nuit)
function CtaBand({ title, sub, label = "S'inscrire", href = "inscription.html" }) {
  return (
    <section style={{ position: "relative", background: "radial-gradient(120% 130% at 50% 0%, #16486E, #0A2940)",
      padding: "64px 32px", textAlign: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.5,
        background: "radial-gradient(closest-side at 50% 0%, rgba(214,183,117,0.25), transparent 65%)" }} />
      <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 34, color: "var(--gold-100)", margin: 0 }}>{title}</h2>
        {sub && <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20,
          color: "var(--fg-on-deep-muted)", margin: "12px 0 0" }}>{sub}</p>}
        <div style={{ marginTop: 26 }}><a href={href} style={{ fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--navy-800)",
          background: "var(--gold-500)", padding: "15px 32px", borderRadius: "var(--r-sm)", textDecoration: "none",
          display: "inline-block" }}>{label}</a></div>
      </div>
    </section>
  );
}

// Carte info simple
function InfoCard({ icon = "✦", title, children }) {
  return (
    <div style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)",
      borderRadius: "var(--r-md)", padding: "24px 26px", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ color: "var(--gold-600)", fontSize: 20 }}>{icon}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "0.02em",
        color: "var(--navy-700)", margin: "8px 0 8px" }}>{title}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.55, color: "var(--ink-soft)" }}>{children}</div>
    </div>
  );
}

// Mount helper : enveloppe header + contenu + footer
function PageShell({ active, children }) {
  return (
    <div id="site-scroll">
      <SiteHeader active={active} />
      <main id="contenu">{children}</main>
      <SiteFooter />
    </div>
  );
}

Object.assign(window, { PageHero, SubNav, Section, SectionWide, SectionHead, Prose, CtaBand, InfoCard, PageShell });
