import { createClient } from "@/lib/supabase/server";
import { getBoutiqueContent } from "@/lib/queries";
import { updatePageBoutique, replaceShopProducts } from "../actions";
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

export default async function AdminBoutique() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const { page, products } = await getBoutiqueContent();
  const initial = page || {};

  return (
    <AdminShell title="Page · Boutique">
      <SingletonForm title="Bandeau" action={updatePageBoutique} imageFolder="boutique" initial={initial} fields={HERO} />
      <SingletonForm title="Précommande & mentions" action={updatePageBoutique} initial={initial} fields={[
        { key: "precommande_title", label: "Encadré — Titre" },
        { key: "precommande_body", label: "Encadré — Texte (dates, livraison…)", type: "textarea", rows: 3 },
        { key: "disclaimer", label: "Mention sous les produits (prix, TVA…)", type: "textarea", rows: 2 },
      ]} />
      <RepeaterForm
        title="Produits"
        description="Le catalogue. Glisser l'ordre avec les flèches."
        action={replaceShopProducts}
        imageFolder="boutique"
        initial={products}
        emptyItem={{ name: "", price: "", description: "", image_url: "" }}
        addLabel="Ajouter un produit"
        fields={[
          { key: "name", label: "Nom du produit", required: true, hint: "Sert aussi de texte alternatif (SEO) à la photo." },
          { key: "price", label: "Prix", placeholder: "19 €", required: true },
          { key: "description", label: "Description", type: "textarea", rows: 3 },
          { key: "image_url", label: "Photo", type: "image", required: true },
        ]}
      />
      <SingletonForm title="Bande d'appel à l'action" action={updatePageBoutique} initial={initial} fields={[
        { key: "cta_title", label: "Titre" },
        { key: "cta_sub", label: "Sous-titre" },
        { key: "cta_label", label: "Bouton — texte" },
        { key: "cta_href", label: "Bouton — lien", hint: "Vide = lien d'inscription par défaut" },
      ]} />
    </AdminShell>
  );
}
