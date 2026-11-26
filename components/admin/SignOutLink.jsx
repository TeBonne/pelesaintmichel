"use client";
import { createClient } from "@/lib/supabase/client";
import { authLinkStyle } from "./AuthCard";

/** Déconnexion depuis les écrans d'authentification (hors cadre du back-office). */
export default function SignOutLink() {
  const signOut = async () => {
    await createClient().auth.signOut();
    window.location.assign("/admin/login");
  };
  return (
    <button type="button" onClick={signOut} style={authLinkStyle}>
      Se déconnecter
    </button>
  );
}
