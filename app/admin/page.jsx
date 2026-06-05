import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";
import UserManager from "@/components/admin/UserManager";
import ActivityLog from "@/components/admin/ActivityLog";

export const dynamic = "force-dynamic";

const PAGES = [
  { href: "/admin/accueil", label: "Page d'accueil", desc: "Bandeau, chiffres, vidéos, FAQ, menu, réglages" },
  { href: "/admin/le-pelerinage", label: "Le pèlerinage", desc: "Présentation, partenaires, évêque, équipe, diaporama…" },
  { href: "/admin/programme", label: "Programme", desc: "Jours, temps de la journée, infos pratiques" },
  { href: "/admin/prier", label: "Prier", desc: "Prière, chapelet, neuvaine, anges" },
  { href: "/admin/faq", label: "FAQ", desc: "Questions / réponses par catégorie" },
  { href: "/admin/ressources", label: "Ressources", desc: "Vidéos, photos, documents, newsletters" },
  { href: "/admin/boutique", label: "Boutique", desc: "Catalogue de produits" },
  { href: "/admin/nous-soutenir", label: "Nous soutenir", desc: "Dons, paliers, autres aides" },
  { href: "/admin/recherche", label: "Recherche", desc: "Bandeau de la page de recherche" },
];

export default async function AdminHub() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isMember) return <AccessDenied email={user?.email} />;

  let users = [];
  let events = [];
  if (isAdmin) {
    const [{ data: u }, { data: ev }] = await Promise.all([
      supabase.from("app_users").select("email, role, created_at").order("role", { ascending: true }).order("email", { ascending: true }),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    users = u || [];
    events = ev || [];
  }

  return (
    <AdminShell title="Administration · Tableau de bord" showBack={false}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--stone-500)", margin: 0 }}>
        Connecté en tant que <b style={{ color: "var(--navy-700)" }}>{user?.email}</b>{" "}
        <span style={{ color: isAdmin ? "var(--gold-700)" : "var(--stone-500)" }}>({isAdmin ? "administrateur" : "éditeur"})</span>. Choisissez une page à modifier.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {PAGES.map((p) => (
          <a
            key={p.href}
            href={p.href}
            style={{ display: "block", textDecoration: "none", background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-sm)", padding: "18px 20px" }}
          >
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 19, color: "var(--navy-700)" }}>{p.label}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--stone-500)", marginTop: 4, lineHeight: 1.4 }}>{p.desc}</div>
          </a>
        ))}
      </div>

      {isAdmin && (
        <>
          <div style={{ borderTop: "2px solid var(--gold-400)", paddingTop: 8, marginTop: 8 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-700)" }}>
              Réservé à l'administrateur
            </span>
          </div>
          <UserManager initial={users} currentEmail={user?.email} />
          <ActivityLog events={events} />
        </>
      )}
    </AdminShell>
  );
}
