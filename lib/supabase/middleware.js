import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getMfaState } from "@/lib/supabase/mfa";

// Pages accessibles sans être connecté.
const PUBLIC_PATHS = ["/admin/login", "/admin/mot-de-passe-oublie", "/admin/auth/confirm"];

/**
 * Rafraîchit la session sur les routes /admin et protège l'accès :
 * - non connecté sur /admin/** (sauf pages publiques) → page de connexion
 * - connecté sans double authentification configurée → /admin/securite (configuration obligatoire)
 * - connecté avec 2FA configurée mais code non saisi → /admin/mfa
 * - entièrement authentifié sur une page de connexion → tableau de bord
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Redirection qui conserve les cookies de session éventuellement rafraîchis.
  const redirectTo = (pathname, next) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    if (next) url.searchParams.set("next", next);
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (!user) {
    return PUBLIC_PATHS.includes(path) ? supabaseResponse : redirectTo("/admin/login");
  }

  // Lien reçu par e-mail (mot de passe oublié) : toujours traité, même déjà connecté.
  if (path === "/admin/auth/confirm") return supabaseResponse;

  const { hasFactor, aal2 } = await getMfaState(supabase, user);

  if (hasFactor && aal2) {
    const authPages = [...PUBLIC_PATHS, "/admin/mfa"];
    return authPages.includes(path) ? redirectTo("/admin") : supabaseResponse;
  }

  if (hasFactor) {
    // 2FA configurée mais code pas encore saisi pour cette session.
    if (path === "/admin/mfa") return supabaseResponse;
    return redirectTo("/admin/mfa", path === "/admin/nouveau-mot-de-passe" ? path : null);
  }

  // Aucune 2FA configurée : on ne laisse passer que la configuration
  // (et le choix d'un nouveau mot de passe après un lien de récupération).
  if (path === "/admin/securite" || path === "/admin/nouveau-mot-de-passe") return supabaseResponse;
  return redirectTo("/admin/securite");
}
