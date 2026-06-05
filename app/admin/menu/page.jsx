import { createClient } from "@/lib/supabase/server";
import { getChrome } from "@/lib/queries";
import { replaceNav } from "../actions";
import NavEditor from "@/components/admin/NavEditor";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

export default async function AdminMenu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { nav } = await getChrome();

  return (
    <AdminShell title="Menu de l'en-tête">
      <NavEditor
        title="Entrées du menu"
        description="La navigation en haut du site. Chaque entrée peut avoir un sous-menu. Lien : une URL (ex. /boutique) ou une ancre (ex. #sec-prog)."
        action={replaceNav}
        initial={nav}
      />
    </AdminShell>
  );
}
