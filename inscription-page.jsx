/* ============================================================
   Site web — Formulaire d'inscription complet (4 étapes)
   Maquette de démonstration (ne soumet rien).
   ============================================================ */

function Fld({ label, value, onChange, placeholder, type = "text", required, half }) {
  const [f, setF] = React.useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: half ? "auto" : "1 / -1" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: "var(--navy-700)" }}>
        {label}{required && <span style={{ color: "var(--liturgic-red)" }}> *</span>}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ fontFamily: "var(--font-body)", fontSize: 16, padding: "11px 14px", background: "var(--ivory)",
          color: "var(--ink)", border: `1.5px solid ${f ? "var(--gold-500)" : "var(--stone-300)"}`,
          borderRadius: "var(--r-sm)", outline: "none", boxShadow: f ? "0 0 0 3px rgba(201,164,94,0.25)" : "none" }} />
    </label>
  );
}
function Sel({ label, value, onChange, options, half }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: half ? "auto" : "1 / -1" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: "var(--navy-700)" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ fontFamily: "var(--font-body)", fontSize: 16, padding: "11px 14px", background: "var(--ivory)",
          color: "var(--ink)", border: "1.5px solid var(--stone-300)", borderRadius: "var(--r-sm)", outline: "none" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Choice({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ flex: 1, minWidth: 140, padding: "14px 16px", cursor: "pointer",
      textAlign: "left", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 17,
      background: active ? "var(--navy-700)" : "var(--ivory)", color: active ? "var(--gold-200)" : "var(--navy-700)",
      border: `1.5px solid ${active ? "var(--navy-700)" : "var(--stone-300)"}`, borderRadius: "var(--r-sm)" }}>
      {active ? "✦ " : ""}{label}
    </button>
  );
}
function Toggle({ label, on, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%",
      textAlign: "left", padding: "14px 16px", cursor: "pointer", background: "var(--ivory)",
      border: `1.5px solid ${on ? "var(--gold-500)" : "var(--stone-300)"}`, borderRadius: "var(--r-sm)" }}>
      <span style={{ width: 40, height: 22, borderRadius: 999, background: on ? "var(--gold-500)" : "var(--stone-300)",
        position: "relative", flex: "none", transition: "background .15s" }}>
        <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%",
          background: "var(--ivory)", transition: "left .15s" }} /></span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink)" }}>{label}</span>
    </button>
  );
}
const lblStyle = { fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
  color: "var(--navy-700)", marginBottom: 9 };

function InscriptionComplete() {
  const mob = useIsMobile(640);
  const [step, setStep] = React.useState(1);
  const [done, setDone] = React.useState(false);
  const [f, setF] = React.useState({ branche: "Adulte", venue: "En chapitre", prenom: "", nom: "", email: "",
    tel: "", naissance: "", chapitre: "", region: "", aumonier: "Oui", car: "Aucun (je viens par mes moyens)",
    bivouac: false, soie: false, intentions: "", consent: false });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const steps = ["Le pèlerin", "Le chapitre", "Logistique", "Validation"];
  const grid = { display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 };

  if (done) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", background: "var(--ivory)",
        border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)",
        padding: "48px 40px", boxShadow: "var(--shadow-md)" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", border: "2px solid var(--gold-500)", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-600)", fontSize: 32 }}>✦</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 30, color: "var(--navy-700)", margin: "22px 0 8px" }}>Merci {f.prenom || ""} !</h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)", margin: 0 }}>
          Votre demande d'inscription a bien été prise en compte (maquette). Vous recevrez un e-mail de
          confirmation avec les informations logistiques et le lien de paiement sécurisé.</p>
        <button onClick={() => { setDone(false); setStep(1); }} style={{ marginTop: 24, fontFamily: "var(--font-display)",
          fontWeight: 600, fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--gold-200)",
          background: "var(--navy-700)", border: "none", padding: "13px 26px", borderRadius: "var(--r-sm)", cursor: "pointer" }}>Nouvelle inscription</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* progression */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: mob ? 4 : 8, marginBottom: 30, flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, flex: "none",
                background: step > i ? "var(--gold-500)" : "var(--stone-100)", color: step > i ? "var(--navy-800)" : "var(--stone-400)",
                border: step > i ? "none" : "1px solid var(--stone-300)" }}>{i + 1}</div>
              {!mob && <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
                color: step === i + 1 ? "var(--navy-700)" : "var(--stone-500)" }}>{s}</span>}
            </div>
            {i < 3 && <div style={{ width: mob ? 16 : 28, height: 2, background: step > i + 1 ? "var(--gold-500)" : "var(--stone-200)" }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)",
        borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)", padding: mob ? "26px 22px" : "34px 38px" }}>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div><div style={lblStyle}>Quelle branche ?</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Choice label="Adulte" active={f.branche === "Adulte"} onClick={() => set("branche", "Adulte")} />
                <Choice label="Famille-enfants" active={f.branche === "Famille-enfants"} onClick={() => set("branche", "Famille-enfants")} />
              </div></div>
            <div style={grid}>
              <Fld half label="Prénom" required value={f.prenom} onChange={v => set("prenom", v)} placeholder="Michel" />
              <Fld half label="Nom" required value={f.nom} onChange={v => set("nom", v)} placeholder="de la Baie" />
              <Fld half label="Adresse e-mail" required type="email" value={f.email} onChange={v => set("email", v)} placeholder="vous@exemple.fr" />
              <Fld half label="Téléphone" type="tel" value={f.tel} onChange={v => set("tel", v)} placeholder="06 12 34 56 78" />
              <Fld half label="Date de naissance" type="date" value={f.naissance} onChange={v => set("naissance", v)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div><div style={lblStyle}>Comment venez-vous ?</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Choice label="En chapitre" active={f.venue === "En chapitre"} onClick={() => set("venue", "En chapitre")} />
                <Choice label="Individuellement" active={f.venue === "Individuellement"} onClick={() => set("venue", "Individuellement")} />
              </div></div>
            <div style={grid}>
              <Fld half label="Nom du chapitre (facultatif)" value={f.chapitre} onChange={v => set("chapitre", v)} placeholder="Notre-Dame de…" />
              <Fld half label="Diocèse / région" value={f.region} onChange={v => set("region", v)} placeholder="Paris" />
              <Sel half label="Aumônier connu ?" value={f.aumonier} onChange={v => set("aumonier", v)} options={["Oui", "Non", "À déterminer"]} />
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--ink-soft)", margin: 0 }}>
              Sans chapitre, l'organisation vous répartira vers un chapitre proche de votre région.</p>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Sel label="Transport en car (aller)" value={f.car} onChange={v => set("car", v)}
              options={["Aucun (je viens par mes moyens)", "Paris (80 €)", "Versailles (80 €)", "Le Mans (60 €)", "Rennes (50 €)", "Nantes (60 €)"]} />
            <Toggle label="Option bivouac le jeudi soir à Saint-Malo" on={f.bivouac} onClick={() => set("bivouac", !f.bivouac)} />
            <Toggle label="Ajouter le carré de soie de l'itinéraire" on={f.soie} onClick={() => set("soie", !f.soie)} />
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={lblStyle}>Intentions de prière (facultatif)</span>
              <textarea value={f.intentions} onChange={e => set("intentions", e.target.value)} rows={3} placeholder="Confiez vos intentions…"
                style={{ fontFamily: "var(--font-body)", fontSize: 16, padding: "11px 14px", background: "var(--ivory)",
                  color: "var(--ink)", border: "1.5px solid var(--stone-300)", borderRadius: "var(--r-sm)", outline: "none", resize: "vertical" }} />
            </label>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 24, color: "var(--navy-700)", margin: "0 0 16px" }}>Récapitulatif</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
              {[["Pèlerin", `${f.prenom || "—"} ${f.nom}`], ["Branche", f.branche], ["Venue", f.venue + (f.chapitre ? ` · ${f.chapitre}` : "")],
                ["Région", f.region || "—"], ["Transport", f.car], ["Options", [f.bivouac && "bivouac jeudi", f.soie && "carré de soie"].filter(Boolean).join(", ") || "aucune"]].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--gold-700)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 15.5, color: "var(--ink)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18,
              background: "var(--parchment)", borderRadius: "var(--r-sm)", padding: "16px 18px" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--navy-700)" }}>Frais d'inscription</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--gold-700)" }}>50 €</span>
            </div>
            <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 18, cursor: "pointer" }}>
              <input type="checkbox" checked={f.consent} onChange={e => set("consent", e.target.checked)} style={{ marginTop: 4, width: 18, height: 18, accentColor: "var(--gold-600)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                J'accepte que mes données soient utilisées pour l'organisation du pèlerinage et je confirme être informé(e) du caractère pédestre et en bivouac.</span>
            </label>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 28 }}>
          <button type="button" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase",
              background: "transparent", color: "var(--navy-700)", border: "1.5px solid var(--navy-700)", padding: "12px 24px",
              borderRadius: "var(--r-sm)", cursor: "pointer", opacity: step === 1 ? 0.35 : 1 }}>Retour</button>
          {step < 4
            ? <button type="button" onClick={() => setStep(s => s + 1)} style={{ fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase", background: "var(--navy-700)", color: "var(--gold-200)",
                border: "none", padding: "12px 28px", borderRadius: "var(--r-sm)", cursor: "pointer" }}>Continuer</button>
            : <button type="button" onClick={() => f.consent && setDone(true)} style={{ fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase", background: f.consent ? "var(--gold-500)" : "var(--stone-300)",
                color: "var(--navy-800)", border: "none", padding: "12px 28px", borderRadius: "var(--r-sm)",
                cursor: f.consent ? "pointer" : "not-allowed" }}>Valider & payer</button>}
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--stone-500)", textAlign: "center", marginTop: 16 }}>
        Maquette de démonstration — aucun paiement réel. Contact : inscription.pelesaintmichel@gmail.com</p>
    </div>
  );
}

Object.assign(window, { InscriptionComplete });
