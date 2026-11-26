"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logLogin } from "../actions";
import AuthCard, { authInputStyle, authLabelStyle, authTextStyle, authErrorStyle, authButtonStyle } from "@/components/admin/AuthCard";
import SignOutLink from "@/components/admin/SignOutLink";

/** Deuxième étape de la connexion : code à 6 chiffres de l'application d'authentification. */
export default function MfaPage() {
  const [factors, setFactors] = useState([]);
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        setError("Impossible de charger vos appareils d'authentification. Rechargez la page ; si le problème persiste, déconnectez-vous puis reconnectez-vous.");
        return;
      }
      const totp = data?.totp || [];
      setFactors(totp);
      if (totp[0]) setFactorId(totp[0].id);
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    if (error) {
      setError("Code incorrect ou expiré. Saisissez le code à 6 chiffres actuellement affiché dans votre application (il change toutes les 30 secondes).");
      setCode("");
      setLoading(false);
      return;
    }
    try {
      await logLogin();
    } catch {
      // journalisation best-effort
    }
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.assign(next === "/admin/nouveau-mot-de-passe" ? next : "/admin");
  };

  return (
    <AuthCard
      title="Vérification en deux étapes"
      subtitle="Saisissez le code de votre application d'authentification"
      footer={<SignOutLink />}
    >
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {factors.length > 1 && (
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={authLabelStyle}>Appareil</span>
            <select value={factorId} onChange={(e) => setFactorId(e.target.value)} style={authInputStyle}>
              {factors.map((f) => (
                <option key={f.id} value={f.id}>{f.friendly_name || "Application d'authentification"}</option>
              ))}
            </select>
          </label>
        )}
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={authLabelStyle}>Code à 6 chiffres</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
            autoComplete="one-time-code"
            style={{ ...authInputStyle, fontSize: 24, letterSpacing: "0.3em", textAlign: "center" }}
          />
        </label>
        {error && <div style={authErrorStyle}>{error}</div>}
        <button type="submit" disabled={loading || !factorId} style={authButtonStyle(loading || !factorId)}>
          {loading ? "Vérification…" : "Valider"}
        </button>
        <p style={{ ...authTextStyle, fontSize: 12.5 }}>
          Téléphone perdu ou changé ? Demandez à l'administrateur du site de réinitialiser votre double authentification.
        </p>
      </form>
    </AuthCard>
  );
}
