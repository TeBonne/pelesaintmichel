/* ============================================================
   Site web — Sections de page
   ============================================================ */

function Hero({ onInscription }) {
  return (
    <section style={{ position: "relative", minHeight: 660, display: "flex",
      alignItems: "flex-end", overflow: "hidden" }}>
      {/* illustration de marque (édition en cours) */}
      <img src="assets/illustration-edition.png" alt="Saint Michel archange désignant le Mont-Saint-Michel — illustration de l'édition du pèlerinage"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center center" }} />
      {/* dégradé de protection : clair au centre, sombre en bas pour le texte */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(7,34,58,0.22) 0%, rgba(7,34,58,0.00) 30%, rgba(7,34,58,0.52) 62%, rgba(7,34,58,0.94) 100%)" }} />
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 32px 64px",
        width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <Overline onDeep>Du 8 au 10 mai 2026 · Saint-Malo → le Mont</Overline>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.6rem,5vw,4rem)",
            lineHeight: 1.05, letterSpacing: "0.02em", color: "var(--gold-100)", margin: "18px 0 0",
            textWrap: "balance", textShadow: "0 2px 30px rgba(7,34,58,0.5)" }}>
            Le pèlerinage de toute la France au Mont Saint-Michel
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 22, lineHeight: 1.5,
            color: "var(--gold-100)", margin: "20px 0 0", maxWidth: 540,
            textShadow: "0 1px 16px rgba(7,34,58,0.6)" }}>
            Trois jours et trois nuits de marche et de prière pour nous tourner vers le Christ,
            sous la bannière de saint Michel et des anges.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <Button variant="gold" onClick={onInscription} style={{ fontWeight: 800 }}>Devenir miquelot</Button>
            <Button variant="ghost" onDeep>Découvrir le programme</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chiffres() {
  const items = [
    { k: "3", t: "jours & 3 nuits", s: "de Saint-Malo au Mont" },
    { k: "~20", t: "km par jour", s: "sur sentiers balisés" },
    { k: "15–50", t: "par chapitre", s: "petites unités de marche" },
    { k: "1000+", t: "ans d'histoire", s: "les chemins du paradis" },
  ];
  return (
    <section style={{ background: "var(--parchment)", padding: "64px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid",
        gridTemplateColumns: useIsMobile(640) ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 24 }}>
        {items.map((it, i) => (
          <div key={i} style={{ textAlign: "center", padding: "8px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 50,
              color: "var(--navy-700)", lineHeight: 1 }}>{it.k}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 19,
              color: "var(--navy-700)", marginTop: 6 }}>{it.t}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)",
              marginTop: 4 }}>{it.s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Programme() {
  const days = [
    { d: "Vendredi 8 mai", t: "Le départ", txt: "Messe à la cathédrale de Saint-Malo et procession dans les rues de la vieille ville, puis première marche vers le bivouac.", ph: "Cathédrale de Saint-Malo", src: "assets/photos/depart-saintmalo.jpg", pos: "center 40%" },
    { d: "Samedi 9 mai", t: "Le chemin", txt: "Marche en chapitre, topos et témoignages sur le combat spirituel. Le soir, grande montée aux flambeaux jusqu'au Mont et veillée à l'abbatiale.", ph: "Montée aux flambeaux", src: "assets/photos/montee-flambeaux.jpg", pos: "center 35%" },
    { d: "Dimanche 10 mai", t: "L'arrivée", txt: "Remise du plomb de Saint-Michel, insigne du pèlerin refondu pour l'occasion, et messe de clôture au pied du Mont.", ph: "Le Mont en majesté", src: "assets/photos/mont-procession.jpg", pos: "center 30%" },
  ];
  return (
    <section style={{ background: "var(--ivory)", padding: "80px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Overline>Le déroulé</Overline>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 40,
            color: "var(--navy-700)", margin: "10px 0 16px" }}>Trois jours en marche</h2>
          <div style={{ display: "flex", justifyContent: "center" }}><GoldRule /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: useIsMobile(820) ? "1fr" : "repeat(3,1fr)", gap: 28 }}>
          {days.map((day, i) => (
            <article key={i} style={{ background: "var(--ivory)", border: "1px solid var(--line)",
              borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)",
              boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
              <PhotoSlot label={day.ph} src={day.src} pos={day.pos} ratio="4/3" radius="0" />
              <div style={{ padding: "22px 24px 26px" }}>
                <Overline>{day.d}</Overline>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22,
                  letterSpacing: "0.03em", color: "var(--navy-700)", margin: "8px 0 10px" }}>{day.t}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6,
                  color: "var(--ink-soft)", margin: 0 }}>{day.txt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Citation() {
  return (
    <section style={{ position: "relative", padding: "120px 32px", overflow: "hidden" }}>
      <img src="assets/photos/veillee-abbatiale.jpg" alt="Veillée à l'abbatiale"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 40%" }} />
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(7,34,58,0.78), rgba(7,34,58,0.62))" }} />
      <div style={{ position: "relative", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <div style={{ color: "var(--gold-400)", fontSize: 30, marginBottom: 18 }}>✦</div>
        <blockquote style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontStyle: "italic",
          fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)", lineHeight: 1.4, color: "var(--gold-100)", margin: 0,
          textShadow: "0 2px 24px rgba(7,34,58,0.6)" }}>
          Dieu nous aime, et le mal ne l'emportera pas !
        </blockquote>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--gold-300)", marginTop: 24 }}>
          Thème de l'édition 2026
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const data = [
    { q: "Qu'est-ce qu'un miquelot ?", a: "Un miquelot, c'est tout simplement un pèlerin du Mont Saint-Michel, et ce depuis la fin du premier millénaire." },
    { q: "Faut-il marcher seul ou en groupe ?", a: "Vous pouvez vous inscrire seul, mais nous vous invitons à former un chapitre avec des pèlerins de votre région, si possible avec un prêtre aumônier que vous connaissez." },
    { q: "Combien de kilomètres par jour ?", a: "Environ 20 à 30 km par jour pour les adultes, sur routes balisées ou de campagne. Des voitures-balais accompagnent les pèlerins fatigués." },
    { q: "Faut-il être baptisé pour participer ?", a: "Non, le pèlerinage est ouvert à toute personne désireuse d'approfondir sa foi ; il s'agit toutefois d'un pèlerinage catholique." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ background: "var(--parchment)", padding: "80px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Overline>Questions fréquentes</Overline>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 40,
            color: "var(--navy-700)", margin: "10px 0 0" }}>Avant de vous mettre en marche</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.map((it, i) => (
            <div key={i} style={{ background: "var(--ivory)", border: "1px solid var(--line)",
              borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ color: "var(--gold-600)", fontSize: 16, transform: open === i ? "rotate(90deg)" : "none",
                  transition: "transform .2s" }}>✦</span>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20,
                  color: "var(--navy-700)" }}>{it.q}</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 22px 54px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 16.5, lineHeight: 1.65,
                    color: "var(--ink-soft)", margin: 0 }}>{it.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Button variant="ghost">Voir toutes les questions</Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Chiffres, Programme, Citation, FAQ });
