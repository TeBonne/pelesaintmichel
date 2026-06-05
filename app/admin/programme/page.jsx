import { createClient } from "@/lib/supabase/server";
import { getProgrammeContent } from "@/lib/queries";
import { updatePageProgramme, replaceProgDays, replaceProgDaily, replaceProgFacts } from "../actions";
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
  { key: "hero_pos", label: "Cadrage image", hint: "Ex. center 55%" },
  { key: "meta_title", label: "SEO — Titre de l'onglet", required: true },
  { key: "meta_description", label: "SEO — Description", type: "textarea", rows: 2, required: true },
];

export default async function AdminProgramme() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page, days, daily, facts } = await getProgrammeContent();
  const initial = page || {};

  return (
    <AdminShell title="Page · Programme">
      <SingletonForm title="Bandeau" action={updatePageProgramme} imageFolder="programme" initial={initial} fields={HERO} />
      <SingletonForm title="Introduction" action={updatePageProgramme} initial={initial} fields={[
        { key: "intro_overline", label: "Surtitre" },
        { key: "intro_title", label: "Titre" },
        { key: "intro_body", label: "Texte", type: "textarea", rows: 4 },
      ]} />
      <SingletonForm title="Jour par jour (titre)" action={updatePageProgramme} initial={initial} fields={[
        { key: "days_overline", label: "Surtitre" },
        { key: "days_title", label: "Titre" },
      ]} />
      <RepeaterForm title="Jours" action={replaceProgDays} imageFolder="programme" initial={days} emptyItem={{ number: "", date_label: "", title: "", body: "", image_url: "" }} addLabel="Ajouter un jour" fields={[
        { key: "number", label: "Numéro", placeholder: "1" },
        { key: "date_label", label: "Date", placeholder: "Vendredi 8 mai" },
        { key: "title", label: "Titre", required: true },
        { key: "body", label: "Description", type: "textarea", rows: 3 },
        { key: "image_url", label: "Photo", type: "image", required: true },
        { key: "image_alt", label: "Texte alternatif de la photo (SEO)", required: true },
      ]} />
      <SingletonForm title="Les temps du jour (titre)" action={updatePageProgramme} initial={initial} fields={[
        { key: "daily_overline", label: "Surtitre" },
        { key: "daily_title", label: "Titre" },
      ]} />
      <RepeaterForm title="Les temps du jour (cartes)" action={replaceProgDaily} initial={daily} emptyItem={{ title: "", text: "" }} addLabel="Ajouter un temps" fields={[
        { key: "title", label: "Titre" },
        { key: "text", label: "Texte", type: "textarea", rows: 2 },
      ]} />
      <SingletonForm title="Infos pratiques (titre)" action={updatePageProgramme} initial={initial} fields={[
        { key: "facts_overline", label: "Surtitre" },
        { key: "facts_title", label: "Titre" },
      ]} />
      <RepeaterForm title="Infos pratiques (chiffres)" action={replaceProgFacts} initial={facts} emptyItem={{ key_text: "", value_text: "" }} addLabel="Ajouter une info" fields={[
        { key: "key_text", label: "Chiffre / valeur", placeholder: "~25" },
        { key: "value_text", label: "Libellé", placeholder: "km par jour" },
      ]} />
      <SingletonForm title="Bande d'appel à l'action" action={updatePageProgramme} initial={initial} fields={[
        { key: "cta_title", label: "Titre" },
        { key: "cta_sub", label: "Sous-titre" },
        { key: "cta_label", label: "Bouton — texte" },
        { key: "cta_href", label: "Bouton — lien", hint: "Vide = lien d'inscription par défaut" },
      ]} />
    </AdminShell>
  );
}
