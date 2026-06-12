import SimplePageView from "@/components/page/SimplePageView";
import { getSimplePage } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getSimplePage("mentions");
  return pageMeta({
    title: page?.meta_title || "Mentions légales — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/mentions-legales",
    image: page?.hero_image_url,
  });
}

export default async function MentionsLegalesPage() {
  const { page, nav, settings } = await getSimplePage("mentions");
  return <SimplePageView page={page} nav={nav} settings={settings} current="Mentions légales" path="/mentions-legales" />;
}
