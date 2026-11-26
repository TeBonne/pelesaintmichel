"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthCard, { authInputStyle, authLabelStyle, authTextStyle, authErrorStyle, authLinkStyle, authButtonStyle } from "@/components/admin/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("erreur") === "lien") {
      setError("Ce lien n'est plus valide (déjà utilisé, expiré, ou ouvert dans un autre navigateur que celui de la demande). Demandez-en un nouveau ci-dessous et ouvrez-le dans ce même navigateur.");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/auth/confirm`,
    });
    setLoading(false);
    if (error && error.status === 429) {
      setError("Trop de demandes en peu de temps. Patientez une heure puis réessayez.");
      return;
    }
    // Même message que le compte existe ou non (on ne révèle pas quels e-mails ont un compte).
    setSent(true);
  };

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Recevez un lien pour en choisir un nouveau"
      footer={<a href="/admin/login" style={authLinkStyle}>← Retour à la connexion</a>}
    >
      {sent ? (
        <p style={authTextStyle}>
          Si un compte existe pour <b>{email.trim()}</b>, un e-mail vient d'être envoyé avec un lien valable une heure.
          Ouvrez-le <b>dans ce même navigateur</b>. Pensez à vérifier le dossier des indésirables.
        </p>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={authTextStyle}>Saisissez l'adresse e-mail de votre compte : vous recevrez un lien pour définir un nouveau mot de passe.</p>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={authLabelStyle}>Adresse e-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={authInputStyle} />
          </label>
          {error && <div style={authErrorStyle}>{error}</div>}
          <button type="submit" disabled={loading} style={authButtonStyle(loading)}>
            {loading ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
