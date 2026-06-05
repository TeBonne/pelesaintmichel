import { createClient } from "@/lib/supabase/server";
import { getPelerinageContent } from "@/lib/queries";
import { updatePagePelerinage, replacePeleCards, replacePelePartners, replacePeleGallery } from "../actions";
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
  { key: "hero_pos", label: "Cadrage image", hint: "Ex. center 35%" },
  { key: "meta_title", label: "SEO — Titre de l'onglet", required: true },
  { key: "meta_description", label: "SEO — Description", type: "textarea", rows: 2, required: true },
];

export default async function AdminPelerinage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page, cards, partners, gallery } = await getPelerinageContent();
  const initial = page || {};
  const up = updatePagePelerinage;

  return (
    <AdminShell title="Page · Le pèlerinage">
      <SingletonForm title="Bandeau" action={up} imageFolder="pelerinage" initial={initial} fields={HERO} />

      <SingletonForm title="Présentation" action={up} initial={initial} fields={[
        { key: "presentation_overline", label: "Surtitre" },
        { key: "presentation_title", label: "Titre" },
        { key: "presentation_body", label: "Texte (paragraphes séparés par une ligne vide)", type: "textarea", rows: 6 },
      ]} />
      <RepeaterForm title="Présentation — cartes" action={replacePeleCards} initial={cards} emptyItem={{ title: "", text: "" }} addLabel="Ajouter une carte" fields={[
        { key: "title", label: "Titre", required: true },
        { key: "text", label: "Texte", type: "textarea", rows: 2, required: true },
      ]} />

      <SingletonForm title="Partenaires (titre)" action={up} initial={initial} fields={[
        { key: "partners_overline", label: "Surtitre" },
        { key: "partners_title", label: "Titre" },
        { key: "partners_footer", label: "Note de bas de section" },
      ]} />
      <RepeaterForm title="Partenaires" action={replacePelePartners} imageFolder="pelerinage" initial={partners} emptyItem={{ nom: "", tag: "", logo_url: "", description: "" }} addLabel="Ajouter un partenaire" fields={[
        { key: "nom", label: "Nom", required: true },
        { key: "tag", label: "Sous-titre / catégorie" },
        { key: "logo_url", label: "Logo", type: "image", required: true },
        { key: "description", label: "Description", type: "textarea", rows: 3 },
      ]} />

      <SingletonForm title="Message de l'évêque" action={up} imageFolder="pelerinage" initial={initial} fields={[
        { key: "eveque_overline", label: "Surtitre" },
        { key: "eveque_title", label: "Titre" },
        { key: "eveque_image_url", label: "Photo", type: "image", required: true },
        { key: "eveque_image_alt", label: "Texte alternatif de la photo (SEO)", required: true },
        { key: "eveque_quote", label: "Citation (paragraphes séparés par une ligne vide)", type: "textarea", rows: 7 },
        { key: "eveque_name", label: "Nom" },
        { key: "eveque_role", label: "Fonction" },
      ]} />

      <SingletonForm title="L'équipe" action={up} imageFolder="pelerinage" initial={initial} fields={[
        { key: "equipe_overline", label: "Surtitre" },
        { key: "equipe_title", label: "Titre" },
        { key: "equipe_body", label: "Texte", type: "textarea", rows: 5 },
        { key: "equipe_image_url", label: "Photo", type: "image", required: true },
        { key: "equipe_image_alt", label: "Texte alternatif de la photo (SEO)", required: true },
      ]} />

      <SingletonForm title="Diaporama (titre)" action={up} initial={initial} fields={[
        { key: "diaporama_overline", label: "Surtitre" },
        { key: "diaporama_title", label: "Titre" },
        { key: "diaporama_desc", label: "Texte d'introduction", type: "textarea", rows: 2 },
      ]} />
      <RepeaterForm title="Diaporama — photos" action={replacePeleGallery} imageFolder="pelerinage" initial={gallery} emptyItem={{ image_url: "", caption: "" }} addLabel="Ajouter une photo" fields={[
        { key: "image_url", label: "Photo", type: "image", required: true },
        { key: "caption", label: "Légende / texte alternatif (SEO)", required: true },
      ]} />

      <SingletonForm title="Pour qui ?" action={up} imageFolder="pelerinage" initial={initial} fields={[
        { key: "pourqui_overline", label: "Surtitre" },
        { key: "pourqui_title", label: "Titre" },
        { key: "pourqui_body", label: "Texte", type: "textarea", rows: 5 },
        { key: "pourqui_image_url", label: "Photo", type: "image", required: true },
        { key: "pourqui_image_alt", label: "Texte alternatif de la photo (SEO)", required: true },
      ]} />

      <SingletonForm title="Les chapitres" action={up} initial={initial} fields={[
        { key: "chapitres_overline", label: "Surtitre" },
        { key: "chapitres_title", label: "Titre" },
        { key: "chapitres_body", label: "Texte", type: "textarea", rows: 5 },
      ]} />

      <SingletonForm title="Histoire & miquelots" action={up} initial={initial} fields={[
        { key: "histoire_overline", label: "Surtitre" },
        { key: "histoire_title", label: "Titre" },
        { key: "histoire_body", label: "Texte", type: "textarea", rows: 5 },
      ]} />

      <SingletonForm title="Bande d'appel à l'action" action={up} initial={initial} fields={[
        { key: "cta_title", label: "Titre" },
        { key: "cta_sub", label: "Sous-titre" },
        { key: "cta_label", label: "Bouton — texte" },
        { key: "cta_href", label: "Bouton — lien", hint: "Vide = lien d'inscription par défaut" },
      ]} />
    </AdminShell>
  );
}
