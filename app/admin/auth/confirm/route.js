import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Arrivée du lien « mot de passe oublié » reçu par e-mail : échange le code
 * contre une session, puis envoie vers le choix du nouveau mot de passe.
 * (Destination fixe : pas de paramètre de redirection libre.)
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const supabase = await createClient();

  let error = new Error("Lien incomplet");
  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash) {
    ({ error } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash }));
  }

  if (error) return NextResponse.redirect(`${origin}/admin/mot-de-passe-oublie?erreur=lien`);
  return NextResponse.redirect(`${origin}/admin/nouveau-mot-de-passe`);
}
