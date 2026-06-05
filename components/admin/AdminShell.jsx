import { createClient } from "@/lib/supabase/server";
import { SaveBarProvider, StickySaveBar } from "./SaveBarContext";
import AdminChrome from "./AdminChrome";

/** Cadre du back-office : barre latérale (CMS) + barre supérieure + barre d'enregistrement. */
export default async function AdminShell({ title, children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: isAdmin } = await supabase.rpc("is_admin");

  return (
    <SaveBarProvider>
      <AdminChrome title={title} email={user?.email} isAdmin={isAdmin === true}>
        {children}
      </AdminChrome>
      <StickySaveBar />
    </SaveBarProvider>
  );
}
