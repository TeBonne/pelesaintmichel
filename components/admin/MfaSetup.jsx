"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logLogin, logSecurityEvent } from "@/app/admin/actions";
import { authInputStyle, authLabelStyle, authTextStyle, authErrorStyle, authNoticeStyle, authButtonStyle } from "./AuthCard";

const DEFAULT_NAME = "Mon téléphone";

const smallButtonStyle = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--navy-700)", background: "var(--ivory)", border: "1px solid var(--line-strong)", borderRadius: "var(--r-sm)", padding: "7px 12px", cursor: "pointer" };

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

/**
 * Configuration de la double authentification (application à codes : TOTP).
 * - first : première configuration, obligatoire avant d'accéder au back-office.
 * - sinon : gestion des appareils (ajout d'un appareil de secours, retrait).
 */
export default function MfaSetup({ first = false }) {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState(DEFAULT_NAME);
  const [enrollment, setEnrollment] = useState(null); // { id, qr, secret }
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await createClient().auth.mfa.listFactors();
    setDevices(data?.totp || []);
  };

  useEffect(() => {
    load();
  }, []);

  const start = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    const supabase = createClient();
    // Nettoie une configuration commencée puis abandonnée (sinon le nom serait déjà pris).
    const { data: list } = await supabase.auth.mfa.listFactors();
    for (const f of list?.all || []) {
      if (f.factor_type === "totp" && f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "Pèlerinage de Saint Michel",
      friendlyName: name.trim() || DEFAULT_NAME,
    });
    setBusy(false);
    if (error) {
      setError(
        error.code === "mfa_factor_name_conflict"
          ? "Un appareil porte déjà ce nom. Donnez-lui un autre nom (par exemple « Tablette »)."
          : "La configuration n'a pas pu démarrer : " + error.message + ". Rechargez la page et réessayez."
      );
      return;
    }
    setEnrollment({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  };

  const confirm = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId: enrollment.id, code: code.trim() });
    if (error) {
      setError("Code incorrect ou expiré. Saisissez le code à 6 chiffres actuellement affiché dans l'application (il change toutes les 30 secondes).");
      setCode("");
      setBusy(false);
      return;
    }
    try {
      await logSecurityEvent(first ? "mfa_enabled" : "mfa_device_added");
      if (first) await logLogin();
    } catch {
      // journalisation best-effort
    }
    if (first) {
      window.location.assign("/admin");
      return;
    }
    setEnrollment(null);
    setCode("");
    setName("Appareil de secours");
    setNotice("Appareil ajouté. Il peut désormais servir à vous connecter.");
    setBusy(false);
    load();
  };

  const remove = async (device) => {
    setError("");
    setNotice("");
    if (devices.length <= 1) {
      setError("Impossible de retirer votre seul appareil : ajoutez-en d'abord un autre, puis retirez celui-ci.");
      return;
    }
    if (!window.confirm(`Retirer « ${device.friendly_name || "cet appareil"} » ? Il ne pourra plus servir à vous connecter.`)) return;
    const { error } = await createClient().auth.mfa.unenroll({ factorId: device.id });
    if (error) {
      setError("L'appareil n'a pas pu être retiré : " + error.message + ".");
      return;
    }
    try {
      await logSecurityEvent("mfa_device_removed");
    } catch {
      // journalisation best-effort
    }
    setNotice("Appareil retiré.");
    load();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {first && (
        <p style={authTextStyle}>
          Pour protéger le site, la connexion se fait en deux étapes : votre mot de passe, puis un code à 6 chiffres
          affiché par une application sur votre téléphone. Installez d'abord une application d'authentification
          (Google Authenticator, Microsoft Authenticator, Authy…).
        </p>
      )}

      {!first && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {devices.map((d) => (
            <li key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "var(--parchment)" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--navy-800)" }}>
                <b>{d.friendly_name || "Application d'authentification"}</b>
                <span style={{ color: "var(--stone-500)" }}> · ajouté le {formatDate(d.created_at)}</span>
              </span>
              <button type="button" onClick={() => remove(d)} style={smallButtonStyle}>Retirer</button>
            </li>
          ))}
        </ul>
      )}

      {notice && <div style={authNoticeStyle}>{notice}</div>}

      {!enrollment ? (
        <>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={authLabelStyle}>{first ? "Nom de l'appareil" : "Ajouter un appareil (recommandé : un appareil de secours)"}</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} style={authInputStyle} />
          </label>
          {error && <div style={authErrorStyle}>{error}</div>}
          <button type="button" onClick={start} disabled={busy} style={authButtonStyle(busy)}>
            {busy ? "Préparation…" : first ? "Configurer la double authentification" : "Ajouter cet appareil"}
          </button>
        </>
      ) : (
        <form onSubmit={confirm} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={authTextStyle}>
            <b>1.</b> Dans l'application d'authentification, choisissez « Ajouter un compte » puis scannez ce QR code.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enrollment.qr} alt="QR code à scanner avec l'application d'authentification" width={200} height={200} style={{ alignSelf: "center", background: "#fff", padding: 8, borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }} />
          <p style={{ ...authTextStyle, fontSize: 12.5 }}>
            Impossible de scanner ? Saisissez cette clé à la main dans l'application :{" "}
            <code style={{ wordBreak: "break-all", color: "var(--navy-800)" }}>{enrollment.secret}</code>
          </p>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={authLabelStyle}>2. Saisissez le code à 6 chiffres affiché par l'application</span>
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
          <button type="submit" disabled={busy} style={authButtonStyle(busy)}>
            {busy ? "Vérification…" : "Activer"}
          </button>
        </form>
      )}
    </div>
  );
}
