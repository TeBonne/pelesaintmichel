/* ============================================================
   Site web — Formulaire d'inscription (multi-étapes, fictif)
   ============================================================ */

function Field({ label, value, onChange, placeholder, type = "text" }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
        letterSpacing: "0.04em", color: "var(--navy-700)" }}>{label}</span>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ fontFamily: "var(--font-body)", fontSize: 16, padding: "11px 14px",
          background: "var(--ivory)", color: "var(--ink)",
          border: `1.5px solid ${focus ? "var(--gold-500)" : "var(--stone-300)"}`,
          borderRadius: "var(--r-sm)", outline: "none",
          boxShadow: focus ? "0 0 0 3px rgba(201,164,94,0.25)" : "none",
          transition: "all .15s ease" }} />
    </label>
  );
}

function Choice({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "14px 16px", cursor: "pointer", textAlign: "left",
      fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 17,
      background: active ? "var(--navy-700)" : "var(--ivory)",
      color: active ? "var(--gold-200)" : "var(--navy-700)",
      border: `1.5px solid ${active ? "var(--navy-700)" : "var(--stone-300)"}`,
      borderRadius: "var(--r-sm)", transition: "all .15s ease" }}>
      {active ? "✦ " : ""}{label}
    </button>
  );
}

function InscriptionForm() {
  const isMobile = useIsMobile(640);
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ branche: "Adulte", venue: "En chapitre",
    nom: "", prenom: "", email: "", chapitre: "", region: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const total = 3;

  return (
    <section id="inscription" style={{ background: "var(--ivory)", padding: "72px 32px 90px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <Overline>Inscription 2026</Overline>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 38,
            color: "var(--navy-700)", margin: "10px 0 0" }}>Rejoignez la marche</h2>
        </div>

        {/* progression */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, margin: "22px 0 32px" }}>
          {[1, 2, 3].map(n => (
            <React.Fragment key={n}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 14,
                background: step >= n ? "var(--gold-500)" : "var(--stone-100)",
                color: step >= n ? "var(--navy-800)" : "var(--stone-400)",
                border: step >= n ? "none" : "1px solid var(--stone-300)" }}>{n}</div>
              {n < 3 && <div style={{ width: 48, height: 2,
                background: step > n ? "var(--gold-500)" : "var(--stone-200)" }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ background: "var(--parchment)", border: "1px solid var(--line)",
          borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)",
          boxShadow: "var(--shadow-md)", padding: "34px 36px" }}>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={fieldLabelStyle}>Quelle branche ?</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Choice label="Adulte" active={form.branche === "Adulte"} onClick={() => set("branche", "Adulte")} />
                  <Choice label="Famille-enfants" active={form.branche === "Famille-enfants"} onClick={() => set("branche", "Famille-enfants")} />
                </div>
              </div>
              <div>
                <div style={fieldLabelStyle}>Comment venez-vous ?</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Choice label="En chapitre" active={form.venue === "En chapitre"} onClick={() => set("venue", "En chapitre")} />
                  <Choice label="Individuellement" active={form.venue === "Individuellement"} onClick={() => set("venue", "Individuellement")} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
              <Field label="Prénom" value={form.prenom} onChange={v => set("prenom", v)} placeholder="Michel" />
              <Field label="Nom" value={form.nom} onChange={v => set("nom", v)} placeholder="de la Baie" />
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Adresse e-mail" type="email" value={form.email} onChange={v => set("email", v)} placeholder="vous@exemple.fr" />
              </div>
              <Field label="Chapitre (facultatif)" value={form.chapitre} onChange={v => set("chapitre", v)} placeholder="Notre-Dame de…" />
              <Field label="Diocèse / région" value={form.region} onChange={v => set("region", v)} placeholder="Paris" />
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <Seal size={72}>✦</Seal>
              <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 26,
                color: "var(--navy-700)", margin: "20px 0 8px" }}>Récapitulatif</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7,
                color: "var(--ink-soft)", margin: "0 auto", maxWidth: 420 }}>
                {form.prenom || "Pèlerin"} {form.nom}, branche <b style={{ color: "var(--navy-700)" }}>{form.branche.toLowerCase()}</b>,
                {" "}{form.venue.toLowerCase()}{form.chapitre ? ` (chapitre ${form.chapitre})` : ""}.
                Au départ, un livret du pèlerin vous sera remis ; à l'arrivée, le plomb de Saint-Michel.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, gap: 12 }}>
            <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))}
              style={{ opacity: step === 1 ? 0.4 : 1, pointerEvents: step === 1 ? "none" : "auto" }}>
              Retour
            </Button>
            {step < total
              ? <Button variant="primary" onClick={() => setStep(step + 1)}>Continuer</Button>
              : <Button variant="gold" onClick={() => setStep(1)}>Valider mon inscription</Button>}
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--stone-500)",
          textAlign: "center", marginTop: 16 }}>
          Maquette de démonstration · inscription.pelesaintmichel@gmail.com
        </p>
      </div>
    </section>
  );
}

const fieldLabelStyle = { fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
  letterSpacing: "0.04em", color: "var(--navy-700)", marginBottom: 9 };

Object.assign(window, { InscriptionForm, Field });
