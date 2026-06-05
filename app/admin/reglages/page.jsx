import { createClient } from "@/lib/supabase/server";
import { getChrome } from "@/lib/queries";
import { updateSettings } from "../actions";
import SingletonForm from "@/components/admin/SingletonForm";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

export default async function AdminReglages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { settings } = await getChrome();

  return (
    <AdminShell title="Réglages & pied de page">
      <SingletonForm
        title="Inscription & contact"
        description="Le lien d'inscription est utilisé par tous les boutons « S'inscrire » du site."
        action={updateSettings}
        initial={settings || {}}
        fields={[
          { key: "inscription_url", label: "Lien d'inscription (externe)", hint: "URL de l'app d'inscription." },
          { key: "contact_email", label: "E-mail de contact" },
        ]}
      />
      <SingletonForm
        title="Pied de page"
        action={updateSettings}
        initial={settings || {}}
        fields={[{ key: "footer_quote", label: "Citation du pied de page" }]}
      />
      <SingletonForm
        title="Réseaux sociaux & YouTube"
        action={updateSettings}
        initial={settings || {}}
        fields={[
          { key: "youtube_channel_url", label: "Lien chaîne YouTube" },
          { key: "instagram_url", label: "Instagram" },
          { key: "facebook_url", label: "Facebook" },
          { key: "youtube_url", label: "YouTube (icône)" },
          { key: "tiktok_url", label: "TikTok" },
        ]}
      />
    </AdminShell>
  );
}
