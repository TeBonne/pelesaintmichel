/* ============================================================
   Site web — primitives partagées
   ============================================================ */

// Logo (crest officiel) — taille via prop
function Logo({ height = 44, variant = "color" }) {
  const src = variant === "medallion"
    ? "assets/logo-medallion-cream.png"
    : "assets/logo-pele-saint-michel.png";
  return <img src={src} alt="Pèlerinage de Saint Michel" style={{ height, width: "auto", display: "block" }} />;
}

function Overline({ children, onDeep }) {
  return (
    <div style={{
      fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12,
      letterSpacing: "0.26em", textTransform: "uppercase",
      color: onDeep ? "var(--gold-400)" : "var(--gold-700)"
    }}>{children}</div>
  );
}

// Bouton — variantes primary / gold / ghost / link
function Button({ children, variant = "primary", onClick, onDeep, style = {} }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const base = {
    fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
    letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "13px 28px", borderRadius: "var(--r-sm)", border: "none",
    cursor: "pointer", transition: "all .2s cubic-bezier(.22,.61,.36,1)",
    transform: press ? "translateY(1px)" : "none",
  };
  const variants = {
    primary: { background: hover ? "var(--navy-800)" : "var(--navy-700)", color: "var(--gold-200)" },
    gold: { background: hover ? "var(--gold-400)" : "var(--gold-500)", color: "var(--navy-800)" },
    ghost: {
      background: hover ? (onDeep ? "rgba(201,164,94,0.12)" : "rgba(16,58,92,0.06)") : "transparent",
      color: onDeep ? "var(--gold-200)" : "var(--navy-700)",
      border: `1.5px solid ${onDeep ? "var(--gold-500)" : "var(--navy-700)"}`,
      padding: "11.5px 26px",
    },
  };
  if (variant === "link") {
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          background: "none", border: "none", cursor: "pointer", padding: "2px 0",
          fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 17,
          color: onDeep ? "var(--gold-200)" : "var(--navy-600)",
          borderBottom: `2px solid ${hover ? "var(--gold-600)" : "var(--gold-500)"}`,
          ...style,
        }}>{children}</button>
    );
  }
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}>{children}</button>
  );
}

// Emplacement photo — affiche une vraie image (src) ou un placeholder noble
function PhotoSlot({ label, src, ratio = "16/9", radius = "var(--r-md)", pos = "center", style = {} }) {
  if (src) {
    return (
      <div style={{ aspectRatio: ratio, borderRadius: radius, overflow: "hidden",
        background: "var(--navy-800)", ...style }}>
        <img src={src} alt={label || ""} style={{ width: "100%", height: "100%",
          objectFit: "cover", objectPosition: pos, display: "block" }} />
      </div>
    );
  }
  return (
    <div style={{
      aspectRatio: ratio, borderRadius: radius, position: "relative", overflow: "hidden",
      background: "radial-gradient(120% 130% at 50% 0%, #1E5A85 0%, #103A5C 50%, #0A2940 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", ...style,
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.5,
        background: "radial-gradient(closest-side at 50% 38%, rgba(214,183,117,0.30), transparent 70%)" }} />
      <div style={{ position: "relative", textAlign: "center", color: "var(--gold-300)", padding: 16 }}>
        <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.85 }}>✦</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.8 }}>Photo</div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600, marginTop: 2,
          color: "var(--gold-100)" }}>{label}</div>
      </div>
    </div>
  );
}

// Sceau / médaillon rond
function Seal({ children, size = 64 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flex: "none",
      border: "2px solid var(--gold-500)", display: "flex", alignItems: "center",
      justifyContent: "center", color: "var(--gold-500)",
      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: size * 0.4,
    }}>{children}</div>
  );
}

// Filet doré orné
function GoldRule({ icon = "✦", width = 220 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width, color: "var(--gold-600)" }}>
      <span style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, var(--gold-500))" }} />
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ height: 1, flex: 1, background: "linear-gradient(90deg, var(--gold-500), transparent)" }} />
    </div>
  );
}

// Hook responsive : vrai si la fenêtre est plus étroite que `bp`
function useIsMobile(bp = 820) {
  const [m, setM] = React.useState(typeof window !== "undefined" ? window.innerWidth < bp : false);
  React.useEffect(() => {
    const fn = () => setM(window.innerWidth < bp);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return m;
}

Object.assign(window, { Logo, Overline, Button, PhotoSlot, Seal, GoldRule, useIsMobile });
