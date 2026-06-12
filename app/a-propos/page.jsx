import SimplePageView from "@/components/page/SimplePageView";
import { getSimplePage } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getSimplePage("apropos");
  return pageMeta({
    title: page?.meta_title || "À propos — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/a-propos",
    image: page?.hero_image_url,
  });
}

export default async function AProposPage() {
  const { page, nav, settings } = await getSimplePage("apropos");
  return <SimplePageView page={page} nav={nav} settings={settings} current="À propos" path="/a-propos" />;
}
