import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/queries";
import { updateHero, updateCitation, replaceStats, replaceProgramme, replaceVideos, replaceFaq, replaceTestimonials } from "../actions";
import SingletonForm from "@/components/admin/SingletonForm";
import RepeaterForm from "@/components/admin/RepeaterForm";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

export default async function AdminAccueil() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isMember } = await supabase.rpc("is_member");
  if (!isMember) return <AccessDenied email={user?.email} />;

  const content = await getHomeContent();

  return (
    <AdminShell title="Page d'accueil">
      <SingletonForm
        title="Bandeau d'accueil (Hero)"
        description="Le grand bloc en haut de page avec la vidéo de fond."
        action={updateHero}
        imageFolder="hero"
        initial={content.hero || {}}
        fields={[
          { key: "overline", label: "Surtitre" },
          { key: "title", label: "Titre principal (H1)", type: "textarea", rows: 2, required: true },
          { key: "subtitle", label: "Sous-titre", type: "textarea", rows: 3 },
          { key: "primary_label", label: "Bouton principal — texte" },
          { key: "primary_href", label: "Bouton principal — lien", hint: "Ex. l'URL d'inscription, ou #sec-prog" },
          { key: "ghost_label", label: "Bouton secondaire — texte" },
          { key: "ghost_href", label: "Bouton secondaire — lien" },
          { key: "bg_image_url", label: "Image de fond (repli)", type: "image", required: true },
          { key: "bg_image_alt", label: "Texte alternatif de l'image (SEO)", required: true, hint: "Décrit l'image pour Google et les lecteurs d'écran." },
          { key: "youtube_id", label: "ID vidéo YouTube de fond", hint: "Ex. qulE58yUOsI (vide = aucune vidéo)" },
        ]}
      />

      <RepeaterForm
        title="Chiffres clés"
        action={replaceStats}
        initial={content.stats}
        emptyItem={{ value: "", title: "", subtitle: "" }}
        addLabel="Ajouter un chiffre"
        fields={[
          { key: "value", label: "Chiffre", placeholder: "~20", required: true },
          { key: "title", label: "Libellé", placeholder: "km par jour", required: true },
          { key: "subtitle", label: "Précision" },
        ]}
      />

      <RepeaterForm
        title="Programme (aperçu accueil)"
        action={replaceProgramme}
        imageFolder="programme"
        initial={content.programme}
        emptyItem={{ date_label: "", title: "", body: "", photo_caption: "", image_url: "", image_pos: "center" }}
        addLabel="Ajouter un jour"
        fields={[
          { key: "date_label", label: "Date" },
          { key: "title", label: "Titre", required: true },
          { key: "body", label: "Description", type: "textarea", rows: 3 },
          { key: "photo_caption", label: "Légende / texte alternatif (SEO)", required: true },
          { key: "image_url", label: "Photo", type: "image", required: true },
          { key: "image_pos", label: "Cadrage", hint: "Ex. center 40%" },
        ]}
      />

      <SingletonForm
        title="Citation"
        action={updateCitation}
        imageFolder="citation"
        initial={content.citation || {}}
        fields={[
          { key: "quote", label: "Citation", type: "textarea", rows: 2, required: true },
          { key: "attribution", label: "Attribution" },
          { key: "bg_image_url", label: "Image de fond", type: "image", required: true },
          { key: "bg_image_alt", label: "Texte alternatif de l'image (SEO)", required: true },
        ]}
      />

      <RepeaterForm
        title="Vidéos"
        action={replaceVideos}
        initial={content.videos}
        emptyItem={{ youtube_id: "", title: "", subtitle: "", published_at: "" }}
        addLabel="Ajouter une vidéo"
        fields={[
          { key: "youtube_id", label: "ID vidéo YouTube", required: true },
          { key: "title", label: "Titre", required: true },
          { key: "subtitle", label: "Sous-titre" },
          { key: "published_at", label: "Date de publication (SEO vidéo)", type: "date", hint: "Recommandée pour les résultats vidéo Google." },
        ]}
      />

      <RepeaterForm
        title="FAQ (aperçu accueil)"
        action={replaceFaq}
        initial={content.faq}
        emptyItem={{ question: "", answer: "" }}
        addLabel="Ajouter une question"
        fields={[
          { key: "question", label: "Question", required: true },
          { key: "answer", label: "Réponse", type: "textarea", rows: 3, required: true },
        ]}
      />

      <RepeaterForm
        title="Témoignages"
        description="Affichés sur l'accueil et utilisés pour les avis (étoiles) en SEO. La note est facultative."
        action={replaceTestimonials}
        initial={content.testimonials}
        emptyItem={{ author: "", role: "", quote: "", rating: "" }}
        addLabel="Ajouter un témoignage"
        fields={[
          { key: "author", label: "Auteur", required: true },
          { key: "role", label: "Rôle / lieu (facultatif)", placeholder: "Pèlerin 2025, Rennes" },
          { key: "quote", label: "Témoignage", type: "textarea", rows: 3, required: true },
          { key: "rating", label: "Note sur 5 (facultatif)", type: "select", options: ["", "1", "2", "3", "4", "5"] },
        ]}
      />
    </AdminShell>
  );
}
