/* ============================================================
   Site web — Header & Footer
   ============================================================ */

// Pictos réseaux sociaux (style Lucide, trait 1.5) + liens
function SocialIcons({ onDeep = true }) {
  const items = [
    ["Instagram", "https://www.instagram.com/montsaintmichelpelerinage/",
      <g><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="3.5"/><line x1="16.5" y1="7.5" x2="16.51" y2="7.5"/></g>],
    ["Facebook", "https://www.facebook.com/61573100641502",
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>],
    ["YouTube", "https://www.youtube.com/@P%C3%A8lerinageFranceSaintMichel",
      <g><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></g>],
    ["TikTok", "https://www.tiktok.com/@montstmichelpelerinage",
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>],
  ];
  const [hover, setHover] = React.useState(-1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {items.map(([label, href, path], i) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
          style={{ display: "flex", padding: 5, borderRadius: "50%",
            color: hover === i ? "var(--gold-400)" : "var(--gold-200)",
            background: hover === i ? "rgba(201,164,94,0.15)" : "transparent",
            transition: "all .15s ease" }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
        </a>
      ))}
    </div>
  );
}

const SITE_NAV = [
  ["Accueil", "index.html"],
  ["Le pèlerinage", "le-pelerinage.html", [
    ["Présentation", "le-pelerinage.html"],
    ["Pour qui ?", "le-pelerinage.html#pour-qui"],
    ["Les chapitres", "le-pelerinage.html#chapitres"],
    ["Histoire & miquelots", "le-pelerinage.html#histoire"],
  ]],
  ["Programme", "programme.html"],
  ["Prier", "prier.html", [
    ["Prière à saint Michel", "prier.html#priere"],
    ["Le chapelet de saint Michel", "prier.html#chapelet"],
    ["La neuvaine", "prier.html#neuvaine"],
    ["Les anges", "prier.html#anges"],
  ]],
  ["FAQ", "faq.html"],
  ["Boutique", "boutique.html"],
  ["Nous soutenir", "nous-soutenir.html"],
];

function SiteHeader({ active = "Accueil" }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 30);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);
  const isMobile = useIsMobile(960);
  const [open, setOpen] = React.useState(false);
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  React.useEffect(() => { if (!isMobile) setOpen(false); }, [isMobile]);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      background: (scrolled || open) ? "rgba(7,34,58,0.97)" : "rgba(7,34,58,0.80)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      borderBottom: `1px solid ${scrolled ? "var(--line-on-deep)" : "rgba(201,164,94,0.18)"}`,
      transition: "all .3s ease",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: isMobile ? "10px 20px" : "12px 32px",
        display: "flex", alignItems: "center", gap: 16 }}>
        <a href="index.html" aria-label="Pèlerinage de Saint Michel — accueil"
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="assets/logo-medallion-cream.png" alt="Pèlerinage de Saint Michel"
            style={{ height: isMobile ? 46 : 54 }} />
        </a>

        {!isMobile && (
          <nav aria-label="Navigation principale" style={{ display: "flex", gap: 12, marginLeft: 12 }}>
            {SITE_NAV.map(([label, href, subs], i) => {
              const support = label === "Nous soutenir";
              const on = active === label;
              return (
                <div key={label} style={{ position: "relative" }}
                  onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}>
                  <a href={href} aria-current={on ? "page" : undefined} style={{
                    fontFamily: "var(--font-serif)", fontWeight: support ? 700 : 600, fontSize: 16.5,
                    color: support ? "var(--gold-400)" : (on ? "var(--gold-300)" : "var(--gold-100)"),
                    textDecoration: "none", whiteSpace: "nowrap", paddingBottom: 5, display: "inline-block",
                    borderBottom: (support || on) ? "2px solid var(--gold-500)" : "2px solid transparent",
                  }}>{label}{subs ? " ›" : ""}</a>
                  {subs && hoverIdx === i && (
                    <div style={{ position: "absolute", top: "100%", left: -12, paddingTop: 10 }}>
                      <div style={{ background: "var(--navy-800)", border: "1px solid var(--line-on-deep)",
                        borderTop: "2px solid var(--gold-500)", borderRadius: "0 0 var(--r-md) var(--r-md)",
                        boxShadow: "var(--shadow-lg)", padding: "8px 0", minWidth: 224 }}>
                        {subs.map(([sl, sh]) => (
                          <a key={sl} href={sh} style={{ display: "block", fontFamily: "var(--font-body)",
                            fontSize: 16, color: "var(--gold-100)", textDecoration: "none", padding: "9px 20px",
                            whiteSpace: "nowrap" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,164,94,0.14)"; e.currentTarget.style.color = "var(--gold-300)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold-100)"; }}>{sl}</a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {!isMobile && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <SocialIcons />
            <a href="inscription.html" style={{ fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--navy-800)",
              background: "var(--gold-500)", padding: "11px 16px", borderRadius: "var(--r-sm)",
              textDecoration: "none", whiteSpace: "nowrap" }}>S'inscrire</a>
          </div>
        )}

        {isMobile && (
          <button onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--gold-200)"
              strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <g><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></g>
                : <g><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></g>}
            </svg>
          </button>
        )}
      </div>

      {isMobile && open && (
        <nav aria-label="Navigation principale" style={{ padding: "8px 20px 22px",
          borderTop: "1px solid var(--line-on-deep)", display: "flex", flexDirection: "column", gap: 2,
          maxHeight: "70vh", overflowY: "auto" }}>
          {SITE_NAV.map(([label, href, subs]) => {
            const support = label === "Nous soutenir";
            return (
              <div key={label}>
                <a href={href} aria-current={active === label ? "page" : undefined} style={{
                  display: "block", fontFamily: "var(--font-serif)", fontWeight: support ? 700 : 600, fontSize: 19,
                  color: support ? "var(--gold-400)" : (active === label ? "var(--gold-300)" : "var(--gold-100)"),
                  textDecoration: "none", padding: "11px 4px", borderBottom: "1px solid rgba(201,164,94,0.12)" }}>{label}</a>
                {subs && (
                  <div style={{ padding: "2px 0 8px 16px" }}>
                    {subs.slice(1).map(([sl, sh]) => (
                      <a key={sl} href={sh} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 16,
                        color: "var(--fg-on-deep-muted)", textDecoration: "none", padding: "7px 4px" }}>{sl}</a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a href="inscription.html" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14,
            letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--navy-800)", background: "var(--gold-500)",
            padding: "13px 18px", borderRadius: "var(--r-sm)", textDecoration: "none", textAlign: "center", marginTop: 14 }}>S'inscrire</a>
          <div style={{ marginTop: 16 }}><SocialIcons /></div>
        </nav>
      )}
    </header>
  );
}

function SiteFooter() {
  const isMobile = useIsMobile(720);
  const col = { display: "flex", flexDirection: "column", gap: 9 };
  const a = { fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-on-deep-muted)",
    textDecoration: "none", cursor: "pointer" };
  const h = { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
    letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: 4 };
  return (
    <footer id="contact" style={{ background: "var(--navy-900)", color: "var(--fg-on-deep)", padding: "56px 32px 36px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 28 : 40, alignItems: "start" }}>
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <img src="assets/logo-medallion-cream.png" alt="" style={{ height: 76, marginBottom: 16 }} />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.5,
            color: "var(--fg-on-deep)", margin: 0, fontStyle: "italic", whiteSpace: isMobile ? "normal" : "nowrap" }}>
            « Dieu nous aime, et le mal ne l'emportera pas ! »
          </p>
          <div style={{ marginTop: 18 }}><SocialIcons /></div>
        </div>
        <nav style={col} aria-label="Le pèlerinage"><div style={h}>Le pèlerinage</div>
          <a style={a} href="#sec-prog">Le pèlerinage</a><a style={a} href="#sec-prog">Programme</a><a style={a} href="#inscription">Devenir miquelot</a><a style={a} href="#sec-faq">FAQ 2026</a></nav>
        <nav style={col} aria-label="Prier & se former"><div style={h}>Prier & se former</div>
          <a style={a} href="#sec-cit">Prier saint Michel</a><a style={a} href="#sec-cit">Les anges</a><a style={a} href="#sec-cit">Le combat spirituel</a><a style={a} href="#sec-cit">Neuvaine Hozanna</a></nav>
        <nav style={col} aria-label="Nous contacter"><div style={h}>Nous contacter</div>
          <a style={a} href="mailto:inscription.pelesaintmichel@gmail.com">inscription.pelesaintmichel<br/>@gmail.com</a><a style={a} href="#contact">Devenir bénévole</a><a style={a} href="#contact">Faire un don</a></nav>
      </div>
      <div style={{ maxWidth: 1180, margin: "40px auto 0", paddingTop: 24,
        borderTop: "1px solid var(--line-on-deep)", display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-on-deep-muted)" }}>
          Association Pèlerinage de saint Michel · avec le soutien du Sanctuaire du Mont-Saint-Michel
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--gold-500)", letterSpacing: "0.1em" }}>
          ✦ Du 8 au 10 mai 2026
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, SiteFooter });
