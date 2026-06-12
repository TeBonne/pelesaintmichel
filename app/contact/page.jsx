import SimplePageView from "@/components/page/SimplePageView";
import { getSimplePage } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getSimplePage("contact");
  return pageMeta({
    title: page?.meta_title || "Contact — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/contact",
    image: page?.hero_image_url,
  });
}

export default async function ContactPage() {
  const { page, nav, settings } = await getSimplePage("contact");
  return <SimplePageView page={page} nav={nav} settings={settings} current="Contact" path="/contact" showContact />;
}
