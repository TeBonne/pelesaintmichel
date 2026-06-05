import { createClient } from "@/lib/supabase/server";
import { getRessourcesContent } from "@/lib/queries";
import { updatePageRessources, replaceResVideos, replaceResPhotos, replaceResDocuments, replaceResNewsletters } from "../actions";
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

export default async function AdminRessources() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page, videos, photos, documents, newsletters } = await getRessourcesContent();
  const initial = page || {};
  const up = updatePageRessources;

  return (
    <AdminShell title="Page · Ressources">
      <SingletonForm title="Bandeau" action={up} imageFolder="ressources" initial={initial} fields={HERO} />

      <SingletonForm title="Vidéos (titre)" action={up} initial={initial} fields={[
        { key: "videos_overline", label: "Surtitre" },
        { key: "videos_title", label: "Titre" },
        { key: "channel_url", label: "Lien de la chaîne YouTube" },
      ]} />
      <RepeaterForm title="Vidéos" action={replaceResVideos} initial={videos} emptyItem={{ youtube_id: "", title: "", subtitle: "" }} addLabel="Ajouter une vidéo" fields={[
        { key: "youtube_id", label: "ID vidéo YouTube", required: true },
        { key: "title", label: "Titre", required: true },
        { key: "subtitle", label: "Sous-titre" },
      ]} />

      <SingletonForm title="Photos (titre)" action={up} initial={initial} fields={[
        { key: "photos_overline", label: "Surtitre" },
        { key: "photos_title", label: "Titre" },
        { key: "photos_desc", label: "Texte d'introduction", type: "textarea", rows: 2 },
      ]} />
      <RepeaterForm title="Photos" action={replaceResPhotos} imageFolder="ressources" initial={photos} emptyItem={{ image_url: "", caption: "" }} addLabel="Ajouter une photo" fields={[
        { key: "image_url", label: "Photo", type: "image", required: true },
        { key: "caption", label: "Légende / texte alternatif (SEO)", required: true },
      ]} />

      <SingletonForm title="Documents (titre)" action={up} initial={initial} fields={[
        { key: "documents_overline", label: "Surtitre" },
        { key: "documents_title", label: "Titre" },
      ]} />
      <RepeaterForm title="Documents PDF" action={replaceResDocuments} initial={documents} emptyItem={{ title: "", description: "", tag: "", url: "" }} addLabel="Ajouter un document" fields={[
        { key: "title", label: "Titre", required: true },
        { key: "description", label: "Description", type: "textarea", rows: 2 },
        { key: "tag", label: "Étiquette", placeholder: "PDF · A3" },
        { key: "url", label: "Lien de téléchargement", required: true },
      ]} />

      <SingletonForm title="Newsletters (titre)" action={up} initial={initial} fields={[
        { key: "newsletters_overline", label: "Surtitre" },
        { key: "newsletters_title", label: "Titre" },
        { key: "newsletters_footer", label: "Note de bas de section", type: "textarea", rows: 2 },
      ]} />
      <RepeaterForm title="Newsletters" action={replaceResNewsletters} initial={newsletters} emptyItem={{ title: "", date_label: "", description: "", url: "" }} addLabel="Ajouter une newsletter" fields={[
        { key: "title", label: "Titre", required: true },
        { key: "date_label", label: "Date", placeholder: "Mai 2026", required: true },
        { key: "description", label: "Description", type: "textarea", rows: 2 },
        { key: "url", label: "Lien", required: true },
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
