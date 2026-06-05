"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logLogin } from "../actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou mot de passe incorrect.");
      setLoading(false);
      return;
    }
    try {
      await logLogin();
    } catch {
      // journalisation best-effort
    }
    router.replace("/admin");
    router.refresh();
  };

  const inputStyle = {
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

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--navy-900)",
        padding: 24,
      }}
    >
      <div style={{ width: "min(420px, 100%)", textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-medallion-cream.png" alt="Pèlerinage de Saint Michel" style={{ height: 92, marginBottom: 22 }} />
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.04em",
            color: "var(--gold-200)",
            margin: "0 0 4px",
          }}
        >
          Espace d'administration
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-on-deep-muted)", margin: "0 0 26px" }}>
          Connectez-vous pour modifier la page d'accueil
        </p>

        <form
          onSubmit={onSubmit}
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
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--navy-700)" }}>
              Adresse e-mail
            </span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--navy-700)" }}>
              Mot de passe
            </span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" style={inputStyle} />
          </label>

          {error && (
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--liturgic-red)", background: "rgba(123,34,48,0.08)", padding: "8px 12px", borderRadius: "var(--r-sm)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="pele-cta-halo"
            style={{
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
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <a href="/" style={{ display: "inline-block", marginTop: 18, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-300)", textDecoration: "none" }}>
          ← Retour au site
        </a>
      </div>
    </main>
  );
}
