import { createClient } from "@/lib/supabase/server";
import { getMfaState } from "@/lib/supabase/mfa";
import AdminShell from "@/components/admin/AdminShell";
import AuthCard from "@/components/admin/AuthCard";
import MfaSetup from "@/components/admin/MfaSetup";
import SignOutLink from "@/components/admin/SignOutLink";

export const dynamic = "force-dynamic";

const cardStyle = {
  background: "var(--ivory)",
  border: "1px solid var(--line)",
  borderTop: "3px solid var(--navy-700)",
  borderRadius: "var(--r-md)",
  boxShadow: "var(--shadow-sm)",
  padding: "24px 26px 26px",
};
const h2Style = { fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 24, color: "var(--navy-700)", margin: "0 0 4px" };
const introStyle = { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)", margin: "0 0 18px" };

export default async function SecuritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { hasFactor, aal2 } = await getMfaState(supabase, user);

  // Première configuration : obligatoire avant tout accès au back-office.
  if (!(hasFactor && aal2)) {
    return (
      <AuthCard title="Sécurisez votre compte" subtitle="Double authentification obligatoire" footer={<SignOutLink />}>
        <MfaSetup first />
      </AuthCard>
    );
  }

  return (
    <AdminShell title="Sécurité du compte">
      <section style={cardStyle}>
        <h2 style={h2Style}>Double authentification</h2>
        <p style={introStyle}>
          Appareils autorisés à générer votre code de connexion. Gardez-en au moins deux : si vous perdez l'un, l'autre vous évite d'être bloqué.
        </p>
        <MfaSetup />
      </section>

      <section style={cardStyle}>
        <h2 style={h2Style}>Mot de passe</h2>
        <p style={introStyle}>Compte : {user?.email}</p>
        <a href="/admin/nouveau-mot-de-passe" style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--navy-600)" }}>
          Changer mon mot de passe →
        </a>
      </section>
    </AdminShell>
  );
}
