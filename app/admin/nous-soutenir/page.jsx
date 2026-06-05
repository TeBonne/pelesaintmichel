import { createClient } from "@/lib/supabase/server";
import { getSoutenirContent } from "@/lib/queries";
import { updatePageSoutenir, replaceSoutenirTiers, replaceSoutenirHelp } from "../actions";
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

export default async function AdminSoutenir() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page, tiers, help } = await getSoutenirContent();
  const initial = page || {};

  return (
    <AdminShell title="Page · Nous soutenir">
      <SingletonForm title="Bandeau" action={updatePageSoutenir} imageFolder="soutenir" initial={initial} fields={HERO} />
      <SingletonForm title="Pourquoi donner" action={updatePageSoutenir} initial={initial} fields={[
        { key: "why_overline", label: "Surtitre" },
        { key: "why_title", label: "Titre" },
        { key: "why_body", label: "Texte", type: "textarea", rows: 4 },
      ]} />
      <SingletonForm title="Faire un don" action={updatePageSoutenir} initial={initial} fields={[
        { key: "dons_overline", label: "Surtitre" },
        { key: "dons_title", label: "Titre" },
        { key: "dons_info", label: "Texte d'introduction", type: "textarea", rows: 2 },
        { key: "dons_button_label", label: "Bouton des paliers — texte" },
        { key: "dons_button_href", label: "Bouton des paliers — lien" },
      ]} />
      <RepeaterForm title="Paliers de don" action={replaceSoutenirTiers} initial={tiers} emptyItem={{ amount: "", real_cost: "" }} addLabel="Ajouter un palier" fields={[
        { key: "amount", label: "Montant", placeholder: "50 €", required: true },
        { key: "real_cost", label: "Coût réel après réduction", placeholder: "17 €", required: true },
      ]} />
      <SingletonForm title="Autres manières d'aider (titre)" action={updatePageSoutenir} initial={initial} fields={[
        { key: "help_overline", label: "Surtitre" },
        { key: "help_title", label: "Titre" },
      ]} />
      <RepeaterForm title="Autres manières d'aider (cartes)" action={replaceSoutenirHelp} initial={help} emptyItem={{ icon: "✦", title: "", body: "" }} addLabel="Ajouter une carte" fields={[
        { key: "icon", label: "Icône", placeholder: "✦" },
        { key: "title", label: "Titre", required: true },
        { key: "body", label: "Texte", type: "textarea", rows: 3, required: true },
      ]} />
      <SingletonForm title="Bande d'appel à l'action" action={updatePageSoutenir} initial={initial} fields={[
        { key: "cta_title", label: "Titre" },
        { key: "cta_sub", label: "Sous-titre" },
        { key: "cta_label", label: "Bouton — texte" },
        { key: "cta_href", label: "Bouton — lien" },
      ]} />
    </AdminShell>
  );
}
