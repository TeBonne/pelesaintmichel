import { createClient } from "@/lib/supabase/server";
import { getFaqPageContent } from "@/lib/queries";
import { updatePageFaq, replaceFaqItems } from "../actions";
import SingletonForm from "@/components/admin/SingletonForm";
import RepeaterForm from "@/components/admin/RepeaterForm";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

const HERO = [
  { key: "hero_kicker", label: "Surtitre" },
  { key: "hero_title", label: "Titre", required: true },
  { key: "hero_subtitle", label: "Sous-titre", type: "textarea", rows: 2 },
  { key: "hero_image_url", label: "Image de fond", type: "image", required: true },
  { key: "hero_image_alt", label: "Texte alternatif de l'image (SEO)", required: true, hint: "Décrit l'image pour Google et les lecteurs d'écran." },
  { key: "hero_pos", label: "Cadrage image", hint: "Ex. center 40%" },
  { key: "meta_title", label: "SEO — Titre de l'onglet", required: true },
  { key: "meta_description", label: "SEO — Description", type: "textarea", rows: 2, required: true },
];

export default async function AdminFaq() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page, items } = await getFaqPageContent();
  const initial = page || {};

  return (
    <AdminShell title="Page · FAQ">
      <SingletonForm title="Bandeau" action={updatePageFaq} imageFolder="faq" initial={initial} fields={HERO} />
      <SingletonForm title="Bas de page & appel à l'action" action={updatePageFaq} initial={initial} fields={[
        { key: "contact_text", label: "Texte de contact (sous les questions)", type: "textarea", rows: 2 },
        { key: "cta_title", label: "CTA — Titre" },
        { key: "cta_sub", label: "CTA — Sous-titre" },
        { key: "cta_label", label: "CTA — Bouton texte" },
        { key: "cta_href", label: "CTA — Bouton lien", hint: "Vide = lien d'inscription par défaut" },
      ]} />
      <RepeaterForm
        title="Questions / réponses"
        description="Les questions sont regroupées par catégorie (dans l'ordre d'apparition). Saisissez le même nom de catégorie pour regrouper plusieurs questions."
        action={replaceFaqItems}
        initial={items}
        emptyItem={{ category: "", question: "", answer: "" }}
        addLabel="Ajouter une question"
        fields={[
          { key: "category", label: "Catégorie", required: true, hint: "Ex. Organisation du pèlerinage, Les pèlerins, Spiritualité…" },
          { key: "question", label: "Question", required: true },
          { key: "answer", label: "Réponse", type: "textarea", rows: 3, required: true },
        ]}
      />
    </AdminShell>
  );
}
