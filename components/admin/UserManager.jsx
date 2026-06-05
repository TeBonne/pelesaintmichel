"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addEditor, updateRole, removeUser } from "@/app/admin/actions";

const cardStyle = {
  background: "var(--ivory)",
  border: "1px solid var(--line)",
  borderTop: "3px solid var(--navy-700)",
  borderRadius: "var(--r-md)",
  boxShadow: "var(--shadow-sm)",
  padding: "24px 26px 26px",
};
const inputStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  padding: "9px 11px",
  background: "var(--ivory)",
  color: "var(--ink)",
  border: "1.5px solid var(--stone-300)",
  borderRadius: "var(--r-sm)",
  outline: "none",
};
const miniBtn = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid var(--stone-300)",
  background: "var(--ivory)",
  color: "var(--navy-700)",
  borderRadius: "var(--r-sm)",
  padding: "6px 10px",
  cursor: "pointer",
};

function Badge({ role }) {
  const admin = role === "admin";
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        padding: "3px 9px",
        borderRadius: "var(--r-pill)",
        color: admin ? "var(--navy-800)" : "var(--navy-700)",
        background: admin ? "var(--gold-400)" : "var(--stone-100)",
        border: admin ? "none" : "1px solid var(--stone-300)",
      }}
    >
      {admin ? "Administrateur" : "Éditeur"}
    </span>
  );
}

export default function UserManager({ initial = [], currentEmail }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const flash = (m, isErr) => {
    setMsg({ m, isErr });
    setTimeout(() => setMsg(null), 3000);
  };

  const run = async (fn) => {
    setBusy(true);
    const res = await fn();
    setBusy(false);
    if (res && res.ok) {
      router.refresh();
      return true;
    }
    flash((res && res.error) || "Action impossible. Vérifiez l'adresse e-mail saisie et vos droits, puis réessayez.", true);
    return false;
  };

  const onAdd = async () => {
    const ok = await run(() => addEditor(email, role));
    if (ok) {
      setEmail("");
      setRole("editor");
      flash("Éditeur autorisé ✓", false);
    }
  };

  return (
    <section style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 24, color: "var(--navy-700)", margin: "0 0 4px" }}>
        Éditeurs & droits
      </h2>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)", margin: "0 0 18px" }}>
        Autorise des personnes à modifier le site. <b>Administrateur</b> : gère aussi les droits et voit le journal.
        <b> Éditeur</b> : modifie uniquement le contenu.
      </p>

      {/* Liste */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {initial.map((u) => (
          <div
            key={u.email}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-sm)",
              padding: "10px 14px",
              background: "var(--parchment)",
            }}
          >
            <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--navy-800)", fontWeight: 600 }}>
              {u.email}
              {u.email === currentEmail && (
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--stone-500)", fontWeight: 400 }}> (vous)</span>
              )}
            </span>
            <Badge role={u.role} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <select
                value={u.role}
                disabled={busy}
                onChange={(e) => run(() => updateRole(u.email, e.target.value))}
                style={{ ...inputStyle, padding: "6px 8px", fontSize: 13 }}
                aria-label={`Rôle de ${u.email}`}
              >
                <option value="editor">Éditeur</option>
                <option value="admin">Administrateur</option>
              </select>
              <button
                type="button"
                style={{ ...miniBtn, color: "var(--liturgic-red)", borderColor: "rgba(123,34,48,0.4)" }}
                disabled={busy}
                onClick={() => {
                  if (confirm(`Retirer l'accès de ${u.email} ?`)) run(() => removeUser(u.email));
                }}
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
        {initial.length === 0 && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)" }}>Aucun utilisateur.</p>
        )}
      </div>

      {/* Ajout */}
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--navy-700)", marginBottom: 8 }}>
          Autoriser une nouvelle personne
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.fr"
            style={{ ...inputStyle, flex: 1, minWidth: 220 }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, padding: "9px 8px" }}>
            <option value="editor">Éditeur</option>
            <option value="admin">Administrateur</option>
          </select>
          <button
            type="button"
            onClick={onAdd}
            disabled={busy}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--gold-200)",
              background: "var(--navy-700)",
              border: "none",
              borderRadius: "var(--r-sm)",
              padding: "10px 18px",
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            Autoriser
          </button>
        </div>
        {msg && (
          <div style={{ marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 13, color: msg.isErr ? "var(--liturgic-red)" : "#2f7d3a" }}>
            {msg.m}
          </div>
        )}
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--stone-500)", marginTop: 12, lineHeight: 1.5 }}>
          ⚠️ Autoriser ici donne les droits, mais ne crée pas le compte. Chaque personne doit aussi avoir un
          compte créé dans Supabase (Authentication → Users → Add user, avec la même adresse e-mail). Elle se
          connecte ensuite sur <b>/admin/login</b>.
        </p>
      </div>
    </section>
  );
}
