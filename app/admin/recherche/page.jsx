import { createClient } from "@/lib/supabase/server";
import { getRechercheContent } from "@/lib/queries";
import { updatePageRecherche } from "../actions";
import SingletonForm from "@/components/admin/SingletonForm";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

export default async function AdminRecherche() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page } = await getRechercheContent();
  const initial = page || {};

  return (
    <AdminShell title="Page · Recherche">
      <SingletonForm title="Bandeau" action={updatePageRecherche} imageFolder="recherche" initial={initial} fields={[
        { key: "hero_kicker", label: "Surtitre" },
        { key: "hero_title", label: "Titre", required: true },
        { key: "hero_subtitle", label: "Sous-titre", type: "textarea", rows: 2 },
        { key: "hero_image_url", label: "Image de fond", type: "image", required: true },
        { key: "hero_image_alt", label: "Texte alternatif de l'image (SEO)", required: true, hint: "Décrit l'image pour Google et les lecteurs d'écran." },
        { key: "hero_pos", label: "Cadrage image", hint: "Ex. center 40%" },
        { key: "meta_title", label: "SEO — Titre de l'onglet", required: true },
        { key: "meta_description", label: "SEO — Description", type: "textarea", rows: 2, required: true },
      ]} />
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)" }}>
        Les résultats de recherche sont générés automatiquement à partir des pages du site.
      </p>
    </AdminShell>
  );
}
