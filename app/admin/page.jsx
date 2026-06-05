import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

const PAGES = [
  { href: "/admin/accueil", label: "Accueil", desc: "Bandeau, chiffres, vidéos, FAQ…" },
  { href: "/admin/le-pelerinage", label: "Le pèlerinage", desc: "Présentation, partenaires, évêque…" },
  { href: "/admin/programme", label: "Programme", desc: "Jours, temps de la journée, infos" },
  { href: "/admin/prier", label: "Prier", desc: "Prière, chapelet, neuvaine, anges" },
  { href: "/admin/faq", label: "FAQ", desc: "Questions / réponses par catégorie" },
  { href: "/admin/ressources", label: "Ressources", desc: "Vidéos, photos, documents, newsletters" },
  { href: "/admin/boutique", label: "Boutique", desc: "Catalogue de produits" },
  { href: "/admin/nous-soutenir", label: "Nous soutenir", desc: "Dons, paliers, autres aides" },
  { href: "/admin/recherche", label: "Recherche", desc: "Bandeau de la page de recherche" },
  { href: "/admin/menu", label: "Menu (en-tête)", desc: "Navigation et sous-menus" },
  { href: "/admin/reglages", label: "Réglages & pied de page", desc: "Inscription, contact, réseaux" },
];

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isMember) return <AccessDenied email={user?.email} />;

  return (
    <AdminShell title="Tableau de bord">
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--stone-500)", margin: 0 }}>
        Bienvenue <b style={{ color: "var(--navy-700)" }}>{user?.email}</b>{" "}
        <span style={{ color: isAdmin ? "var(--gold-700)" : "var(--stone-500)" }}>({isAdmin ? "administrateur" : "éditeur"})</span>.
        Choisissez une rubrique dans le menu de gauche, ou un accès rapide ci-dessous.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
        {PAGES.map((p) => (
          <a key={p.href} href={p.href} style={{ display: "block", textDecoration: "none", background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-sm)", padding: "16px 18px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)" }}>{p.label}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--stone-500)", marginTop: 4, lineHeight: 1.4 }}>{p.desc}</div>
          </a>
        ))}
        {isAdmin && (
          <>
            <a href="/admin/utilisateurs" style={{ display: "block", textDecoration: "none", background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--navy-700)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-sm)", padding: "16px 18px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)" }}>Éditeurs & droits</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--stone-500)", marginTop: 4 }}>Gérer les accès</div>
            </a>
            <a href="/admin/journal" style={{ display: "block", textDecoration: "none", background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--navy-700)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-sm)", padding: "16px 18px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 18, color: "var(--navy-700)" }}>Journal d'activité</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--stone-500)", marginTop: 4 }}>Connexions & modifications</div>
            </a>
          </>
        )}
      </div>
    </AdminShell>
  );
}
