import { createClient } from "@/lib/supabase/server";
import { getPrierContent } from "@/lib/queries";
import { updatePagePrier } from "../actions";
import SingletonForm from "@/components/admin/SingletonForm";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

const HERO = [
  { key: "hero_kicker", label: "Surtitre" },
  { key: "hero_title", label: "Titre", required: true },
  { key: "hero_subtitle", label: "Sous-titre", type: "textarea", rows: 2 },
  { key: "hero_image_url", label: "Image de fond", type: "image", required: true },
  { key: "hero_image_alt", label: "Texte alternatif de l'image (SEO)", required: true, hint: "Décrit l'image pour Google et les lecteurs d'écran." },
  { key: "hero_pos", label: "Cadrage image", hint: "Ex. center 45%" },
  { key: "meta_title", label: "SEO — Titre de l'onglet", required: true },
  { key: "meta_description", label: "SEO — Description", type: "textarea", rows: 2, required: true },
];

export default async function AdminPrier() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page } = await getPrierContent();
  const initial = page || {};

  return (
    <AdminShell title="Page · Prier">
      <SingletonForm title="Bandeau" action={updatePagePrier} imageFolder="prier" initial={initial} fields={HERO} />
      <SingletonForm title="Prière à saint Michel" action={updatePagePrier} initial={initial} fields={[
        { key: "priere_overline", label: "Surtitre" },
        { key: "priere_title", label: "Titre" },
        { key: "priere_text", label: "Texte d'introduction", type: "textarea", rows: 3 },
        { key: "priere_prayer", label: "Texte de la prière", type: "textarea", rows: 5 },
      ]} />
      <SingletonForm title="Le chapelet" action={updatePagePrier} initial={initial} fields={[
        { key: "chapelet_overline", label: "Surtitre" },
        { key: "chapelet_title", label: "Titre" },
        { key: "chapelet_body", label: "Texte (paragraphes séparés par une ligne vide)", type: "textarea", rows: 5 },
        { key: "chapelet_howto_title", label: "Encadré — Titre" },
        { key: "chapelet_howto_text", label: "Encadré — Texte", type: "textarea", rows: 4 },
      ]} />
      <SingletonForm title="La neuvaine" action={updatePagePrier} initial={initial} fields={[
        { key: "neuvaine_overline", label: "Surtitre" },
        { key: "neuvaine_title", label: "Titre" },
        { key: "neuvaine_body", label: "Texte", type: "textarea", rows: 4 },
      ]} />
      <SingletonForm title="Les anges" action={updatePagePrier} initial={initial} fields={[
        { key: "anges_overline", label: "Surtitre" },
        { key: "anges_title", label: "Titre" },
        { key: "anges_body", label: "Texte (paragraphes séparés par une ligne vide)", type: "textarea", rows: 5 },
      ]} />
      <SingletonForm title="Bande d'appel à l'action" action={updatePagePrier} initial={initial} fields={[
        { key: "cta_title", label: "Titre" },
        { key: "cta_sub", label: "Sous-titre" },
        { key: "cta_label", label: "Bouton — texte" },
        { key: "cta_href", label: "Bouton — lien", hint: "Vide = lien d'inscription par défaut" },
      ]} />
    </AdminShell>
  );
}
