"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logSecurityEvent } from "../actions";
import AuthCard, { authInputStyle, authLabelStyle, authTextStyle, authErrorStyle, authLinkStyle, authButtonStyle } from "@/components/admin/AuthCard";

const MIN_LENGTH = 12;

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`);
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      if (error.code === "insufficient_aal") {
        window.location.assign("/admin/mfa?next=/admin/nouveau-mot-de-passe");
        return;
      }
      setLoading(false);
      if (error.code === "same_password") setError("Choisissez un mot de passe différent de l'ancien.");
      else if (error.code === "weak_password") setError("Ce mot de passe est trop simple. Allongez-le ou mélangez lettres, chiffres et symboles.");
      else setError("Le mot de passe n'a pas pu être modifié : " + error.message + ". Si vous veniez d'un lien reçu par e-mail, redemandez-en un.");
      return;
    }
    try {
      await logSecurityEvent("password_changed");
    } catch {
      // journalisation best-effort
    }
    window.location.assign("/admin");
  };

  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe que vous n'utilisez nulle part ailleurs"
      footer={<a href="/admin" style={authLinkStyle}>← Annuler</a>}
    >
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={authTextStyle}>Au moins {MIN_LENGTH} caractères. Une phrase de plusieurs mots est à la fois solide et facile à retenir.</p>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={authLabelStyle}>Nouveau mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={MIN_LENGTH} autoComplete="new-password" style={authInputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={authLabelStyle}>Confirmez le mot de passe</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" style={authInputStyle} />
        </label>
        {error && <div style={authErrorStyle}>{error}</div>}
        <button type="submit" disabled={loading} style={authButtonStyle(loading)}>
          {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
        </button>
      </form>
    </AuthCard>
  );
}
