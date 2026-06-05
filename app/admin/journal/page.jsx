import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";
import ActivityLog from "@/components/admin/ActivityLog";

export const dynamic = "force-dynamic";

export default async function AdminJournal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return <AccessDenied email={user?.email} />;

  const { data: events } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminShell title="Journal d'activité">
      <ActivityLog events={events || []} />
    </AdminShell>
  );
}
