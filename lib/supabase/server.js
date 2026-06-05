import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase côté serveur (Server Components & Server Actions).
 * Lit/écrit la session via les cookies — les écritures s'exécutent
 * donc en tant qu'admin connecté ; les lectures publiques utilisent
 * la clé publishable (anon) bornée par les politiques RLS.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component : ignoré (le middleware
            // rafraîchit la session). Sans effet sur les lectures.
          }
        },
      },
    }
  );
}
