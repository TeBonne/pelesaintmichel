import { createClient } from "@/lib/supabase/server";
import { getSimplePage } from "@/lib/queries";
import { updateContact } from "../actions";
import SingletonForm from "@/components/admin/SingletonForm";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

const FIELDS = [
  { key: "hero_kicker", label: "Surtitre" },
  { key: "hero_title", label: "Titre", required: true },
  { key: "hero_subtitle", label: "Sous-titre", type: "textarea", rows: 2 },
  { key: "hero_image_url", label: "Image de fond", type: "image", required: true },
  { key: "hero_image_alt", label: "Texte alternatif de l'image (SEO)", required: true },
  { key: "hero_pos", label: "Cadrage image", hint: "Ex. center 40%" },
  { key: "meta_title", label: "SEO — Titre de l'onglet", required: true },
  { key: "meta_description", label: "SEO — Description", type: "textarea", rows: 2, required: true },
  { key: "body", label: "Contenu de la page", type: "textarea", rows: 8, hint: "Paragraphes séparés par une ligne vide. L'e-mail de contact (Réglages) s'affiche automatiquement sous le texte." },
];

export default async function AdminContact() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;
  const { page } = await getSimplePage("contact");
  return (
    <AdminShell title="Page · Contact">
      <SingletonForm title="Contenu" action={updateContact} imageFolder="pages" initial={page || {}} fields={FIELDS} />
    </AdminShell>
  );
}
