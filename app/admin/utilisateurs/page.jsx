import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";
import UserManager from "@/components/admin/UserManager";

export const dynamic = "force-dynamic";

export default async function AdminUtilisateurs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return <AccessDenied email={user?.email} />;

  const { data: users } = await supabase
    .from("app_users")
    .select("email, role, created_at")
    .order("role", { ascending: true })
    .order("email", { ascending: true });

  return (
    <AdminShell title="Éditeurs & droits">
      <UserManager initial={users || []} currentEmail={user?.email} />
    </AdminShell>
  );
}
